'use client';

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { AudioContext } from '@/app/components/audioContext';

export default function ListPage({ params }) {

    const {
        audio,
        currentList,
        setCurrentList,
        setCurrentSong,
        isPlaying,
        setQueue,
        setQueueIndex,
    } = useContext(AudioContext);

    const [musicData, setMusicData] = useState({
        songs: [],
        author: '',
        id: '',
        name: '',
        type: '',
    });

    const [backgroundGradient, setBackgroundGradient] = useState('');
    const [genres, setGenres] = useState([]);
    const [sortingBy, setSortingBy] = useState({ 'filter': 'title', 'direction': 1 });

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

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.music.rockhosting.org/api/list/${params.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            let genres = {}

            for (let song of data.songs) {
                if (genres[song.genre]) {
                    genres[song.genre] += 1
                } else {
                    genres[song.genre] = 1
                }
            }

            genres = Object.entries(genres);
            genres.sort((a, b) => b[1] - a[1]); // Sort in descending order
            genres = genres.map(a => a[0])
            // genres = Object.fromEntries(genres);

            setGenres(genres)
            sort(data.songs, sortingBy.filter, sortingBy.direction);
            setMusicData(data);
        };
        fetchData();
    }, [params, sortingBy]);

    const handlePauseClick = () => {
        audio.pause();
    }

    const handlePlayClick = () => {
        if (params.id == currentList) {
            audio.play();
        } else {
            audio.src = `https://api.music.rockhosting.org/api/song/${musicData.songs[0].id}`;
            audio.play();

            setQueue(musicData.songs);
            setQueueIndex(0);
            setCurrentSong(musicData.songs[0]);
            setCurrentList(params.id);
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

        setSortingBy({"filter": sortBy, "direction": direction});

        let tempMusicData = {};
        Object.assign(tempMusicData, musicData);

        sort(tempMusicData.songs, sortBy, direction);
        setMusicData(tempMusicData);
    }

    return (
        <div className='overflow-hidden min-h-full'>
            {/* <div className='relative w-full h-96' style={{background: `linear-gradient(0deg, transparent, ${backgroundGradient})`}}></div> */}
            <div className='grid gap-2 h-[700px] mb-[-400px]' style={{ gridTemplateColumns: '300px 1fr', background: `linear-gradient(0deg, transparent, ${backgroundGradient})` }}>
                <Image alt={musicData.name} className='p-2 rounded-2xl' src={`https://api.music.rockhosting.org/api/list/image/${params.id}_300x300`} width={300} height={300} onLoad={showGradient} />
                <div className='grid inherit' style={{ gridTemplateRows: '160px 50px 40px 30px' }}>
                    {currentList == params.id && isPlaying ?
                        <Image alt='A' className='mt-20 cursor-pointer bg-yellow-400 rounded-full p-2.5' src={`https://api.music.rockhosting.org/images/pause.svg`} width={70} height={70} onClick={handlePauseClick} />
                        :
                        <Image alt='A' className='mt-20 cursor-pointer bg-yellow-400 rounded-full pl-2.5 pt-2 pb-2 pr-1.5' src={`https://api.music.rockhosting.org/images/play.svg`} width={70} height={70} onClick={handlePlayClick} />
                    }
                    <label className='text-5xl fade-out-neutral-200 font-bold min-w-0 max-w-full'>{musicData.name}</label>
                    <label className='text-2xl fade-out-neutral-400 min-w-0 max-w-full'>{musicData.author}</label>
                    <label className='text-xl fade-out-neutral-400 min-w-0 max-w-full'>Genres | {genres?.join(", ")}</label>
                </div>
            </div>

            {musicData.type == "Album" ?
                // Album column titles
                <div className='grid ml-3 mr-3 items-center rounded-md' style={{ gridTemplateColumns: '50px 1fr 60px' }}>
                    <div></div>
                    <div className='font-bold text-lg text-neutral-300 cursor-pointer select-none' onClick={handleSort}>Title</div>
                    <div className='font-bold text-lg text-neutral-300 cursor-pointer select-none' onClick={handleSort}>Time</div>
                </div>
                :
                // Playlist column titles
                <div className='grid gap-x-2 ml-3 mr-3' style={{ gridTemplateColumns: '50px 3fr 1fr 1fr 60px' }}>
                    <label></label>
                    <div className='flex gap-1 items-center'>
                        <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none' onClick={handleSort}>Title</label>
                        <label className='font-bold text-sm text-neutral-300 select-none'>/</label>
                        <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none' onClick={handleSort}>Artist</label>
                    </div>
                    <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none' onClick={handleSort}>Genre</label>
                    <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none' onClick={handleSort}>Album</label>
                    <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none' onClick={handleSort}>Time</label>
                </div>
            }

            {musicData.songs.map((item, index) => (
                <Song key={index} type={musicData.type} listSongs={musicData.songs} listId={params.id} song={item} index={index}></Song>
            ))}
        </div>
    );
};

