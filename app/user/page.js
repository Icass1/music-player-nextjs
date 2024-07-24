'use client';

import { apiFetch } from "../utils/apiFetch";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Link } from 'next-view-transitions'
import { useEffect, useState } from "react";
import useWindowWidth from "../hooks/useWindowWidth";

export default function User() {

    const [lastSongsPlayed, setLastSongsPlayed] = useState(null);

    const [mostPlayedArtist, setMostPlayedArtist] = useState(null);
    const [mostPlayedAlbum, setMostPlayedAlbum] = useState(null);
    const [mostPlayedSong, setMostPlayedSong] = useState(null);
    const [mostPlayedGenre, setMostPlayedGenre] = useState(null);

    const session = useSession();
    const innerWidth = useWindowWidth()
    
    useEffect(() => {
        if (session?.status != "authenticated") { return }

        apiFetch(`https://api.music.rockhosting.org/api/user/get-last-played`, session).then(response => response.json()).then(data => {
            data.reverse()

            let out = {}

            let byArtist = {}
            let byAlbum = {}
            let bySong = {}
            let byGenre = {}

            for (let song of data) {
                if (out[song.time_played]) {
                    out[song.time_played].push(song)
                } else {
                    out[song.time_played] = [song]
                }

                if (byArtist[song.artist]) {
                    byArtist[song.artist] += 1
                } else {
                    byArtist[song.artist] = 1
                }

                if (byAlbum[song.album]) {
                    byAlbum[song.album] += 1
                } else {
                    byAlbum[song.album] = 1
                }

                if (bySong[song.id]) {
                    bySong[song.id] += 1
                } else {
                    bySong[song.id] = 1
                }

                if (byGenre[song.genre]) {
                    byGenre[song.genre] += 1
                } else {
                    byGenre[song.genre] = 1
                }
            }

            let entries;

            // Get most played artist, if there is more than one with the maximum, it will add all those.
            entries = Object.entries(byArtist);
            byArtist = entries.sort((a, b) => b[1] - a[1]);
            let mostListenedArtists = []
            for (let repeatedArtist of byArtist) {
                if (repeatedArtist[1] != byArtist[0][1]) {
                    break;
                }
                let song = data.map((song) => { if (song.artist == repeatedArtist[0]) { return song } }).filter((title) => title)[0]
                mostListenedArtists.push({ id: song.id, artist: song.artist, times_played: repeatedArtist[1] })
            }
            setMostPlayedArtist(mostListenedArtists)

            // Get most played album, if there is more than one with the maximum, it will add all those.
            entries = Object.entries(byAlbum);
            byAlbum = entries.sort((a, b) => b[1] - a[1]);

            let mostListenedAlbums = []
            for (let repeatedAlbum of byAlbum) {
                if (repeatedAlbum[1] != byAlbum[0][1]) {
                    break;
                }
                let song = data.map((song) => { if (song.album == repeatedAlbum[0]) { return song } }).filter((title) => title)[0]
                mostListenedAlbums.push({ id: song.id, cover_url: song.cover_url, artist: song.artist, album: song.album, times_played: repeatedAlbum[1] })
            }
            setMostPlayedAlbum(mostListenedAlbums)

            // Get most played song, if there is more than one with the maximum, it will add all those.
            entries = Object.entries(bySong);
            bySong = entries.sort((a, b) => b[1] - a[1]);
            let mostListenedSongs = []
            for (let repeatedSong of bySong) {
                if (repeatedSong[1] != bySong[0][1]) {
                    break;
                }

                let song = data.map((song) => { if (song.id == repeatedSong[0]) { return song } }).filter((title) => title)[0]

                mostListenedSongs.push({ id: song.id, cover_url: song.cover_url, title: song.title, artist: song.artist, album: song.album, times_played: repeatedSong[1] })
            }
            // mostListenedSongs.push({ id: "ASDF", cover_url: "https://api.music.rockhosting.org/images/user.svg", title: "title", artist: "song.artist", album: "song.album", times_played: 4 })

            setMostPlayedSong(mostListenedSongs)

            // Get most played Genre, if there is more than one with the maximum, it will add all those.
            entries = Object.entries(byGenre);
            byGenre = entries.sort((a, b) => b[1] - a[1]);

            let mostListenedGenres = []
            for (let repeatedGenre of byGenre) {
                if (repeatedGenre[1] != byGenre[0][1]) {
                    break;
                }
                let song = data.map((song) => { if (song.genre == repeatedGenre[0]) { return song } }).filter((title) => title)[0]
                mostListenedGenres.push({ id: song.id, genre: song.genre, times_played: repeatedGenre[1] })
            }
            setMostPlayedGenre(mostListenedGenres)




            setLastSongsPlayed(out);
        })
    }, [session]);

    const getSortestString = (a, b) => {

        if (a.length > b.length) {
            return b
        } else {
            return a
        }
    }

    if (session.status == "loading") {
        return (<label className="block relative font-bold text-2xl text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Loading...</label>)
    }

    if (session.status == "unauthenticated") {
        return (
            <div className="block relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96">
                <label className="block relative font-bold text-2xl text-center">You are not loged in.</label>
                <Link className="hidden md:block relative w-20 pl-2 pr-2 left-1/2 -translate-x-1/2 text-center bg-neutral-700 text-lg font-bold rounded-lg hover:bg-green-600" href='/login'>Login</Link>
            </div>
        )
    }

    return (
        <>
            <div className="relative block max-w-[1000px] left-1/2 -translate-x-1/2">
                <div className="flex mt-4 ml-4 mr-4 flex-row gap-3">
                    <Image className="block rounded-full " src={session?.data?.user?.image} width={100} height={100} alt="" />
                    <div>
                        <div className="font-bold text-2xl text-neutral-300">{session?.data?.user?.name}</div>
                        <div className="font-bold text-lg text-neutral-400">{session?.data?.user?.email}</div>
                    </div>
                </div>

                {lastSongsPlayed == null || lastSongsPlayed == undefined ?

                    <label className="ml-6 mt-3 text-xl font-bold text-neutral-300">Loading...</label>
                    :
                    Object.keys(lastSongsPlayed).length !== 0 ? 
                    <>
                        <div className="max-w-[400px] ml-auto mr-auto md:max-w-none">

                            <div className="flex flex-col">

                                <label className="block font-bold text-2xl mt-6 ml-4 mr-4">Most played song</label>
                                {/* <div className="block md:block md:ml-4 md:mr-4 max-w-[1000px]" style={{display: 'ruby'}}> */}
                                <div className="block md:grid md:ml-4 md:mr-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(330px, 1fr))` }}>
                                    {/* <div className="flex flex-row gap-6 ml-4 mr-4"> */}
                                    {mostPlayedSong?.map((song) =>
                                        <div key={song.id} className="bg-neutral-800 w-10/12 ml-auto mr-auto mt-6 rounded-lg flex flex-col">
                                            <Image
                                                src={song.cover_url.replace("_50x50", "")}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="h-auto w-9/12 ml-auto mr-auto mt-4 rounded-lg"
                                                alt=""
                                                priority={true}
                                            />

                                            <div className="mr-4 ml-4 mt-3 mb-3 flex flex-col">
                                                <label className="text-xl font-bold fade-out-white" title={song.title}>{song.title}</label>
                                                <label className="fade-out-neutral-50" title={song.artist}>Artist: <label className="font-bold text-lg">{song.artist}</label></label>
                                                <label className="fade-out-neutral-50" title={song.album}>Album: <label className="font-bold text-lg">{song.album}</label></label>
                                                <label
                                                    className="fade-out-neutral-50"
                                                    title={'Times played: ' + song.times_played}
                                                >Times played: <label className="font-bold text-lg">{song.times_played}</label></label>
                                            </div>
                                        </div>)
                                    }
                                </div>


                                <label className="block font-bold text-2xl mt-6 ml-4">Most listened album</label>
                                <div className="block md:grid md:ml-4 md:mr-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(330px, 1fr))` }}>
                                    {mostPlayedAlbum?.map((album) =>
                                        <div key={album.id} className="bg-neutral-800 w-10/12 ml-auto mr-auto mt-6 rounded-lg flex flex-col">
                                            <Image
                                                src={album.cover_url.replace("_50x50", "")}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="h-auto w-9/12 ml-auto mr-auto mt-4 rounded-lg"
                                                alt=""
                                            />

                                            <div className="mr-4 ml-4 mt-3 mb-3 flex flex-col">
                                                <label className="text-xl font-bold fade-out-white" title={album.album}>{album.album}</label>
                                                <label
                                                    className="fade-out-neutral-50"
                                                    title={album.artist}
                                                >Artist: <label className="font-bold text-lg">{album.artist}</label></label>
                                                <label
                                                    className="fade-out-neutral-50"
                                                    title={'Times listened to ' + album.album + ': ' + album.times_played}
                                                >Times listened to {getSortestString(album.album, "this album")}: <label className="font-bold text-lg">{album.times_played}</label></label>
                                            </div>
                                        </div>
                                    )
                                    }
                                </div>


                                <label className="block font-bold text-2xl mt-6 ml-4">Most listened artist</label>
                                <div className="block md:grid md:ml-4 md:mr-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(330px, 1fr))` }}>
                                    {mostPlayedArtist.map((artist) =>
                                        <div key={artist.id} className="bg-neutral-800 w-10/12 ml-auto mr-auto mt-6 rounded-lg flex flex-col">
                                            <Image
                                                src='https://api.music.rockhosting.org/images/user.svg'
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="h-auto w-9/12 ml-auto mr-auto mt-4 rounded-full invert-[0.8] bg-white"
                                                alt=""
                                            />

                                            <div className="mr-4 ml-4 mt-3 mb-3 flex flex-col">
                                                <label className="text-xl font-bold fade-out-white" title={artist.artist}>{artist.artist}</label>
                                                <label
                                                    className="fade-out-neutral-50"
                                                    title={'Times listened to ' + artist.artist + ': ' + artist.times_played}
                                                >Times listened to {getSortestString(artist.artist, "this artist")}: <label className="font-bold text-lg">{artist.times_played}</label></label>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                <label className="block font-bold text-2xl mt-6 ml-4">Most listened genre</label>
                                <div className="block md:grid md:ml-4 md:mr-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(330px, 1fr))` }}>
                                    {mostPlayedGenre.map((genre) =>
                                        <div key={genre.id} className="bg-neutral-800 w-10/12 ml-auto mr-auto mt-6 rounded-lg flex flex-col">
                                            <div className="mr-4 ml-4 mt-3 mb-3 flex flex-col">
                                                <label className="text-xl font-bold fade-out-white" title={genre.genre}>{genre.genre}</label>
                                                <label
                                                    className="fade-out-neutral-50"
                                                    title={'Times listened to ' + genre.genre + ': ' + genre.times_played}
                                                >Times listened to {getSortestString(genre.genre, 'this genre songs')}: <label className="font-bold text-lg">{genre.times_played}</label></label>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        <label className="block font-bold text-2xl mt-6 ml-4">Last played songs</label>
                        {innerWidth > 768 ? <ComputerView lastSongsPlayed={lastSongsPlayed} /> : <MobileView lastSongsPlayed={lastSongsPlayed} />}
                    </>: <></>
                }
            </div >
        </>
    )
}

function MobileView({ lastSongsPlayed }) {
    return (
        Object.keys(lastSongsPlayed).map((timeAgo, index) => (
            <div key={index}>
                <label className="block ml-4 mr-4 font-bold text-base text-neutral-400 text-left sticky top-0 bg-neutral-900">{timeAgo}</label>
                {lastSongsPlayed[timeAgo].map((song, index) => (
                    <div key={index} className="ml-4 mr-4 mt-2 mb-2 flex gap-2 items-center">
                        <Image className="rounded" src={song.cover_url} width={50} height={50} alt={`${song.title} - ${song.artist}`} />
                        <div className=" min-w-0 w-full">
                            <div className="text-xl fade-out-neutral-200">{song.title}</div>
                            <div className=" text-lg fade-out-neutral-400">{song.artist}</div>
                        </div>
                    </div>
                ))}
            </div>
        ))
    )
}

function ComputerView({ lastSongsPlayed }) {
    return (

        Object.keys(lastSongsPlayed).map((timeAgo, index) => (
            <div key={index}>
                {lastSongsPlayed[timeAgo].map((song, index) => (
                    <div key={index} className="ml-4 mr-4 mt-2 mb-2 grid gap-2 items-center" style={{ gridTemplateColumns: '50px 2fr 1fr 150px' }}>
                        <Image className="rounded" src={song.cover_url} width={50} height={50} alt={`${song.title} - ${song.artist}`} />
                        <div className=" min-w-0 w-auto">
                            <div className="text-lg fade-out-neutral-200">{song.title}</div>
                            <div className="text-sm fade-out-neutral-400">{song.artist}</div>
                        </div>
                        <div className="block text-sm min-w-0 fade-out-neutral-100">{song.album}</div>
                        <div className="block text-sm min-w-0 fade-out-neutral-50">{song.time_played}</div>
                    </div>
                ))}
            </div>
        ))
    )
}