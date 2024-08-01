import { useContext, useEffect, useRef, useState } from "react";
import { MediaPlayerContext } from "./audioContext";
import clsx from "clsx";
import Image from "next/image";
import Equalizer from "./equalizer";
// import Link from "next/link";
import { Link } from 'next-view-transitions'

import ContextMenu from "./contextMenu";
import { useRouter } from "next/router";
// import { downloadAndSaveMusic, getMusicFile } from "../utils/storage";
import useWindowWidth from "../hooks/useWindowWidth";
import SVG from "../utils/renderSVG";

export function Song({ type, musicData, checkMusicData, index, song, listId }) {

    const {
        audio,
        setCurrentSong,
        randomQueue,
        currentSong,
        currentList,
        setCurrentList,
        setQueue,
        setQueueIndex,
        queue,
        queueIndex,
    } = useContext(MediaPlayerContext);

    const [downloadProgress, setDownloadProgress] = useState(undefined)

    function handlePlayClick() {

        if (song.in_database == false) { // If song.in_database is undifiend, the actual list is a list from database so all songs are available
            return;
        }

        if (currentSong.id == song.id && currentList == listId) {
            audio.currentTime = 0;
            audio.play()
        } else {

            let _songsList = musicData.songs.filter(song => { if (song.in_database == false) { return false } else { return true } })

            let index = _songsList.indexOf(song)
            let list = _songsList.slice(index + 1).concat(_songsList.slice(0, index))

            if (randomQueue) {
                list.sort(() => Math.random() - 0.5)
            }

            setQueue([song].concat(list));
            setQueueIndex(0);
            setCurrentSong(song);
            setCurrentList(listId);
        }
    };

    const handleDownloadMP3 = () => {
        fetch(`https://api.music.rockhosting.org/api/song/${song.id}`)
            .then(response => response.blob())
            .then(blob => {
                let url = window.URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.href = url;
                link.download = `${song.title} - ${song.artist}.mp3`;  // Assign a meaningful filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Download failed:', error));
    }

    const handleDownload = () => {

        return;

        downloadAndSaveMusic(`https://api.music.rockhosting.org/api/song/${song.id}`, song.id)
        setStored(true)
    }

    const handleAddToQueue = () => {

        console.log(queue, queueIndex)

        let tempQueue = queue.slice(0, queueIndex + 1)
        let tempEndQueue = queue.slice(queueIndex + 1)

        setQueue(tempQueue.concat(song).concat(tempEndQueue))
    }

    const handleDownloadToDatabase = () => {

        const id = song.spotify_url.replace("https://open.spotify.com/track/", "")
        const url = `https://api.music.rockhosting.org/api/download-song/${id}`

        const eventSource = new EventSource(url);

        setDownloadProgress(0)

        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);

            // console.log(message);

            setDownloadProgress(message.completed);

            if ((message.completed) == 100) {
                setDownloadProgress(undefined);
                eventSource.close();
                song.in_database = true;
                song.title = message.title
                song.artist = message.artist
                song.id = message.id;
                song.genre = message.genre
                song.album = message.album
                song.cover_url = message.cover_url
                song.duration = message.duration
                song.album_url = message.album_url
                checkMusicData()
            }
        };

        eventSource.onerror = (error) => {
            console.error(error)
            eventSource.close();
            setDownloadProgress(undefined)
        };
    }

    const [stored, setStored] = useState(false)

    // useEffect(() => {
    //     getMusicFile(song.id).then(data => {
    //         if (data == undefined) {
    //             setStored(false)
    //         } else {
    //             setStored(true)
    //         }
    //     })
    // }, [song])

    return (
        <ContextMenu
            options={song.in_database == false ? {
                "Download to database": handleDownloadToDatabase,
                "Copy Spotify URL": () => { console.log(song.spotify_url) },
                "Copy Spotify ID": () => { console.log(song.spotify_url.replace("https://open.spotify.com/track/", "")) },
            } : {
                "Play": handlePlayClick,
                "Download MP3": handleDownloadMP3,
                "TODO Download": handleDownload,
                "Add to queue": handleAddToQueue,
                "Copy ID": () => { navigator.clipboard.writeText(song.id) }
            }}
        >
            <div onClick={handlePlayClick} className="relative ml-3 mr-3 mt-2 mb-2">
                {type == "Album" ? (
                    <AlbumSong key={index} stored={stored} song={song} index={index} listId={listId} downloadProgress={downloadProgress} handleDownloadToDatabase={handleDownloadToDatabase}></AlbumSong>
                ) : (
                    <PlaylistSong key={index} stored={stored} song={song} index={index} listId={listId} downloadProgress={downloadProgress} handleDownloadToDatabase={handleDownloadToDatabase}></PlaylistSong>
                )}
            </div>
        </ContextMenu>
    )
}