function Song({ type, listSongs, index, song, listId }) {
    if (type == "Album") {
        return (
            <AlbumSong key={index} listSongs={listSongs} song={song} index={index} listId={listId}></AlbumSong>
        )
    } else if (type == "Playlist") {
        return (
            <PlaylistSong key={index} listSongs={listSongs} song={song} index={index} listId={listId}></PlaylistSong>
        )
    } else {
        return (
            <div>Error</div>
        )
    }
}

function AlbumSong({ index, listSongs, song, listId }) {

    const { audio, setCurrentSong, currentSong, setCurrentList, currentList, setQueue, setQueueIndex } = useContext(AudioContext);

    function handlePlayClick() {
        if (currentSong.id == song.id) {
            audio.currentTime = 0;
            audio.play()
        } else {

            let index = listSongs.indexOf(song)
            let list = listSongs.slice(index).concat(listSongs.slice(0, index))

            audio.src = `https://api.music.rockhosting.org/api/song/${song.id}`;
            audio.play();

            setQueue(list);
            setQueueIndex(0);
            setCurrentSong(song);
            setCurrentList(listId);
        }
    };

    return (
        <div className='grid ml-3 mr-3 mt-2 mb-2 items-center cursor-pointer hover:bg-neutral-800 rounded-md h-[50px]' style={{ gridTemplateColumns: '50px 1fr 60px' }} onClick={handlePlayClick}>
            <div className={clsx('text-xl text-neutral-400 text-center', { 'text-yellow-600': song.id == currentSong.id && currentList == listId })}>{index + 1}</div>
            <div className={clsx('text-2xl fade-out-neutral-300 min-w-0 max-w-full', { 'fade-out-yellow-600': song.id == currentSong.id && currentList == listId })}>{song.title}</div>
            <div className={clsx('text-xl text-neutral-400', { 'text-yellow-600': song.id == currentSong.id && currentList == listId })}>{song.duration}</div>
        </div>
    )
}

function PlaylistSong({ index, listSongs, song, listId }) {

    const { audio, setCurrentSong, currentSong, setCurrentList, setQueue, setQueueIndex } = useContext(AudioContext);

    function handlePlayClick() {
        if (currentSong.id == song.id) {
            audio.currentTime = 0;
            audio.play()
        } else {

            let index = listSongs.indexOf(song)
            let list = listSongs.slice(index).concat(listSongs.slice(0, index))

            audio.src = `https://api.music.rockhosting.org/api/song/${song.id}`;
            audio.play();

            setQueue(list);
            setQueueIndex(0);
            setCurrentSong(song);
            setCurrentList(listId);
        }
    };

    return (
        <div className='grid gap-x-2 ml-3 mr-3 m-3 cursor-pointer rounded-md items-center hover:bg-neutral-800' style={{ gridTemplateColumns: '50px 3fr 1fr 1fr 60px' }} onClick={handlePlayClick}>
            <Image className='rounded-md' alt={song.title} src={`https://api.music.rockhosting.org/api/song/image/${song.id}_50x50`} width={50} height={50} />
            <div className='flex flex-col cursor-pointer min-w-0 max-w-full'>
                <label className={clsx('cursor-pointer text-xl fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-yellow-500': song.id == currentSong.id })}>{song.title}</label>
                <label className={clsx('cursor-pointer fade-out-neutral-300 min-w-0 max-w-full', { 'fade-out-yellow-600': song.id == currentSong.id })}>{song.artist}</label>
            </div>
            <label className='fade-out-neutral-200 min-w-0 max-w-full' title={song.genre}>{song.genre}</label>
            <label className='fade-out-neutral-200 min-w-0 max-w-full' title={song.album}>{song.album}</label>
            <label className='fade-out-neutral-100 text-xl min-w-0 max-w-full text-center' title={song.duration}>{song.duration}</label>
        </div>
    )
}
