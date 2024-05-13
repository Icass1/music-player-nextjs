'use client'

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { MediaPlayerContext } from '@/app/components/audioContext';
import { Song } from '@/app/components/songContainer';
import clsx from 'clsx';
import Animation from './animation';



export default function DefaultListPage({ listId, musicData }) {

    const {
        audio,
        currentList,
        setCurrentList,
        setCurrentSong,
        isPlaying,
        setQueue,
        setQueueIndex,
    } = useContext(MediaPlayerContext);

    const [showingMusicData, setShowingMusicData] = useState({
        songs: [],
        author: '',
        id: '',
        name: '',
        type: '',
        cover_url: '',
    });

    const [backgroundGradient, setBackgroundGradient] = useState('');
    const [genres, setGenres] = useState([]);
    const [sortingBy, setSortingBy] = useState({ 'filter': 'artist', 'direction': 1 });

    const [animationValue, toggleAnimation] = Animation(56, 56, 200, 10)

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
        genres = genres.map(a => a[0])
        // genres = Object.fromEntries(genres);

        setGenres(genres)
        sort(tempMusicData.songs, sortingBy.filter, sortingBy.direction);


        setShowingMusicData(tempMusicData);

    }, [musicData])

    function sort(dict, sortBy, direction) {

        dict.sort(function (a, b) {
            let titleA = a[sortBy]
            let titleB = b[sortBy]
            if (titleA != null) { titleA = titleA.toUpperCase(); }
            if (titleB != null) { titleB = titleB.toUpperCase(); }

            if (titleA < titleB || titleA == null) {
                return direction * -1;
            }
            if (titleA > titleB || titleB == null) {
                return direction;
            }

            return 0;
        });

        return dict
    }

    const handlePauseClick = () => {
        audio.pause();
    }

    const handlePlayClick = () => {
        if (listId == currentList) {
            audio.play();
        } else {
            audio.src = `https://api.music.rockhosting.org/api/song/${musicData.songs[0].id}`;
            audio.play();

            setQueue(musicData.songs);
            setQueueIndex(0);
            setCurrentSong(musicData.songs[0]);
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

        console.log("handleSort")

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
        Object.assign(tempMusicData, musicData);

        sort(tempMusicData.songs, sortBy, direction);

        setShowingMusicData(tempMusicData);
    }

    // const toggleAnimation = () => {

    //     const interval = setInterval(() => {
    //         setAnimationValue((prevValue) => prevValue + 10);
    //         if (animationValue > 200) {
    //             clearInterval(interval)
    //         }

    //     }, 0);

    //     // if (animationValue == 56) {
    //     //     setAnimationValue(200)
    //     // } else {
    //     //     setAnimationValue(56)
    //     // }
    // }

    // document in undefined on server so using document.location.pathname directly gives an annoying error. 
    let pathName;
    if (typeof (window) === "undefined") {
        pathName = ""
    } else {
        pathName = document.location.pathname
    }

    return (
        <>
            <div className='overflow-hidden h-full overflow-y-scroll'>
                <div className='grid gap-2 h-[700px] mb-[-380px]' style={{ gridTemplateColumns: 'max-content 1fr', background: `linear-gradient(0deg, transparent, ${backgroundGradient})` }}>
                    <Image alt={musicData.name} className='m-2 shadow-lg rounded-2xl' src={musicData.cover_url ? (musicData.cover_url) : ('https://api.music.rockhosting.org/images/defaultAlbum.png')} width={300} height={300} onLoad={showGradient} />
                    <div className='grid inherit' style={{ gridTemplateRows: '160px 50px 40px 30px' }}>
                        {currentList == listId && isPlaying ?
                            <Image alt='A' className='mt-20 cursor-pointer bg-yellow-400 rounded-full p-2.5' src={`https://api.music.rockhosting.org/images/pause.svg`} width={70} height={70} onClick={handlePauseClick} />
                            :
                            <Image alt='A' className='mt-20 cursor-pointer bg-yellow-400 rounded-full pl-2.5 pt-2 pb-2 pr-1.5' src={`https://api.music.rockhosting.org/images/play.svg`} width={70} height={70} onClick={handlePlayClick} />
                        }
                        <label className='text-5xl fade-out-neutral-200 font-bold min-w-0 max-w-full'>{musicData.name}</label>
                        <label className='text-2xl fade-out-neutral-400 min-w-0 max-w-full'>{musicData.author}</label>
                        <label className='text-xl fade-out-neutral-400 min-w-0 max-w-full'>Genres | {genres?.join(", ")}</label>
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
                        <label className={clsx({ 'w-[30px]': pathName.includes("/s/") })}></label>
                        <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Time</label>
                    </div>
                )}

                {showingMusicData.songs.map((item, index) => (
                    <Song key={index} type={musicData.type} listSongs={musicData.songs} listId={listId} song={item} index={index} />
                ))}
            </div>

            <div className='flex flex-row absolute h-14 bg-yellow-600 rounded-full bottom-10 right-10' style={{ width: animationValue }}>
                <Image
                    src="https://api.music.rockhosting.org/images/search.svg"
                    width={35}
                    height={35}
                    className='relative top-1/2 -translate-y-1/2 left-[28px] -translate-x-1/2'
                    onClick={toggleAnimation}
                />
                {/* <input className='realtive mt-auto mb-auto h-[50px] left-14 right-1' style={{width: '-webkit-fill-available'}}/> */}
                <input className='realtive mt-auto mb-auto h-[30px] ml-4 mr-14 bg-transparent border-b-2 border-solid border-neutral-900 focus:outline-none text-black' style={{width: '-webkit-fill-available'}}/>
            </div>
        </>
    );
}