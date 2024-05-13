import { useContext } from "react";
import { MediaPlayerContext } from "./audioContext";
import clsx from "clsx";
import Image from "next/image";
import Equalizer from "./equalizer";

export function Song({ type, listSongs, index, song, listId }) {

    const { audio, setCurrentSong, randomQueue, currentSong, currentList, setCurrentList, setQueue, setQueueIndex } = useContext(MediaPlayerContext);

    function handlePlayClick() {

        if (song.in_database == false) { // If song.in_database is undifiend, the actual list is a list from database so all songs are available
            return;
        }

        if (currentSong.id == song.id && currentList == listId) {
            audio.currentTime = 0;
            audio.play()
        } else {

            let _listSongs = listSongs.filter(song => { if (song.in_database == false) { return false } else { return true } })

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
        <div onClick={handlePlayClick} className="relative ml-3 mr-3 mt-2 mb-2">
            {type == "Album" ? (
                <AlbumSong key={index} listSongs={listSongs} song={song} index={index} listId={listId}></AlbumSong>
            ) : (
                <PlaylistSong key={index} listSongs={listSongs} song={song} index={index} listId={listId}></PlaylistSong>
            )}
        </div>
    )
}

function AlbumSong({ index, listSongs, song, listId }) {

    const { currentSong, currentList, isPlaying } = useContext(MediaPlayerContext);

    return (
        <div className='grid items-center cursor-pointer hover:bg-neutral-800 rounded-md h-[50px] gap-2' style={{ gridTemplateColumns: '50px 1fr max-content 60px', gridTemplateRows: '50px' }}>

            {song.id == currentSong.id && isPlaying ? (
                <Equalizer className='w-full h-full top-0' bar_count={10} bar_gap={1} centered={true} toggleCenter={false} />
            ) : (
                <label className={clsx('text-xl text-neutral-400 text-center cursor-pointer', { 'text-yellow-600': song.id == currentSong.id && currentList == listId })}>{index + 1}</label>
            )}

            <label className={clsx('relative text-2xl fade-out-neutral-300 min-w-0 max-w-full cursor-pointer', { 'fade-out-yellow-600': song.id == currentSong.id && currentList == listId })}>{song.title}</label>
            {song.in_database == undefined ? (
                <label></label>
            ) : (
                <Image
                    src={song.in_database ? ("https://api.music.rockhosting.org/images/database2.webp") : ("https://api.music.rockhosting.org/images/download.svg")}
                    style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(57%) saturate(3843%) hue-rotate(39deg) brightness(86%) contrast(98%)' }}
                    width={30}
                    height={30}
                    alt="TEST"
                    title="TEST"
                />
            )}
            <label className={clsx('text-xl text-neutral-400', { 'text-yellow-600': song.id == currentSong.id && currentList == listId })}>{song.duration}</label>
        </div>
    )
}

function PlaylistSong({ index, listSongs, song, listId }) {

    const { currentSong, isPlaying, currentList } = useContext(MediaPlayerContext);

    return (
        <div
            className='grid gap-x-2 cursor-pointer rounded-md items-center hover:bg-neutral-800'
            style={{ gridTemplateColumns: '50px 3fr 1fr 1fr max-content 60px', gridTemplateRows: '50px' }}
        >

            {/* <div className="relative w-4 h-4" style={{}}></div> */}

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
                <label className={clsx('cursor-pointer text-xl fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-yellow-500': song.id == currentSong.id && listId == currentList })}>{song.title}</label>
                <label className={clsx('cursor-pointer fade-out-neutral-300 min-w-0 max-w-full', { 'fade-out-yellow-600': song.id == currentSong.id && listId == currentList })}>{song.artist}</label>
            </div>
            <label className={clsx('fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-yellow-500': song.id == currentSong.id && listId == currentList })} title={song.genre}>{song.genre}</label>
            <label className={clsx('fade-out-neutral-200 min-w-0 max-w-full', { 'fade-out-yellow-500': song.id == currentSong.id && listId == currentList })} title={song.album}>{song.album}</label>

            {song.in_database == undefined ? (
                <label></label>
            ) : (
                <Image
                    src={song.in_database ? ("https://api.music.rockhosting.org/images/database2.webp") : ("https://api.music.rockhosting.org/images/download.svg")}
                    style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(57%) saturate(3843%) hue-rotate(39deg) brightness(86%) contrast(98%)' }}
                    width={30}
                    height={30}
                    alt="TEST"
                    title={song.in_database ? ('Song in database') : ('Song is not available in database')}
                />
            )}

            <label className={clsx('fade-out-neutral-100 text-xl min-w-0 max-w-full text-center', { 'fade-out-yellow-500': song.id == currentSong.id && listId == currentList })} title={song.duration}>{song.duration}</label>
        </div>
    )
}
