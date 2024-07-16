'use client';

import { apiFetch } from "../utils/apiFetch";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Link } from 'next-view-transitions'
import { useEffect, useState } from "react";

export default function User() {

    const [lastSongsPlayed, setLastSongsPlayed] = useState(null);
    const [mostPlayedArtist, setMostPlayedArtist] = useState(null);
    const [mostPlayedAlbum, setMostPlayedAlbum] = useState(null);
    const [mostPlayedSong, setMostPlayedSong] = useState(null);
    const session = useSession();
    const [innerWidth, setInnerWidth] = useState(0);

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
        if (session?.status != "authenticated") { return }

        apiFetch(`https://api.music.rockhosting.org/api/user/get-last-played`, session).then(response => response.json()).then(data => {
            data.reverse()

            let out = {}

            let byArtist = {}
            let byAlbum = {}
            let bySong = {}

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
            }

            let entries;

            // Sort the array by the values (numbers)
            entries = Object.entries(byArtist);
            byArtist = entries.sort((a, b) => b[1] - a[1]);
            if (byArtist[0][1] != byArtist[1][1]) {
                setMostPlayedArtist(byArtist[0][0])
            } else {
                let mostListenedArtists = []
                for (let repeatedArtist of byArtist) {
                    if (repeatedArtist[1] != byArtist[0][1]) {
                        break;
                    }
                    mostListenedArtists.push(repeatedArtist[0])
                }
                setMostPlayedArtist(mostListenedArtists.join(", "))
            }

            entries = Object.entries(byAlbum);
            byAlbum = entries.sort((a, b) => b[1] - a[1]);
            setMostPlayedAlbum(byAlbum[0][0])

            console.log(byAlbum)

            let mostListenedAlbums = []
            for (let repeatedAlbum of byAlbum) {
                if (repeatedAlbum[1] != byAlbum[0][1]) {
                    break;
                }
                let song = data.map((song) => { if (song.album == repeatedAlbum[0]) { return song } }).filter((title) => title)[0]

                mostListenedAlbums.push({ cover_url: song.cover_url, artist: song.artist, album: song.album, times_played: repeatedAlbum[1] })
            }
            console.log(mostListenedAlbums)
            setMostPlayedAlbum(mostListenedAlbums)

            entries = Object.entries(bySong);
            bySong = entries.sort((a, b) => b[1] - a[1]);
            let mostListenedSongs = []
            for (let repeatedSong of bySong) {
                if (repeatedSong[1] != bySong[0][1]) {
                    break;
                }

                let song = data.map((song) => { if (song.id == repeatedSong[0]) { return song } }).filter((title) => title)[0]

                mostListenedSongs.push({ cover_url: song.cover_url, title: song.title, artist: song.artist, album: song.album, times_played: repeatedSong[1] })
            }
            setMostPlayedSong(mostListenedSongs)

            setLastSongsPlayed(out);
        })
    }, [session]);

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


                <div className="flex flex-col">
                    <label className="block font-bold text-2xl mt-6 ml-4">Most played song</label>
                    {mostPlayedSong?.map((song) =>
                        <div className="bg-neutral-800 w-10/12 ml-auto mr-auto mt-6 rounded-lg flex flex-col">
                            <Image
                                src={song.cover_url.replace("_50x50", "")}
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-auto w-9/12 ml-auto mr-auto mt-4 rounded-lg"
                                alt=""
                            />

                            <div className="mr-4 ml-4 mt-3 mb-3 flex flex-col">
                                <label className="text-xl font-bold fade-out-white">{song.title}</label>
                                <label className="fade-out-neutral-50">Artist: <label className="font-bold text-lg">{song.artist}</label></label>
                                <label className="fade-out-neutral-50">Album: <label className="font-bold text-lg">{song.album}</label></label>
                                <label className="fade-out-neutral-50">Times played: <label className="font-bold text-lg">{song.times_played}</label></label>
                            </div>
                        </div>)
                    }
                    <label className="block font-bold text-2xl mt-6 ml-4">Most listened album</label>
                    {mostPlayedAlbum?.map((song) =>
                        <div className="bg-neutral-800 w-10/12 ml-auto mr-auto mt-6 rounded-lg flex flex-col">
                            <Image
                                src={song.cover_url.replace("_50x50", "")}
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-auto w-9/12 ml-auto mr-auto mt-4 rounded-lg"
                                alt=""
                            />

                            <div className="mr-4 ml-4 mt-3 mb-3 flex flex-col">
                                <label className="text-xl font-bold fade-out-white">{song.album}</label>
                                <label className="fade-out-neutral-50">Artist: <label className="font-bold text-lg">{song.artist}</label></label>
                                <label className="fade-out-neutral-50">Times listen this album songs: <label className="font-bold text-lg">{song.times_played}</label></label>
                            </div>
                        </div>)
                    }

                    {/* <label>Most listen artist: {mostPlayedArtist}</label> */}
                    {/* <label>Most listen genre</label> */}
                </div>

                <label className="block font-bold text-2xl mt-6 ml-4">Last played songs</label>
                {lastSongsPlayed == null || lastSongsPlayed == undefined ?

                    <label className="ml-6 mt-3 text-xl font-bold text-neutral-300">Loading...</label>
                    :
                    innerWidth > 768 ? <ComputerView lastSongsPlayed={lastSongsPlayed} /> : <MobileView lastSongsPlayed={lastSongsPlayed} />
                }
            </div>
        </>
    )
}

function MobileView({ lastSongsPlayed }) {
    return (
        Object.keys(lastSongsPlayed).map((timeAgo, index) => (
            <div key={index}>
                <label className="block ml-4 mr-4 font-bold text-xl text-right sticky top-0 bg-neutral-900">{timeAgo}</label>
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