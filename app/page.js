'use client'

// import Link from 'next/link';
import { Link } from 'next-view-transitions'

import React, { useState, useEffect, useContext, useRef, useCallback, cloneElement } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { MediaPlayerContext } from './components/audioContext';
import Equalizer from './components/equalizer';
import { ScrollContext } from './components/scrollContext';
import ContextMenu from './components/contextMenu';
import SelectionArea from './components/selectionArea';
import { useSession } from "next-auth/react";
import { apiFetch } from './utils/apiFetch';
import getImageMeanColor from './utils/getImageMeanColor';
import useWindowWidth from './hooks/useWindowWidth';
// import { addList } from './utils/storage';

// addList("gK5eJjv9BRoysWh8")

export default function Home() {

    const [musicData, setMusicData] = useState(null);
    const session = useSession();
    const { scrollValue, setScrollValue } = useContext(ScrollContext);
    const { homeView } = useContext(MediaPlayerContext);
    const [scrollRestored, setScrollRestored] = useState(false);
    const mainRef = useRef();

    useEffect(() => {
        if (session?.status != "authenticated") { return }

        apiFetch(`https://api.music.rockhosting.org/api/user/get-lists`, session).then(response => {

            if (response.status !== 200) {
                setMusicData({ status: response.status })
                return
            }
            return response.json()
        }).then(data => {
            if (data) {
                setMusicData(data);
            }
        })
    }, [session]);


    useEffect(() => {
        if (scrollRestored) { return }
        if (mainRef.current) {
            setTimeout(() => {
                mainRef.current.parentNode.scrollTop = scrollValue;
            }, 100);
            mainRef.current.parentNode.onscroll = (e) => { window.location.pathname == "/" ? (setScrollValue(e.target.scrollTop)) : (null) }
            setScrollRestored(true)
        }
    }, [mainRef, setScrollValue, scrollValue, scrollRestored])

    const renderView = (homeView) => {
        switch (homeView?.view) {
            case 0:
                return <GridLayout musicData={musicData} setMusicData={setMusicData} ></GridLayout>
            case 1:
                return <ListWithNameLayout musicData={musicData} setMusicData={setMusicData}></ListWithNameLayout>
            default:
                return <GridLayout musicData={musicData} setMusicData={setMusicData} ></GridLayout>
        }
    };

    return (
        <>
            <div className='flex flex-row md:hidden mt-3 ml-3 gap-4'>
                <Link className='relative block md:hidden fg-1 w-12 h-12 rounded-full' href='/user'>
                    <Image
                        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
                        src={session.status == "authenticated" ? session?.data?.user?.image : 'https://api.music.rockhosting.org/images/user.svg'}
                        width={40}
                        height={40}
                        alt='User icon'
                    />
                </Link>
            </div>

            {function () {
                if (session.status == "unauthenticated") {
                    return (
                        <div className="block relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96">
                            <label className="block relative text-xl text-center">You are not loged in.</label>
                            <Link className="block relative font-bold text-2xl text-green-600 text-center" href="/login">Login</Link>
                        </div>
                    )
                } else if (session?.status == "loading" || musicData == null) {
                    return <div className='relative text-3xl font-bold top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2'>Loading your lists...</div>
                } else if (musicData.length == 0) {
                    return (<div className='relative w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <div className='w-auto text-center text-3xl font-bold'>It feels lonely here...</div>
                        <div className='flex md:flex-row flex-col gap-2'>
                            <div className='w-auto text-center text-xl font-bold ml-2 mr-2'>Click in the search button to add lists to your library</div>
                            <Link className="block relative left-1/2 -translate-x-1/2 md:left-0 md:-translate-x-0 w-fit" href="/search">
                                <Image className="block invert-[0.8] hover:invert-[0.7] select-none" src='https://api.music.rockhosting.org/images/search.svg' width={30} height={30} alt="Search" />
                            </Link>
                        </div>
                    </div>)
                } else if (musicData.status) {
                    return (
                        <div className='relative text-3xl font-bold top-1/2 left-1/2 w-fit text-center -translate-x-1/2 -translate-y-1/2 flex flex-col'>
                            <label>Unable to load your lists</label>
                            <label className='text-neutral-600 text-lg'>Error: {musicData.status}</label>
                        </div>
                    )
                } else {
                    return (
                        <div
                            ref={mainRef}
                            className="overflow-x-hidden"
                        >
                            {renderView(homeView)}
                        </div>
                    )
                }
            }()}
        </>
    );
}

