'use client'

import Link from 'next/link';
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

export default function Home() {

    const [musicData, setMusicData] = useState(null);
    const session = useSession();

    useEffect(() => {
        if (session?.status != "authenticated") { return }

        apiFetch(`https://api.music.rockhosting.org/api/user/get-lists`, session).then(response => response.json()).then(data => {
            setMusicData(data);
        })

    }, [session]);

    return (
        <>
            <div className='flex flex-row md:hidden mt-3 ml-3 gap-4'>
                <Link className='relative block md:hidden bg-yellow-600 w-12 h-12 rounded-full' href='/login'>
                    <Image
                        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
                        src={session.status == "authenticated" ? session?.data?.user?.image : 'https://api.music.rockhosting.org/images/user.svg'}
                        width={40}
                        height={40}
                        alt='User icon'
                    />
                </Link>

                <Link className='relative block md:hidden bg-white w-12 h-12 rounded-full ' href='/user'>
                    <div className='w-10 h-10 block relative bg-black rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <label className='block relative bg-black rounded-full text-center text-2xl font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>U</label>
                    </div>
                </Link>

            </div>

            {session?.status == "loading" ?
                // {session?.status ?
                <div className='relative text-3xl font-bold top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2'>Loading your lists...</div>
                :
                <>
                    {
                        musicData == null || musicData.length == 0 ?
                            <div className='relative w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                                <div className='w-auto text-center text-3xl font-bold'>It feels lonely here...</div>
                                <div className='flex md:flex-row flex-col gap-2'>
                                    <div className='w-auto text-center text-xl font-bold ml-2 mr-2'>Click in the search button to add lists to your library</div>
                                    <Link className="block relative left-1/2 -translate-x-1/2 md:left-0 md:-translate-x-0 w-fit" href="/search">
                                        <Image className="block invert-[0.8] hover:invert-[0.7] select-none" src='https://api.music.rockhosting.org/images/search.svg' width={30} height={30} alt="Search" />
                                    </Link>
                                </div>
                            </div>
                            :
                            <ListWithName musicData={musicData} setMusicData={setMusicData}></ListWithName>
                    }
                </>
            }
        </>
        // <Grid musicData={musicData}></Grid>
    );
}

function Grid({ musicData }) {
    const { currentList } = useContext(MediaPlayerContext);
    return (
        <div className='grid gap-2 p-2' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {musicData.map((item) => (
                <Link href={`/list/${item.id}`} key={item.id} className={
                    clsx('rounded-lg grid grid-cols-2 bg-neutral-800 hover:bg-neutral-700', { 'bg-yellow-700 hover:bg-yellow-600': item.id == currentList })
                } style={{ gridTemplateColumns: '50px 1fr' }}>
                    <Image src={`https://api.music.rockhosting.org/api/list/image/${item.id}_50x50`} width={50} height={50} className='rounded-lg' alt={item.name}></Image>
                    <div className='grid' style={{ gridTemplateRows: '24px 25px' }}>
                        <label className='pl-3 text-lg pr-3 fade-out-neutral-200 font-bold cursor-pointer min-w-0 max-w-full'>{item.name}</label>
                        <label className='pl-3 fade-out-neutral-300 cursor-pointer min-w-0 max-w-full'>{item.author}</label>
                    </div>
                </Link>
            ))}
        </div>
    )
}

function ListWithName({ musicData, setMusicData }) {

    const { scrollValue, setScrollValue } = useContext(ScrollContext);

    const mainRef = useRef();

    const [downloadingID, setDownloadingID] = useState('');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadSmooth, setDownloadSmooth] = useState(true);

    const [scrollRestored, setScrollRestored] = useState(false);

    const [innerWidth, setInnerWidth] = useState(0)

    const session = useSession()

    useEffect(() => {

        const handleResize = () => {
            setInnerWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        setInnerWidth(window.innerWidth)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

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
    }, [downloadingID]);

    const { currentList, isPlaying, randomQueue, setCurrentList, audio, setQueue, setQueueIndex, setCurrentSong, queue, queueIndex } = useContext(MediaPlayerContext);

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
        <div
            ref={mainRef}
            className="overflow-x-hidden"
        >
            {Object.keys(listsByName).map((author) => (
                <div key={author} className='m-2 mb-4'>
                    <label className='text-2xl md:text-4xl font-bold'>{author}</label>
                    <div className='grid gap-2 mt-1' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${innerWidth > 768 ? '350px' : '150px'}, 1fr))` }}>
                        {listsByName[author].map((item) => (
                            <ContextMenu
                                key={item.id}
                                options={{
                                    "Play": () => handlePlayList(item.id),
                                    "Download": () => handleDownloadList(item.id),
                                    "Add to queue": () => handleAddListToQueue(item.id),
                                    "Add to bottom of queue": () => handleAddListToBottomQueue(item.id),
                                    "Remove from library": () => { handleRemoveList(item.id) },
                                }}
                            >
                                <Link
                                    href={`/list/${item.id}`}
                                    className={
                                        clsx('rounded-lg grid grid-cols-2 bg-neutral-700 md:hover:bg-neutral-600 items-center shadow-lg h-12 md:h-[50px]')
                                    }
                                    style={{
                                        gridTemplateColumns: 'max-content 1fr min-content',
                                        gridTemplateRows: '100%',
                                        background: downloadProgress.id == item.id ? `linear-gradient(90deg, rgb(100 100 100) 0%, rgb(100 100 100) ${downloadProgress.progress - 5}%, rgb(64 64 64) ${downloadProgress.progress}%, rgb(64 64 64) 100%)` : ''
                                    }}
                                >

                                    <Image src={`https://api.music.rockhosting.org/api/list/image/${item.id}_50x50`} width={50} height={50} className='rounded-lg w-12 h-12 md:w-[50px] md:h-[50px]' alt={item.name}></Image>
                                    <label className={clsx('ml-2 text-lg md:text-2xl pr-3 fade-out-neutral-200 font-bold cursor-pointer min-w-0 max-w-full', { 'fade-out-yellow-600': item.id == currentList })}>{item.name}</label>

                                    {item.id == currentList && isPlaying ? (
                                        <Equalizer className='w-8 md:w-20 h-full p-1' bar_count={innerWidth < 768 ? 6 : 15} bar_gap={1} centered={true} />
                                    ) : (
                                        <div></div>
                                    )}
                                </Link>
                            </ContextMenu>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
