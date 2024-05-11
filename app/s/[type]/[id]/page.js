'use client';

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { MediaPlayerContext } from '@/app/components/audioContext';
import Equalizer from '@/app/components/equalizer';

export default function SearchListPage({ params }) {

    const {
        audio,
        currentList,
        setCurrentList,
        setCurrentSong,
        isPlaying,
        setQueue,
        setQueueIndex,
    } = useContext(MediaPlayerContext);

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
            const response = await fetch(`https://api.music.rockhosting.org/api/s/${params.type}/${params.id}`);
            // const response = await fetch(`http://12.12.12.3:8000/api/s/${params.type}/${params.id}`);
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

        setSortingBy({ "filter": sortBy, "direction": direction });

        let tempMusicData = {};
        Object.assign(tempMusicData, musicData);

        sort(tempMusicData.songs, sortBy, direction);
        setMusicData(tempMusicData);
    }

    return (
        <div className='overflow-hidden min-h-full'>

            <div className='grid gap-2 h-[700px] mb-[-380px]' style={{ gridTemplateColumns: 'max-content 1fr', background: `linear-gradient(0deg, transparent, ${backgroundGradient})` }}>
                <Image
                    alt={musicData.name}
                    className='m-2 shadow-lg rounded-2xl'
                    src={musicData.cover_url ? (musicData.cover_url) : ('https://api.music.rockhosting.org/images/defaultSong.png')}
                    width={300}
                    height={300}
                    onLoad={showGradient}
                />
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
                <div className='grid ml-3 mr-3 items-center rounded-md gap-2' style={{ gridTemplateColumns: '50px 1fr 60px' }}>
                    <div></div>
                    <div className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Title</div>
                    <div className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Time</div>
                </div>
                :
                // Playlist column titles
                <div className='grid gap-x-2 ml-3 mr-3' style={{ gridTemplateColumns: '50px 3fr 1fr 1fr 30px 60px' }}>
                    <label></label>
                    <div className='flex gap-1 items-center'>
                        <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Title</label>
                        <label className='font-bold text-sm text-neutral-300 select-none'>/</label>
                        <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Artist</label>
                    </div>
                    <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Genre</label>
                    <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Album</label>
                    <label></label>
                    <label className='font-bold text-lg text-neutral-300 cursor-pointer select-none hover:underline w-fit' onClick={handleSort}>Time</label>
                </div>
            }

            {musicData.songs.map((item, index) => (
                <Song key={index} type={musicData.type} listSongs={musicData.songs} listId={params.id} song={item} index={index}></Song>
            ))}
        </div>
    );
};

function Song({ type, listSongs, index, song, listId }) {

    return (
        <div>
            {type == "Album" ? (
                <AlbumSong key={index} listSongs={listSongs} song={song} index={index} listId={listId}></AlbumSong>
            ) : (
                <PlaylistSong key={index} listSongs={listSongs} song={song} index={index} listId={listId}></PlaylistSong>
            )}
        </div>
    )

}

function AlbumSong({ index, listSongs, song, listId }) {

    const { audio, setCurrentSong, currentSong, setCurrentList, randomQueue, currentList, setQueue, setQueueIndex, isPlaying } = useContext(MediaPlayerContext);

    function handlePlayClick() {

        if (!song.in_database) {
            return;
        }

        if (currentSong.id == song.id && currentList == listId) {
            audio.currentTime = 0;
            audio.play()
        } else {

            let _listSongs = listSongs.filter(song => song.in_database)

            let index = _listSongs.indexOf(song)
            let list = _listSongs.slice(index + 1).concat(_listSongs.slice(0, index))

            if (randomQueue) {
                list.sort(() => Math.random() - 0.5)
            }

            audio.src = `https://api.music.rockhosting.org/api/song/${song.id}`;
            audio.play();

            setQueue([song].concat(list));
            setQueueIndex(0);
            setCurrentSong(song);
            setCurrentList(listId);
        }
    };

    return (
        <div className='grid ml-3 mr-3 mt-2 mb-2 items-center cursor-pointer hover:bg-neutral-800 rounded-md h-[50px] gap-2' style={{ gridTemplateColumns: '50px 1fr max-content 60px', gridTemplateRows: '50px' }} onClick={handlePlayClick}>

            {song.id == currentSong.id && isPlaying ? (
                <Equalizer className='w-full h-full top-0' bar_count={10} bar_gap={1} centered={true} toggleCenter={false}></Equalizer>
            ) : (
                <label className={clsx('text-xl text-neutral-400 text-center cursor-pointer', { 'text-yellow-600': song.id == currentSong.id && currentList == listId })}>{index + 1}</label>
            )}

            <label className={clsx('relative text-2xl fade-out-neutral-300 min-w-0 max-w-full cursor-pointer', { 'fade-out-yellow-600': song.id == currentSong.id && currentList == listId })}>{song.title}</label>
            <Image
                src={song.in_database ? ("https://api.music.rockhosting.org/images/database2.webp") : ("https://api.music.rockhosting.org/images/download.svg")}
                style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(57%) saturate(3843%) hue-rotate(39deg) brightness(86%) contrast(98%)' }}
                width={30}
                height={30}
                alt=""
            />

            <label className={clsx('text-xl text-neutral-400', { 'text-yellow-600': song.id == currentSong.id && currentList == listId })}>{song.duration}</label>
        </div>
    )
}