function AddContextMenu({ children, item, setDownloadProgress, setMusicData }) {
    const { currentList, isPlaying, randomQueue, setCurrentList, audio, setQueue, setQueueIndex, setCurrentSong, queue, queueIndex } = useContext(MediaPlayerContext);
    const session = useSession()

    const [downloadingID, setDownloadingID] = useState('');
    const [downloadSmooth, setDownloadSmooth] = useState(true);

    useEffect(() => {

        if (downloadingID == "") { return };

        const eventSource = new EventSource(`https://api.music.rockhosting.org/api/compress-list/${downloadingID}`);

        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.status == "compress-ended") {
                setDownloadProgress({ id: downloadingID, progress: 100 });
                setDownloadingID("");
                eventSource.close();

                setTimeout(() => {
                    setDownloadSmooth(false);
                    setDownloadProgress({ id: downloadingID, progress: 0 });
                }, 1000);

                // let uri = `http://12.12.12.3:8000/api/download-list/${message.outputName}`;
                let uri = `https://api.music.rockhosting.org/api/download-list/${message.outputName}`;
                let link = document.createElement("a");
                link.href = uri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } else if (message.status == "compress-started") {
                setDownloadSmooth(true);
                setDownloadProgress({ id: downloadingID, progress: 0 });
            } else if (message.status == "compressing") {
                setDownloadSmooth(true);
                console.log(message.progress);
                setDownloadProgress({ id: downloadingID, progress: message.progress });
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
            setDownloadingID("");
            setDownloadProgress({ id: downloadingID, progress: 0 });
        };

        return () => {
            eventSource.close();
        };
    }, [downloadingID, setDownloadProgress]);


    const handlePlayList = (id) => {

        fetch(`https://api.music.rockhosting.org/api/list/${id}`)
            .then(response => response.text())
            .then(data => JSON.parse(data))
            .then(musicData => {

                let _list = [...musicData.songs].filter(song => { if (song.in_database == false) { return false } else { return true } });

                if (_list.length == 0) {
                    return;
                }

                if (randomQueue) {
                    _list.sort(() => Math.random() - 0.5);
                }

                // audio.src = `https://api.music.rockhosting.org/api/song/${_list[0].id}`;

                setQueue(_list);
                setQueueIndex(0);
                setCurrentSong(_list[0]);
                setCurrentList(id);
                audio.play();
            })
    }

    const handleDownloadList = (id) => {
        setDownloadingID(id)
    }
    const handleAddListToQueue = (id) => {
        fetch(`https://api.music.rockhosting.org/api/list/${id}`)
            .then(response => response.text())
            .then(data => JSON.parse(data))
            .then(musicData => {

                let _list = [...musicData.songs].filter(song => { if (song.in_database == false) { return false } else { return true } });

                if (_list.length == 0) {
                    return;
                }

                if (randomQueue) {
                    _list.sort(() => Math.random() - 0.5);
                }

                let tempQueue = queue.slice(0, queueIndex + 1)
                let tempEndQueue = queue.slice(queueIndex + 1)

                setQueue(tempQueue.concat(_list).concat(tempEndQueue))
            })
    }

    const handleAddListToBottomQueue = (id) => {
        fetch(`https://api.music.rockhosting.org/api/list/${id}`)
            .then(response => response.text())
            .then(data => JSON.parse(data))
            .then(musicData => {

                let _list = [...musicData.songs].filter(song => { if (song.in_database == false) { return false } else { return true } });

                if (_list.length == 0) {
                    return;
                }

                if (randomQueue) {
                    _list.sort(() => Math.random() - 0.5);
                }
                setQueue(queue.concat(_list))
            })
    }

    const handleRemoveList = (id) => {
        apiFetch(`https://api.music.rockhosting.org/api/user/remove-list`, session, { method: "POST", body: JSON.stringify({ list_id: id }) }).then(response => response.json()).then(data => {
            setMusicData(data);
        })
    }

    return (
        <ContextMenu
            options={{
                "Play": () => handlePlayList(item.id),
                "Download": () => handleDownloadList(item.id),
                "Add to queue": () => handleAddListToQueue(item.id),
                "Add to bottom of queue": () => handleAddListToBottomQueue(item.id),
                "Remove from library": () => { handleRemoveList(item.id) },
            }}
        >
            {children}
        </ContextMenu>
    )
}

