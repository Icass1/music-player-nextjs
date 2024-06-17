'use client'

import React, { useState, useEffect, useContext, useRef } from 'react';
import Image from 'next/image';
import { MediaPlayerContext } from '@/app/components/audioContext';
import { Song } from '@/app/components/songContainer';
import clsx from 'clsx';
import Animation from './animation';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';


function CircularProgressBar({ className = "", progress = 50, smooth = true, onClick }) {

    let jsxSmooth;
    if (smooth) {
        jsxSmooth = "transition: stroke-dasharray 0.3s linear;";
    } else {
        jsxSmooth = ""
    }

    return (
        <div className={classNames(className, 'rounded-full')} onClick={onClick}>
            <svg className='circular-progress absolute' viewBox="0 0 250 250">
                <circle className="bg"></circle>
                <circle className="fg"></circle>
            </svg>

            <style jsx> {`

                .circular-progress {
                    --progress: ${progress};
                    --size: 250px;
                    --half-size: calc(var(--size) / 2);
                    --stroke-width: 20px;
                    --radius: calc((var(--size) - var(--stroke-width)) / 2);
                    --circumference: calc(var(--radius) * 3.141592653589793 * 2);
                    --dash: calc((var(--progress) * var(--circumference)) / 100);
                    position: absolute;
                    width: calc(100%);
                    height: calc(100%);
                    viewBox: 0 0 250 250;
                }

                .circular-progress circle {
                    cx: var(--half-size);
                    cy: var(--half-size);
                    r: var(--radius);
                    stroke-width: var(--stroke-width);
                    fill: none;
                    stroke-linecap: round;
                }

                .circular-progress circle.bg {
                    stroke: transparent);
                }

                .circular-progress circle.fg {
                    transform: rotate(-90deg);
                    transform-origin: var(--half-size) var(--half-size);
                    stroke-dasharray: var(--dash) calc(var(--circumference) - var(--dash));
                    {*transition: stroke-dasharray 0.3s linear;*}
                    ${jsxSmooth}
                    stroke: black;
                }


                {*
                .icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    height: 70%;
                    width: 70%;
                }
                *}
      
                {*@keyframes progress-animation {
                    from {
                        --progress: 0;
                    }
                    to {
                        --progress: 100;
                    }
                }
      
                @property --progress {
                    syntax: "<number>";
                    inherits: false;
                    initial-value: 0;
                }
            
                .circular-progress {
                    animation: progress-animation 5s linear 0s 1 forwards;
                }*}

            `}</style>

        </div>
    )
}

