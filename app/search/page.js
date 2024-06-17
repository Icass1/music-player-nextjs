'use client';

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import ContextMenu from "../components/contextMenu";

export default function Search({ searchResults }) {

    return (
        <div className="flex flex-col gap-6 m-2">
            {/* <label>{JSON.stringify(searchResults)}</label> */}
            <div>
                <label className="text-4xl font-bold">Albums</label>
                <div className="overflow-x-scroll mt-2">
                    <div className="inline-flex flex-row gap-4">
                        {searchResults?.albums?.map((album, index) => (
                            <ContextMenu
                                key={index}
                                options={album.in_database == false ? {
                                    "Download to database": () => {},
                                    "Copy Spotify URL": () => {},
                                    "Copy Spotify ID": () => {},
                                } : {
                                    "Download": () => {},
                                    "Add to library": () => { fetch(`/api/add-list/${album.database_id}`)},
                                    "Add to queue": () => {},
                                    "Copy ID": () => {},
                                }}
                            >
                                <Link className={clsx("relative flex flex-col w-[220px] h-[290px] bg-neutral-700 rounded-lg")} href={`/s/album/${album.id}`}>
                                    <Image
                                        className='rounded-lg'
                                        src={album.image_url}
                                        width={220}
                                        height={220}
                                        alt={album.name + " - " + album.artists.map((artist) => (artist.name)).join("/")}
                                        title={album.name + " - " + album.artists.map((artist) => (artist.name)).join("/")}
                                    />

                                    <div
                                        className={clsx("absolute right-2 bottom-20 h-12 w-12 bg-yellow-600  rounded-full", { "hover:bg-yellow-500": !album.in_database })}
                                        onClick={(e) => { e.preventDefault(); console.log(e) }}
                                    >
                                        <Image
                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            src={album.in_database ? ("https://api.music.rockhosting.org/images/database2.webp") : ("https://api.music.rockhosting.org/images/download.svg")}
                                            width={30}
                                            height={30}
                                            alt={album.in_database ? ("Database logo") : ("Download logo")}
                                            title={album.in_database ? ("Song is in database") : ("Click to download song")}

                                        // onClick={!album.in_database ? handleDownloadToDatabase : () => { }}
                                        />
                                    </div>


                                    <label className="text-2xl font-bold fade-out-neutral-100 min-w-0 max-w-full m-2 mb-0 mt-1" title={album.name}>{album.name}</label>
                                    <label className="text-xl fade-out-neutral-100 min-w-0 max-w-full m-2 mt-0" title={album.artists.map((artist) => (artist.name)).join("/")}>{album.artists.map((artist) => (artist.name)).join(" /")}</label>
                                </Link>
                            </ContextMenu>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="text-4xl font-bold">Playlists</label>
                <div className="overflow-x-scroll mt-2">
                    <div className="inline-flex flex-row gap-2">
                        {searchResults?.playlists?.map((playlist, index) => (
                            <Link key={index} className="flex flex-col w-[220px] h-[290px] bg-neutral-700 rounded-lg" href={`/s/playlist/${playlist.id}`}>
                                <Image
                                    className='ml-auto mr-auto mt-2 rounded-md'
                                    src={playlist.image_url}
                                    width={200}
                                    height={200}
                                    alt=""
                                    title={playlist.name + " - " + playlist.artists.map((artist) => (artist.name)).join("/")}
                                />

                                <label className="text-2xl font-bold fade-out-neutral-100 min-w-0 max-w-full m-2 mb-0" title={playlist.name}>{playlist.name}</label>
                                <label className="text-xl fade-out-neutral-100 min-w-0 max-w-full m-2 mt-0" title={playlist.artists.map((artist) => (artist.name)).join("/")}>{playlist.artists.map((artist) => (artist.name)).join(" /")}</label>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-row bg-red-400">
            </div>

        </div>
    )
}