function GridContainer({ item, setMusicData }) {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const { currentList } = useContext(MediaPlayerContext);

    const [background, setBackground] = useState()

    return (
        <AddContextMenu item={item} setMusicData={setMusicData} setDownloadProgress={setDownloadProgress}>
            <Link
                href={`/list/${item.id}`}
                className={`rounded-lg grid grid-cols-2 md:bg-3 md:hover:brightness-110 transition-all md:shadow-lg`}
                style={{ gridTemplateColumns: '50px 1fr', backgroundColor: background }}
            >
                <Image
                    src={`https://api.music.rockhosting.org/api/list/image/${item.id}_50x50`}
                    width={50}
                    height={50}
                    className='rounded-lg'
                    alt={item.name}
                // onLoad={(e) => { setBackground(getImageMeanColor(e.target, 16, [64, 64, 64])) }}
                ></Image>
                <div className='grid h-[50px]' style={{ gridTemplateRows: 'max-content max-content' }}>
                    <label className={clsx('pl-3 pr-3 text-lg fade-out-neutral-200 font-bold cursor-pointer h-6 overflow-y-hidden min-w-0 max-w-full', { 'fade-out-fg-1': item.id == currentList })}>{item.name}</label>
                    <label className={clsx('pl-3 pr-3 fade-out-neutral-200 cursor-pointer min-w-0 max-w-full', { 'fade-out-fg-2': item.id == currentList })}>{item.author}</label>
                </div>
            </Link>
        </AddContextMenu>
    )
}

function GridLayout({ musicData, setMusicData }) {

    return (
        <div className='grid gap-2 p-2' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {musicData.map((item) => (
                <GridContainer key={item.id} item={item} setMusicData={setMusicData} />
            ))}
        </div>
    )
}

function ListWithNameLayout({ musicData, setMusicData }) {

    const { currentList, isPlaying } = useContext(MediaPlayerContext);
    const innerWidth = useWindowWidth()

    const [downloadProgress, setDownloadProgress] = useState(0);

    let listsByName = {};
    let listsByNameTemp = {};

    for (let i of musicData) {
        if (listsByName[i.author] == undefined) {
            listsByName[i.author] = [];
        }
        listsByName[i.author].push(i);
    }

    for (let k of Object.keys(listsByName).sort()) {
        listsByNameTemp[k] = listsByName[k];
    }

    listsByName = listsByNameTemp;

    return (
        <>
            {
                Object.keys(listsByName).map((author) => (
                    <div key={author} className='m-2 mb-4'>
                        <label className='text-2xl md:text-4xl font-bold'>{author}</label>
                        <div className='grid gap-2 mt-1' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${innerWidth > 768 ? '350px' : '150px'}, 1fr))` }}>
                            {listsByName[author].map((item) => (
                                <AddContextMenu key={item.id} item={item} setDownloadProgress={setDownloadProgress} setMusicData={setMusicData}>
                                    <Link
                                        href={`/list/${item.id}`}
                                        className={
                                            clsx('rounded-lg grid grid-cols-2 bg-3 md:hover:brightness-110 transition-all items-center shadow-lg h-12 md:h-[50px]')
                                        }
                                        style={{
                                            gridTemplateColumns: 'max-content 1fr min-content',
                                            gridTemplateRows: '100%',
                                            background: downloadProgress.id == item.id ? `linear-gradient(90deg, rgb(100 100 100) 0%, rgb(100 100 100) ${downloadProgress.progress - 5}%, rgb(64 64 64) ${downloadProgress.progress}%, rgb(64 64 64) 100%)` : ''
                                        }}
                                    >

                                        <Image src={`https://api.music.rockhosting.org/api/list/image/${item.id}_50x50`} width={50} height={50} className='rounded-lg w-12 h-12 md:w-[50px] md:h-[50px]' alt={item.name}></Image>
                                        <label className={clsx('ml-2 text-lg md:text-2xl pr-3 fade-out-neutral-200 font-bold cursor-pointer min-w-0 max-w-full', { 'fade-out-fg-1': item.id == currentList })}>{item.name}</label>

                                        {item.id == currentList && isPlaying ? (
                                            <Equalizer className='w-8 md:w-20 h-full p-1' bar_count={innerWidth > 768 ? 15 : 6} bar_gap={1} centered={true} />
                                        ) : (
                                            <div></div>
                                        )}
                                    </Link>
                                </AddContextMenu>
                            ))}
                        </div>
                    </div >
                ))
            }
        </>
    )
}