function PlaylistSong({ index, listSongs, song, listId }) {

    const { audio, setCurrentSong, randomQueue, currentSong, setCurrentList, setQueue, setQueueIndex, isPlaying } = useContext(MediaPlayerContext);

    function handlePlayClick() {

        if (!song.in_database) {
            return;
        }

        if (currentSong.id == song.id && currentList == listId) {
            audio.currentTime = 0;
            audio.play()
        } else {

            let _listSongs = listSongs.filter(song => song.in_database)

            let index = _listSongs.indexOf(song)
            let list = _listSongs.slice(index + 1).concat(_listSongs.slice(0, index))

            if (randomQueue) {
                list.sort(() => Math.random() - 0.5)
            }
            audio.src = `https://api.music.rockhosting.org/api/song/${song.id}`;
            audio.play();

            setQueue([song].concat(list));
            setQueueIndex(0);
            setCurrentSong(song);
            setCurrentList(listId);
        }
    };

    return (
        <div className='grid gap-x-2 ml-3 mr-3 m-3 cursor-pointer rounded-md items-center hover:bg-neutral-800' style={{ gridTemplateColumns: '50px 3fr 1fr 1fr max-content 60px', gridTemplateRows: '50px' }} onClick={handlePlayClick}>

            <div className='relative h-[50px]'>
                {song.id == currentSong.id && isPlaying ? (
                    <>
                        <Image className='rounded-md absolute opacity-20' alt={song.title} src={song.cover_url} width={50} height={50} />
                        <Equalizer className='w-full h-full top-0 absolute' bar_count={10} bar_gap={1} centered={true} toggleCenter={false}></Equalizer>
                    </>
                ) : (
                    <Image className='rounded-md absolute' alt={song.title} src={song.cover_url} width={50} height={50} />
                )}
            </div>

            <div className='flex flex-col cursor-pointer min-w-0 max-w-full'>
                <label className={clsx('cursor-pointer text-xl fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-yellow-500': song.id == currentSong.id })}>{song.title}</label>
                <label className={clsx('cursor-pointer fade-out-neutral-300 min-w-0 max-w-full', { 'fade-out-yellow-600': song.id == currentSong.id })}>{song.artist}</label>
            </div>
            <label className={clsx('fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-yellow-500': song.id == currentSong.id })} title={song.genre}>{song.genre}</label>
            <label className={clsx('fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-yellow-500': song.id == currentSong.id })} title={song.album}>{song.album}</label>

            <Image src={song.in_database ? ("https://api.music.rockhosting.org/images/database2.webp") : ("https://api.music.rockhosting.org/images/download.svg")} style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(57%) saturate(3843%) hue-rotate(39deg) brightness(86%) contrast(98%)' }} width={30} height={30} alt="" />


            <label className={clsx('fade-out-neutral-100 text-xl min-w-0 max-w-full text-center', { 'fade-out-yellow-500': song.id == currentSong.id })} title={song.duration}>{song.duration}</label>
        </div>
    )
}
