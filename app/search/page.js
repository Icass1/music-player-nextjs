'use client';

import clsx from "clsx";
import Image from "next/image";
// import Link from "next/link";
import { Link } from 'next-view-transitions'

import ContextMenu from "../components/contextMenu";
import { apiFetch } from "../utils/apiFetch";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { MediaPlayerContext } from "../components/audioContext";

export default function Search({ searchResults, handleSearch }) {

    const {
        setCurrentSong,
        setCurrentList,
        setQueue,
        setQueueIndex,
    } = useContext(MediaPlayerContext);

    const [defaultSearchResults, setDefaultSearchResults] = useState({});
    const [actualSearchResults, setActualSearchResults] = useState({ albums: [], playlists: [], songs: [] });

    function handleSongPlay(id) {
        if (id == false) { // If song.in_database is undifiend, the actual list is a list from database so all songs are available
            return;
        }

        fetch(`https://api.music.rockhosting.org/api/song/info/${id}`).
            then(response => response.json()).
            then(data => {
                setQueue([data]);
                setQueueIndex(0);
                setCurrentSong(data);
                setCurrentList("search");
            })
    }

    let debounceTimer;
    const handleSearchInputChange = (e) => {
        const query = e.target.value;

        window.history.replaceState({}, "RockIT", `/search?q=${query}`);

        // Clear the previous timer to avoid multiple fetches
        clearTimeout(debounceTimer);

        // Set a new timer to call onSearch after 500ms (half a second)
        debounceTimer = setTimeout(() => {
            handleSearch(query);
        }, 1000);
    };

    useEffect(() => {

        fetch(`https://api.music.rockhosting.org/api/lists`).
            then(response => response.json()).
            then(data => {

                let out = { albums: [], playlists: [] }
                for (let list of data) {
                    if (list.type == "Album") {
                        out.albums.push({
                            in_database: true,
                            database_id: list.id,
                            artists: [{ name: list.author }],
                            image_url: `https://api.music.rockhosting.org/api/list/image/${list.id}_300x300`,
                            name: list.name,
                            total_tracks: list.total_tracks,
                            type: list.type
                        })
                    } else if (list.type == "Playlist" && list.author == "Spotify") {
                        out.playlists.push({
                            in_database: true,
                            database_id: list.id,
                            artists: [{ name: list.author }],
                            image_url: `https://api.music.rockhosting.org/api/list/image/${list.id}_300x300`,
                            name: list.name,
                            total_tracks: list.total_tracks,
                            type: list.type
                        })
                    }
                }
                setDefaultSearchResults(out)
            })
    }, [])

    useEffect(() => {
        if (searchResults == undefined || searchResults == null || Object.keys(searchResults).length == 0) {
            setActualSearchResults(defaultSearchResults);
        } else {
            setActualSearchResults(searchResults);
        }

    }, [searchResults, defaultSearchResults])

    return (
        <div className="flex flex-col gap-y-6 m-2">
            <div>
                <label className="text-2xl font-bold">Search</label>
                <input
                    placeholder="Type to search..."
                    className="md:hidden text-xl block w-full border-solid border-neutral-300 bg-transparent border-b focus:outline-none"
                    onInput={handleSearchInputChange}
                />
            </div>

            {
                actualSearchResults.albums == undefined || actualSearchResults.albums.length == 0 ?
                    <></>
                    :
                    <div>
                        <label className="text-4xl font-bold">Albums</label>
                        <div className="overflow-x-scroll mt-2">
                            <div className="inline-flex flex-row gap-4">
                                {actualSearchResults?.albums?.map((album, index) => (
                                    <ResultContextMenu key={index} list={album}>
                                        <Link href={album.in_database ? `/list/${album.database_id}` : `/s/album/${album.id}`}>
                                            <ResultContent list={album} />
                                        </Link>
                                    </ResultContextMenu>
                                ))}
                            </div>
                        </div>
                    </div>
            }

            {
                actualSearchResults.playlists == undefined || actualSearchResults.playlists.length == 0 ?
                    <></>
                    :
                    <div>
                        <label className="text-4xl font-bold">Playlists</label>
                        <div className="overflow-x-scroll mt-2">
                            <div className="inline-flex flex-row gap-2">
                                {actualSearchResults?.playlists?.map((playlist, index) => (
                                    <ResultContextMenu key={index} list={playlist}>
                                        <Link href={playlist.in_database ? `/list/${playlist.database_id}` : `/s/playlist/${playlist.id}`}>
                                            <ResultContent list={playlist} />
                                        </Link>
                                    </ResultContextMenu>
                                ))}
                            </div>
                        </div>
                    </div>
            }
            {
                actualSearchResults.songs == undefined || actualSearchResults.songs.length == 0 ?
                    <></>
                    :
                    <div>
                        <label className="text-4xl font-bold">Songs</label>
                        <div className="overflow-x-scroll mt-2">
                            <div className="inline-flex flex-row gap-2">
                                {actualSearchResults?.songs?.map((song, index) => (
                                    <div key={index} onClick={song.in_database ? () => handleSongPlay(song.database_id) : () => { }}>
                                        <ContextMenu
                                            options={song.in_database == false ? {
                                                "Download to database": () => { },
                                                "Copy Spotify URL": () => { navigator.clipboard.writeText(song.spotify_url) },
                                                "Copy Spotify ID": () => { navigator.clipboard.writeText(song.id) },
                                            } : {
                                                "Download": () => { },
                                                "Add to queue": () => { },
                                                "Copy ID": () => { navigator.clipboard.writeText(song.database_id) },
                                            }}
                                        >
                                            <ResultContent key={index} list={song} />
                                        </ContextMenu>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

            }
        </div>
    )
}

function ResultContextMenu({ children, list }) {
    const session = useSession();
    return (
        <ContextMenu
            options={list.in_database == false ? {
                "Download to database": () => { },
                "Copy Spotify URL": () => { navigator.clipboard.writeText(list.spotify_url) },
                "Copy Spotify ID": () => { navigator.clipboard.writeText(list.id) },
            } : {
                "Download": () => { },
                "Add to library": () => { apiFetch(`https://api.music.rockhosting.org/api/user/add-list`, session, { method: "POST", body: JSON.stringify({ list_id: list.database_id }) }) },
                "Add to queue": () => { },
                "Copy ID": () => { navigator.clipboard.writeText(list.database_id) },
            }}
        >
            {children}
        </ContextMenu>
    )
}

function ResultContent({ list }) {
    return (
        <div className="relative flex flex-col w-[220px] h-[290px] bg-3 hover:brightness-110 transition-all rounded-lg">
            <Image
                className='ml-auto mr-auto mt-2 rounded-md'
                src={list.image_url}
                width={200}
                height={200}
                alt=""
                title={list.name + " - " + list.artists.map((artist) => (artist.name)).join("/")}
            />
            <label className="text-2xl font-bold fade-out-neutral-100 min-w-0 max-w-full m-2 mb-0" title={list.name}>{list.name}</label>
            <label className="text-xl fade-out-neutral-100 min-w-0 max-w-full m-2 mt-0" title={list.artists.map((artist) => (artist.name)).join("/")}>{list.artists.map((artist) => (artist.name)).join(" /")}</label>

            <div
                className={clsx("absolute right-3 bottom-24 h-12 w-12 fg-1 rounded-full", { "hover:brightness-110": !list.in_database })}
                onClick={(e) => { e.preventDefault(); console.log(e) }}
            >
                <Image
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    src={list.in_database ? ("https://api.music.rockhosting.org/images/tick.svg") : ("https://api.music.rockhosting.org/images/download.svg")}
                    width={list.in_database ? 48 : 30}
                    height={list.in_database ? 48 : 30}
                    alt={list.in_database ? ("Database logo") : ("Download logo")}
                    title={list.in_database ? ("Song is in database") : ("Click to download song")}
                />
            </div>
        </div>
    )
}


function Result1({ list }) {
    return (

        <Link className={clsx("relative flex flex-col w-[220px] h-[290px] bg-3 rounded-lg")} href={`/s/${list.type}/${list.id}`}>
            <Image
                className='rounded-lg'
                src={list.image_url}
                width={220}
                height={220}
                alt={list.name + " - " + list.artists.map((artist) => (artist.name)).join("/")}
                title={list.name + " - " + list.artists.map((artist) => (artist.name)).join("/")}
            />

            <div
                className={clsx("absolute right-2 bottom-20 h-12 w-12 bg-[#9DE2B0]  rounded-full", { "hover:bg-[#9DE2B0]": !list.in_database })}
                onClick={(e) => { e.preventDefault(); console.log(e) }}
            >
                <Image
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    src={list.in_database ? ("https://api.music.rockhosting.org/images/database2.webp") : ("https://api.music.rockhosting.org/images/download.svg")}
                    width={30}
                    height={30}
                    alt={list.in_database ? ("Database logo") : ("Download logo")}
                    title={list.in_database ? ("Song is in database") : ("Click to download song")}

                // onClick={!album.in_database ? handleDownloadToDatabase : () => { }}
                />
            </div>

            <label className="text-2xl font-bold fade-out-neutral-100 min-w-0 max-w-full m-2 mb-0 mt-1" title={list.name}>{list.name}</label>
            <label className="text-xl fade-out-neutral-100 min-w-0 max-w-full m-2 mt-0" title={list.artists.map((artist) => (artist.name)).join("/")}>{list.artists.map((artist) => (artist.name)).join(" /")}</label>
        </Link>
    )
}