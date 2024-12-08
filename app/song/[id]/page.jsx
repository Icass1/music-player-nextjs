"use client";

import { MediaPlayerContext } from "@/app/components/audioContext";
import Lyrics from "@/app/components/lyrics";
import useColors from "@/app/hooks/getColors";
import { apiFetch } from "@/app/utils/apiFetch";
import SVG from "@/app/utils/renderSVG";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function SongPage({ params }) {
    const { setCurrentList, setCurrentSong, setQueue, setQueueIndex } =
        useContext(MediaPlayerContext);

    const [songInfo, setSongInfo] = useState({
        title: "",
        artist: "",
        album: "",
        id: "",
    });

    const colors = useColors();
    const [showFullLyrics, setShowFullLyrics] = useState(false);

    const lyricsRef = useRef();

    useEffect(() => {
        apiFetch(`/api/song/info/${params.id}`)
            .then((data) => data.json())
            .then((data) => {
                setSongInfo(data);
                console.log(data);
            });
    }, [params.id]);

    const handlePlay = useCallback(() => {
        setCurrentSong(songInfo);
        setCurrentList(songInfo.album_id);
        setQueue([songInfo]);
        setQueueIndex(0);
    }, [setCurrentList, setCurrentSong, setQueue, setQueueIndex, songInfo]);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row gap-3 mt-10 ml-10 mr-10">
                <Image
                    src={`https://api.music.rockhosting.org/api/song/image/${params.id}_300x300`}
                    className="rounded-lg"
                    width={300}
                    height={300}
                    alt={songInfo.title}
                />
                <div className="flex flex-col gap-1 relative w-full min-w-0">
                    <div
                        className="fg-1 rounded-full h-14 w-14 mt-20 cursor-pointer"
                        onClick={handlePlay}
                    >
                        <SVG
                            src={
                                "https://api.music.rockhosting.org/images/play.svg"
                            }
                            className="ml-auto mr-auto top-1/2 relative -translate-y-1/2"
                            height={40}
                            width={40}
                        />
                    </div>
                    <label className="text-5xl font-bold fade-out-neutral-100 h-14 ">
                        {songInfo.title}
                    </label>
                    <label className="flex flex-row gap-3 items-center text-xl fade-out-neutral-100">
                        <div className="bg-neutral-700 rounded-full">
                            <Image
                                src={`https://api.music.rockhosting.org/images/user.svg`}
                                className="rounded-full p-[3px]"
                                width={30}
                                height={30}
                                alt={songInfo.title}
                            />
                        </div>
                        {songInfo.artist}
                    </label>
                    <Link
                        className="flex flex-row gap-3 items-center text-xl fade-out-neutral-100"
                        href={`/list/${songInfo.album_id}`}
                    >
                        <Image
                            src={`https://api.music.rockhosting.org/images/defaultAlbum.png`}
                            className="rounded-full"
                            width={30}
                            height={30}
                            alt={songInfo.title}
                        />
                        {songInfo.album}
                    </Link>
                    <label>
                        {songInfo.genre} - {songInfo.duration}
                    </label>
                </div>
            </div>

            <label className="ml-auto mr-auto text-sm">Lyrics</label>
            <div
                ref={lyricsRef}
                className="relative overflow-y-hidden transition-[height] duration-1000"
                style={{
                    height: showFullLyrics
                        ? lyricsRef?.current?.scrollHeight - 60
                        : "300px",
                }}
            >
                {showFullLyrics ? (
                    <></>
                ) : (
                    <div
                        className="absolute  w-full h-full"
                        style={{
                            background: `linear-gradient(0deg, rgb(${colors.background2}) 0%, transparent 20%, transparent 100%)`,
                        }}
                    ></div>
                )}
                <Lyrics songID={songInfo.id} lineClassName="h-5 text-sm" />
            </div>
            <button
                onClick={() => {
                    setShowFullLyrics((value) => !value);
                }}
                className="ml-auto mr-auto  text-sm"
            >
                {showFullLyrics ? "Show less" : "Show more"}
            </button>

            <label className="text-xs m-3">{songInfo.copyright}</label>
        </div>
    );
}
