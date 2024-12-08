"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../utils/apiFetch";
import { useSession } from "next-auth/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import useWindowSize from "../hooks/useWindowSize";

function RecentlyPlayedContainer({ song }) {
    const [coverLoaded, setCoverLoaded] = useState(false);

    return (
        <div className="relative w-52">
            <div className="bg-neutral-500 aspect-square w-full h-auto rounded overflow-hidden">
                <Image
                    onLoad={() => {
                        setCoverLoaded(true);
                    }}
                    src={`https://api.music.rockhosting.org/api/song/image/${song.id}_300x300`}
                    className="absolute top-0 rounded h-auto w-full "
                    width={0}
                    height={0}
                    sizes="100vw"
                    alt=""
                />
                {coverLoaded ? (
                    <></>
                ) : (
                    <Skeleton className="top-0 absolute aspect-square w-full h-auto rounded" />
                )}
            </div>

            <p className="font-medium truncate">{song.title}</p>
            <p className="text-sm text-muted-foreground truncate">
                {song.artist}
            </p>
        </div>
    );
}

export default function HomeView() {
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const session = useSession();
    const scrollRef = useRef();

    useEffect(() => {
        apiFetch(`/api/user/get-last-played`, session).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    data.reverse();
                    let out = {};
                    for (let song of data.slice(0, 20)) {
                        if (out[song.time_played]) {
                            out[song.time_played].push(song);
                        } else {
                            out[song.time_played] = [song];
                        }
                    }
                    setRecentlyPlayed(out);
                });
            }
        });
    }, [session]);

    return (
        <ScrollArea
            ref={scrollRef}
            className="h-full px-6 w-full relative block"
        >
            <h2 className="text-3xl font-bold flex flex-row my-6">
                Welcome to RockIt!{session?.data?.user?.name ? "," : ""}{" "}
                {session?.data?.user?.name}
            </h2>

            <section className="relative">
                <h3 className="text-2xl font-semibold mb-4">Recently Played</h3>

                <div className="absolute w-full">
                    {recentlyPlayed.length == 0 ? (
                        <label className="text-2xl font-semibold mt-20 block ml-auto mr-auto w-fit">
                            You have listen to any song yet
                        </label>
                    ) : (
                        <ScrollArea className=" w-full">
                            {/* Horizontal ScrollArea */}
                            <div className="flex flex-row gap-4 mb-4">
                                {Object.keys(recentlyPlayed).map(
                                    (time, index1) =>
                                        recentlyPlayed[time].map(
                                            (song, index2) => (
                                                <RecentlyPlayedContainer
                                                    key={
                                                        "recentlyPlayed-" +
                                                        index1 +
                                                        "-" +
                                                        index2 +
                                                        "-" +
                                                        song.id
                                                    }
                                                    song={song}
                                                />
                                            ),
                                        ),
                                )}
                                <div className="relative w-52">
                                    <p className="font-medium truncate top-1/2 relative ml-auto mr-auto w-fit">
                                        See more
                                    </p>
                                </div>
                            </div>

                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}

                    <div className="absolute h-full w-20 bg-gradient-to-r right-0 top-0 from-transparent to-background "></div>
                </div>
                <div className="h-72"></div>
            </section>

            <section>
                <h3 className="text-2xl font-semibold mb-4">Your Top Mixes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="bg-card rounded-lg p-4 space-y-2"
                        >
                            <div className="aspect-video bg-muted rounded-md"></div>
                            <p className="font-medium">Mix Name</p>
                            <p className="text-sm text-muted-foreground">
                                Based on your listening
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-semibold mb-4">
                    New Releases for You
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="space-y-2">
                            <div className="aspect-square bg-muted rounded-md"></div>
                            <p className="font-medium truncate">Album Title</p>
                            <p className="text-sm text-muted-foreground truncate">
                                Artist Name
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            <div className="h-6"></div>
        </ScrollArea>
    );
}