export default function DefaultListPage({ listId, musicData }) {

    const {
        audio,
        currentList,
        setCurrentList,
        setCurrentSong,
        isPlaying,
        setQueue,
        setQueueIndex,
        randomQueue,
    } = useContext(MediaPlayerContext);

    const [showingMusicData, setShowingMusicData] = useState({
        songs: [],
        author: '',
        id: '',
        name: '',
        type: '',
        cover_url: '',
    });

    const [searchResult, setSearchResult] = useState([]);
    const searchBox = useRef();

    const [backgroundGradient, setBackgroundGradient] = useState('');
    const [genres, setGenres] = useState([]);
    const [sortingBy, setSortingBy] = useState({ 'filter': 'artist', 'direction': 1 });

    const [animationValue, toggleAnimation] = Animation(56, 56, 200, 10);

    const [downloadingURL, setdownloadingURL] = useState('');
    const [downloadProgress, setDownloadProgress] = useState(undefined);
    const [downloadSmooth, setDownloadSmooth] = useState(true);

    // document in undefined on server so using document.location.pathname directly gives an annoying error. 
    // let pathName;
    // if (typeof (window) === "undefined") {
    //     pathName = "";
    // } else {
    //     pathName = document.location.pathname;
    // }

    const pathname = usePathname()

    useEffect(() => {

        let tempMusicData = {};
        Object.assign(tempMusicData, musicData);

        let genres = {}

        for (let song of tempMusicData.songs) {
            if (genres[song.genre]) {
                genres[song.genre] += 1
            } else {
                genres[song.genre] = 1
            }
        }

        genres = Object.entries(genres).filter(genre => !(genre[0] == "" || genre[0] == 'null'));
        genres.sort((a, b) => b[1] - a[1]); // Sort in descending order
        genres = genres.map(a => a[0]);
        // genres = Object.fromEntries(genres);


        setGenres(genres);
        sort(tempMusicData.songs, sortingBy.filter, sortingBy.direction);

        setShowingMusicData(tempMusicData);

    }, [musicData, sortingBy]);

    useEffect(() => {

        if (downloadingURL == "") { return };

        const eventSource = new EventSource(downloadingURL);

        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.status == "compress-ended") {
                setDownloadProgress(100);
                setdownloadingURL("");
                eventSource.close();

                setTimeout(() => {
                    setDownloadSmooth(false);
                    setDownloadProgress(undefined);
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
                setDownloadProgress(0);
            } else if (message.status == "compressing") {
                setDownloadSmooth(true);
                console.log(message.progress);
                setDownloadProgress(message.progress);
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
            setdownloadingURL("");
            setDownloadProgress(0);
        };

        return () => {
            eventSource.close();
        };
    }, [downloadingURL]);

    function sort(dict, sortBy, direction) {

        dict.sort(function (a, b) {
            let titleA = a[sortBy];
            let titleB = b[sortBy];
            if (titleA != null) { titleA = titleA.toUpperCase(); };
            if (titleB != null) { titleB = titleB.toUpperCase(); };

            if (titleA < titleB || titleA == null) {
                return direction * -1;
            }
            if (titleA > titleB || titleB == null) {
                return direction;
            }

            return 0;
        });

        return dict;
    }

    const handlePauseClick = () => {
        audio.pause();
    }

    const handlePlayClick = () => {
        if (listId == currentList) {
            audio.play();
        } else {

            let _list = [...musicData.songs].filter(song => { if (song.in_database == false) { return false } else { return true } });

            if (_list.length == 0) {
                return;
            }

            if (randomQueue) {
                _list.sort(() => Math.random() - 0.5);
            }

            // audio.src = `https://api.music.rockhosting.org/api/song/${_list[0].id}`;
            // audio.play();

            setQueue(_list);
            setQueueIndex(0);
            setCurrentSong(_list[0]);
            setCurrentList(listId);
        }
    };

    function showGradient(e) {

        const image = e.target;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, 640, 640);

        let rSum = 0;
        let gSum = 0;
        let bSum = 0;

        function getPixel(imageData, x, y) {
            let pixelRed = imageData.data[y * (imageData.width * 4) + x * 4 + 0];
            let pixelGreen = imageData.data[y * (imageData.width * 4) + x * 4 + 1];
            let pixelBlue = imageData.data[y * (imageData.width * 4) + x * 4 + 2];

            return [pixelRed, pixelGreen, pixelBlue];
        }

        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                let pixel = getPixel(imageData, x, y);
                rSum += pixel[0];
                gSum += pixel[1];
                bSum += pixel[2];
            }
        }

        let backgroundColor = `rgb(${rSum / (image.width * image.height)}, ${gSum / (image.width * image.height)}, ${bSum / (image.width * image.height)})`;

        setBackgroundGradient(backgroundColor);
    }

    const handleSort = (e) => {

        console.log("handleSort");

        let sortBy;
        let direction;
        if (e.target.textContent == "Title") {
            sortBy = 'title';
        } else if (e.target.textContent == "Artist") {
            sortBy = 'artist';
        } else if (e.target.textContent == "Album") {
            sortBy = 'album';
        } else if (e.target.textContent == "Genre") {
            sortBy = 'genre';
        } else if (e.target.textContent == "Time") {
            sortBy = 'duration';
        } else {
            console.error(e.target.textContent);
            return;
        }

        if (sortingBy.filter == sortBy) {
            direction = sortingBy.direction * -1;
        } else {
            direction = 1;
        }

        setSortingBy({ "filter": sortBy, "direction": direction });

        let tempMusicData = {};
        Object.assign(tempMusicData, showingMusicData);

        sort(tempMusicData.songs, sortBy, direction);

        setShowingMusicData(tempMusicData);
    }

    const handleSearch = debounce((e) => {

        if (e.target.value == "") {
            setSearchResult([]);
            return;
        }

        let result = showingMusicData.songs.map((song, index) => {
            if (song.search.includes(e.target.value.toUpperCase())) {
                return index;
            } else {
                return undefined;
            }
        }).filter(value => (value != undefined));

        let songsOut = [];

        songsOut = result.map(value => showingMusicData.songs[value]);

        setSearchResult(songsOut);
    }, 300);

    useEffect(() => {
        if (animationValue == 200) {
            searchBox.current.focus();
        }
    }, [animationValue]);

    return (
        <>
            <div className='relative h-full'>
                <div className='overflow-hidden rounded-tl-md min-h-full'>
                    <div className='grid gap-2 h-[540px] md:h-[700px] mb-[-380px]' style={{ gridTemplateColumns: 'max-content 1fr', background: `linear-gradient(0deg, transparent, ${backgroundGradient})` }}>
                        <Image
                            alt={musicData.name}
                            className='m-2 shadow-lg rounded-2xl w-32 h-32 md:w-72 md:h-72'
                            src={musicData.cover_url ? (musicData.cover_url) : ('https://api.music.rockhosting.org/images/defaultAlbum.png')}
                            width={300}
                            height={300}
                            onLoad={showGradient}
                        />
                        <div className='grid inherit' style={{ gridTemplateRows: 'max-content max-content max-content max-content' }}>

                            <label className='h-2 md:hidden'></label>

                            <div
                                className='hidden md:block mt-20 mb-2 h-16 w-16 bg-yellow-600 rounded-full bottom-4 left-4 cursor-pointer'
                                onClick={currentList == listId && isPlaying ? (handlePauseClick) : (handlePlayClick)}
                            >
                                <Image
                                    src={currentList == listId && isPlaying ? (`https://api.music.rockhosting.org/images/pause.svg`) : (`https://api.music.rockhosting.org/images/play.svg`)}
                                    height={40}
                                    width={40}
                                    className='relative ml-auto mr-auto top-1/2 -translate-y-1/2'
                                    title={currentList == listId && isPlaying ? ("Pause") : ("Play")}
                                    alt=""
                                />
                            </div>


                            <label className='text-3xl md:text-5xl fade-out-neutral-200 font-bold mt-8 md:mt-0 min-w-0 md:min-h-14 max-w-full'>{musicData.name}</label>
                            <label className='text-xl md:text-2xl fade-out-neutral-400 min-w-0 max-w-full'>{musicData.author}</label>
                            <label className='text-lg md:text-xl fade-out-neutral-400 min-w-0 max-w-full'>Genres | {genres?.join(", ")}</label>
                        </div>
                    </div>

                    {musicData.type == "Album" ? (
                        // Album column titles
                        <div className='grid ml-3 mr-3 items-center rounded-md gap-2' style={{ gridTemplateColumns: '50px 1fr 60px' }}>
                            <div></div>
                            <div className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Title</div>
                            <div className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Time</div>
                        </div>
                    ) : (
                        // Playlist column titles
                        <div className='grid gap-x-2 ml-3 mr-3' style={{ gridTemplateColumns: '50px 3fr 1fr 1fr max-content 60px' }}>
                            <label></label>
                            <div className='flex gap-1 items-center'>
                                <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Title</label>
                                <label className='font-bold text-sm text-neutral-300 select-none'>/</label>
                                <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Artist</label>
                            </div>
                            <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Genre</label>
                            <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Album</label>
                            {/* <label className={clsx({ 'w-[30px]': usePathname("/s/") })}></label> */}
                            <label className={pathname.includes("/s/") ? "w-[30px]" : ""}></label>
                            <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Time</label>
                        </div>
                    )}

                    {showingMusicData.songs.filter(x => searchResult.includes(x)).map((item, index) => (
                        <Song key={index + "searchresult"} type={musicData.type} songsList={musicData.songs} listId={listId} song={item} index={index} />
                    ))}

                    {searchResult.length != 0 ? (
                        <div className='grid ml-5 mr-5 items-center' style={{ gridTemplateColumns: '1fr max-content 1fr' }}>
                            <div className='h-2 bg-yellow-600 rounded-lg'></div>
                            <label className='text-center ml-2 mr-3'>End of search results</label>
                            <div className='h-2 bg-yellow-600 rounded-lg'></div>
                        </div>
                    ) : (
                        <></>
                    )}

                    {showingMusicData.songs.filter(x => !searchResult.includes(x)).map((item, index) => (
                        <Song key={index} type={musicData.type} songsList={musicData.songs} listId={listId} song={item} index={index} />
                    ))}
                    <div className='hidden md:h-20 md:block' />
                </div>

            </div>
            <div className='hidden md:block fixed  flex-row h-14 bg-yellow-600 rounded-full bottom-5 right-6' style={{ width: animationValue }}>
                <Image
                    src="https://api.music.rockhosting.org/images/search.svg"
                    width={35}
                    height={35}
                    className='relative top-1/2 -translate-y-1/2 left-[28px] -translate-x-1/2 select-none cursor-pointer w-[35px] h-[35px]'
                    onClick={toggleAnimation}
                    alt=''
                    title='Click to search in list'
                />
                {/* <input className='realtive mt-auto mb-auto h-[30px] ml-4 mr-14 bg-transparent border-b-2 border-solid border-neutral-900 focus:outline-none text-black' style={{width: '-webkit-fill-available'}}/> */}
                <input
                    ref={searchBox}
                    className='realtive mt-auto mb-auto ml-4 h-[30px] bg-transparent border-b-2 border-solid border-neutral-900 focus:outline-none text-black'
                    style={{ width: 'calc(100% - 70px)' }}
                    onInput={handleSearch}
                />
            </div>
            <div
                className='hidden md:block fixed h-14 w-14 bg-yellow-600 rounded-full bottom-5 cursor-pointer ml-2'
                onClick={
                    // () => { setdownloadingURL(`http://12.12.12.3:1234/api/compress-list/${listId}`) }
                    () => { setdownloadingURL(`https://api.music.rockhosting.org/api/compress-list/${listId}`) }
                }
            >
                {downloadProgress == undefined ? (
                    <></>
                ) : (
                    <CircularProgressBar
                        className='absolute h-14 w-14 bg-yellow-600 rounded-full cursor-pointer'
                        progress={downloadProgress}
                        smooth={downloadSmooth}
                    />
                )}
                <Image src='https://api.music.rockhosting.org/images/download.svg' height={35} width={35} className='relative ml-auto mr-auto top-1/2 -translate-y-1/2' alt='' />
            </div>
        </>
    );
}