function AlbumSong({ index, stored, song, listId, downloadProgress, handleDownloadToDatabase }) {

    const { currentSong, currentList, isPlaying } = useContext(MediaPlayerContext);

    return (
        <div
            className={clsx('grid items-center rounded-md h-9 md:h-12 gap-2 transition-colors', { 'md:hover:bg-neutral-800 cursor-pointer': song.in_database !== false })}
            style={{ gridTemplateColumns: 'max-content 1fr max-content max-content max-content max-content', gridTemplateRows: '50px' }}
        >

            {song.id == currentSong.id && isPlaying && currentList == listId ? (
                <Equalizer className='w-6 md:w-[50px] h-full top-0' bar_count={innerWidth > 768 ? 10 : 5} bar_gap={1} centered={true} toggleCenter={false} />
            ) : (
                <label className={clsx('text-xl w-6 md:w-[50px] text-center ', {
                    'text-fg-1': song.id == currentSong.id && currentList == listId,
                    "text-neutral-400": !(song.id == currentSong.id && currentList == listId),
                    'cursor-pointer': song.in_database !== false
                })}
                >
                    {index + 1}
                </label>
            )}

            <label className={clsx('relative text-xl md:text-2xl fade-out-neutral-300 min-w-0 max-w-full', { 'fade-out-fg-1': song.id == currentSong.id && currentList == listId, 'cursor-pointer': song.in_database !== false })}>{song.title}</label>

            {downloadProgress != undefined ? (
                <label>{downloadProgress}%</label>
            ) : (
                <label></label>
            )}

            {song.in_database == undefined ? (
                <label></label>
            ) : (
                <SVG
                    color={`rgb(${getComputedStyle(document.body).getPropertyValue("--foreground-1")})`}
                    // className={clsx("cursor-pointer [filter:invert(29%)_sepia(93%)_saturate(1108%)_hue-rotate(25deg)_brightness(93%)_contrast(98%)]", { "hover:[filter:invert(45%)_sepia(100%)_saturate(412%)_hue-rotate(3deg)_brightness(90%)_contrast(97%)]": !song.in_database })}
                    src={song.in_database ? ("https://api.music.rockhosting.org/images/tick.svg") : ("https://api.music.rockhosting.org/images/download.svg")}
                    width={30}
                    height={30}
                    alt={song.in_database ? ("Database logo") : ("Download logo")}
                    title={song.in_database ? ("Song is in database") : ("Click to download song")}
                    onClick={!song.in_database ? handleDownloadToDatabase : () => { }}
                />
            )}
            {stored ? (
                <label>ok</label>
            ) : (
                <label></label>
            )}
            <label className={clsx('md:text-xl w-[35px] md:w-[60px]', {
                'text-fg-1': song.id == currentSong.id && currentList == listId,
                "text-neutral-400": !(song.id == currentSong.id && currentList == listId),
                'cursor-pointer': song.in_database !== false
            })}
            >
                {song.duration}
            </label>
        </div>
    )
}

function PlaylistSong({ index, stored, song, listId, handleDownloadToDatabase }) {

    const { currentSong, isPlaying, currentList } = useContext(MediaPlayerContext);

    const innerWidth = useWindowWidth();

    song.cover_url = song.cover_url.replace("_50x50", innerWidth > 768 ? "_50x50" : "_100x100")

    return (
        <div
            className={clsx('grid gap-x-2 rounded-md cursor-pointer items-center transition-colors', { 'hover:bg-neutral-800': song.in_database !== false })}
            style={{ gridTemplateColumns: innerWidth > 768 ? '50px 3fr 1fr 1fr max-content 60px' : '50px 3fr max-content 60px', gridTemplateRows: '50px' }}
        >

            <div className='relative h-[50px]'>
                {song.id == currentSong.id && isPlaying && listId == currentList ? (
                    <>
                        <Image className='rounded-md absolute opacity-20' alt={song.title} src={song.cover_url} width={50} height={50} />
                        <Equalizer className='w-full h-full top-0 absolute' bar_count={10} bar_gap={1} centered={true} toggleCenter={false}></Equalizer>
                    </>
                ) : (
                    <Image className='rounded-md absolute' alt={song.title} src={song.cover_url} width={50} height={50} />
                )}
            </div>

            <div className='flex flex-col cursor-pointer min-w-0 max-w-full'>
                <label className={clsx('cursor-pointer text-xl fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-fg-1': song.id == currentSong.id && listId == currentList })}>{song.title}</label>
                <label className={clsx('cursor-pointer fade-out-neutral-300 min-w-0 max-w-full', { 'fade-out-fg-2': song.id == currentSong.id && listId == currentList })}>{song.artist}</label>
            </div>
            <label className={clsx('hidden md:block fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-fg-2': song.id == currentSong.id && listId == currentList })} title={song.genre}>{song.genre}</label>
            <Link
                href={`/s/album/${song?.album_url?.replace("https://open.spotify.com/album/", '')}`}
                onClick={(e) => e.stopPropagation()}

                className={clsx('hidden md:block fade-out-neutral-200 min-w-0 max-w-full hover:fade-out-neutral-400', { 'fade-out-fg-2 hover:fade-out-fg-1': song.id == currentSong.id && listId == currentList })}
                title={song.album}>{song.album}
            </Link>

            {song.in_database == undefined ? (
                <label></label>
            ) : (
                <SVG
                    color={`rgb(${getComputedStyle(document.body).getPropertyValue("--foreground-1")})`}

                    // className={clsx("cursor-pointer [filter:invert(29%)_sepia(93%)_saturate(1108%)_hue-rotate(25deg)_brightness(93%)_contrast(98%)]", { "hover:[filter:invert(45%)_sepia(100%)_saturate(412%)_hue-rotate(3deg)_brightness(90%)_contrast(97%)]": !song.in_database })}
                    src={song.in_database ? ("https://api.music.rockhosting.org/images/tick.svg") : ("https://api.music.rockhosting.org/images/download.svg")}
                    width={30}
                    height={30}
                    alt={song.in_database ? ("Database logo") : ("Download logo")}
                    title={song.in_database ? ("Song is in database") : ("Click to download song")}
                    onClick={!song.in_database ? handleDownloadToDatabase : () => { }}
                />
            )}

            <label className={clsx('fade-out-neutral-100 text-xl min-w-0 max-w-full text-center', { 'fade-out-fg-1': song.id == currentSong.id && listId == currentList })} title={song.duration}>{song.duration}</label>
        </div>
    )
}
