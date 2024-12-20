"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    SkipBack,
    SkipForward,
    Play,
    Pause,
    Volume2,
    MicVocal,
    Shuffle,
    Sun,
    Lock,
    Moon,
    Home,
    Users,
    ListMusic,
    Music2,
    Library,
    Search,
    Menu,
    ChevronLeft,
    ChevronRight,
    User,
    Download,
} from "lucide-react";
import { useTheme } from "next-themes";
import { signIn, useSession } from "next-auth/react";
import { MediaPlayerContext } from "../components/audioContext";
import { getTime } from "../utils/getTime";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "../utils/apiFetch";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function NavigationPath({ path, label, Icon, showing, _index }) {
    const pathname = usePathname();

    return (
        <Link href={path}>
            <Button
                variant={pathname === path ? "default" : "ghost"}
                className={`absolute justify-start transition-all duration-300 ${showing ? `w-[230px] left-[56px]` : `left-[3px] p-0 w-[32px] h-8`}`}
                style={{
                    top: showing
                        ? `${100 + 50 * _index}px`
                        : `${60 + 40 * _index}px`,
                }}
            >
                <Icon
                    className={`h-4 w-4 transition-all duration-300 ${showing ? "mr-2" : "mr-0 ml-[7px]"}`}
                />
                {showing ? (
                    <label className="w-auto overflow-hidden">{label}</label>
                ) : (
                    <></>
                )}
            </Button>
        </Link>
    );
}

function NavigationBar({ children, showing }) {
    let _index = 0;
    return React.Children.map(children, (child) => {
        if (child.type === React.Fragment) {
            return child?.props?.children?.map((child1) => {
                if (child1.type == NavigationSeparator) {
                    _index += 0.2;
                } else {
                    _index++;
                }

                return React.cloneElement(child1, { showing, _index });
            });
        } else {
            if (child.type == NavigationSeparator) {
                _index += 0.2;
            } else {
                _index++;
            }
            return React.cloneElement(child, { showing, _index });
        }
    });
}

function NavigationSeparator({ showing, _index }) {
    return (
        <div
            className={`absolute bg-border justify-start transition-all duration-300 h-[2px] ${showing ? `w-[230px] left-[56px] ` : `left-[3px] p-0 w-[32px]`}`}
            style={{
                top: showing
                    ? `${130 + 50 * _index}px`
                    : `${85 + 40 * _index}px`,
            }}
        ></div>
    );
}

function QueueContainer() {
    const { queue, queueIndex } = useContext(MediaPlayerContext);

    const [scrollTop, setScrollTop] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState();

    const scrollRef = useRef();

    const height = 40;
    const gap = 8;

    useEffect(() => {
        let startIndex = Math.max(
            Math.round(scrollTop / (height + gap) - 1),
            0,
        );
        let endIndex = Math.round(
            (scrollRef.current.offsetHeight + scrollTop) / (height + gap),
        );

        setStartIndex(startIndex);
        setEndIndex(endIndex);
    }, [scrollRef, scrollTop]);

    // useEffect(() => {
    //     if (!scrollRef.current) { return }

    //     const element = scrollRef.current
    //     const elementScroll = element.querySelector("div")

    //     const handleWheel = (e) => {
    //         elementScroll.scrollTop += e.deltaY
    //         e.preventDefault();
    //     }

    //     element.addEventListener("wheel", handleWheel)

    //     return () => {
    //         element.removeEventListener("wheel", handleWheel)
    //     }
    // }, [scrollRef])

    useEffect(() => {
        if (!scrollRef.current) {
            return;
        }

        const element = scrollRef.current;
        const elementScroll = element.querySelector("div");

        let scrollPosition = 0; // Store current scroll position
        let isScrolling = false; // Flag to check if scrolling is in progress

        const smoothScroll = () => {
            if (!isScrolling) return; // Exit if scrolling is not needed
            scrollPosition *= 0.7; // Damping effect
            elementScroll.scrollTop += scrollPosition; // Apply scroll

            if (Math.abs(scrollPosition) > 0.5) {
                // Continue if scroll speed is significant
                requestAnimationFrame(smoothScroll);
            } else {
                isScrolling = false; // Stop scrolling if movement is negligible
            }
        };

        const handleWheel = (e) => {
            scrollPosition += e.deltaY / 2; // Add wheel delta to scroll position
            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(smoothScroll);
            }
            e.preventDefault(); // Prevent default wheel action
        };

        element.addEventListener("wheel", handleWheel);

        return () => {
            element.removeEventListener("wheel", handleWheel);
        };
    }, [scrollRef]);

    return (
        <ScrollArea
            ref={scrollRef}
            className="h-full relative"
            onScrollCapture={(e) => {
                setScrollTop(e.target.scrollTop);
            }}
        >
            <div
                className="p-4 w-80"
                style={{ height: `${queue.length * (height + gap)}px` }}
            >
                {queue
                    .slice(queueIndex + 1)
                    .slice(startIndex, endIndex)
                    .map((song, index) => (
                        <div
                            key={"queue" + song.id + index}
                            className="flex items-center space-x-2 absolute w-72"
                            style={{
                                top:
                                    gap +
                                    (index + startIndex) * (height + gap) -
                                    scrollTop,
                            }}
                        >
                            <Image
                                src={`https://api.music.rockhosting.org/api/song/image/${song.id}_64x64`}
                                alt={`${song.title} cover`}
                                width={40}
                                height={40}
                                className="rounded"
                            />
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-medium truncate"
                                    title={song.title}
                                >
                                    {song.title}
                                </p>
                                <p
                                    className="text-xs text-muted-foreground truncate"
                                    title={song.artist}
                                >
                                    {song.artist}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </ScrollArea>
    );
}

export default function Layout({ children }) {
    const [showLyrics, setShowLyrics] = React.useState(false);

    const [showNavigation, setShowNavigation] = React.useState(false);
    const [showQueue, setShowQueue] = React.useState(false);
    const { theme, setTheme } = useTheme();
    const session = useSession();

    const [lyrics, setLyrics] = useState();

    const linkRef = useRef();

    const [dragOver, setDragOver] = useState(false);

    const {
        audio,
        currentSong,
        currentTime,
        queue,
        queueIndex,
        audioDuration,
        isPlaying,
        toggleRandomQueue,
        randomQueue,
        handleNext,
        handlePrevious,
        handlePlay,
        handlePause,
        audioVolume,
        setAudioVolume,
    } = useContext(MediaPlayerContext);

    useEffect(() => {
        if (!audio) {
            return;
        }

        if (isPlaying === true) {
            audio.play();
        } else if (isPlaying === false) {
            audio.pause();
        }
    }, [audio, isPlaying]);

    useEffect(() => {
        apiFetch(`/api/song/normal-lyrics/${currentSong.id}`).then(
            (response) => {
                if (response.ok) {
                    response.text().then((data) => {
                        setLyrics(data);
                    });
                }
            },
        );
    }, [currentSong]);

    const handleDragEnter = (event) => {
        event.preventDefault();
        if (!event.currentTarget.contains(event.relatedTarget)) {
            console.log("onDragEnter1");
            setDragOver(true);
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDragOver(false);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("handleDrop");
        setDragOver(false);

        const spotifyUrl = event.dataTransfer.getData("text");
        console.log(spotifyUrl);

        // https://open.spotify.com/playlist/0RTXe1pNJ1JuetAp0VrHaz

        if (
            spotifyUrl.includes("open.spotify.com") &&
            (spotifyUrl.includes("playlist") || spotifyUrl.includes("album"))
        ) {
            const type = spotifyUrl.split("open.spotify.com")[1].split("/")[1];
            const id = spotifyUrl.split("open.spotify.com")[1].split("/")[2];
            console.log("type", type);
            console.log("id", id);

            toast("Adding playlist", {});
            const url = `https://api.music.rockhosting.org/api/download-list-db/${type}/${id}?user_id=${session.data.user.id}`;
            console.log(url);
            const eventSource = new EventSource(url);

            eventSource.onmessage = (event) => {
                const message = JSON.parse(event.data);

                console.log("message:", message);

                if ("list_id" in message) {
                    // const link = document.createElement("a")
                    // link.href = `/experimental/list/${message.list_id}`
                    // link.click()

                    console.log(linkRef.current);

                    // router.push(`/experimental/list/${message.list_id}`)
                    console.log(message.list_id);
                }
            };

            eventSource.onerror = (error) => {
                console.error(error);
                eventSource.close();
            };
        } else {
            toast("Error, bad URL");
        }
    };

    useEffect(() => {
        console.log("linkRef", linkRef);
    }, [linkRef]);

    return (
        <>
            <div
                className="flex flex-col h-screen bg-background text-foreground overflow-hidden"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
            >
                {/* Main content area */}
                <div className="flex-1 flex">
                    {/* Navigation toggle button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="relative top-4 z-10"
                        onClick={() => setShowNavigation(!showNavigation)}
                        aria-label={
                            showNavigation
                                ? "Hide navigation"
                                : "Show navigation"
                        }
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Sidebar */}
                    <div
                        className={`${showNavigation ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden bg-card border-r`}
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">RockIt!</h1>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() =>
                                        setTheme(
                                            theme === "dark" ? "light" : "dark",
                                        )
                                    }
                                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                                >
                                    {theme === "dark" ? (
                                        <Sun className="h-5 w-5" />
                                    ) : (
                                        <Moon className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>

                            {(function () {
                                switch (session.status) {
                                    case "authenticated":
                                        return (
                                            <div className="flex items-center space-x-2 mb-6">
                                                {/* <Image src={session.user.image} alt='' width={35} height={35} className='rounded-full' style={{ top: '10px', left: '10px' }}></Image> */}
                                                <Avatar
                                                    style={{
                                                        top: showNavigation
                                                            ? "85px"
                                                            : "60px",
                                                        left: showNavigation
                                                            ? "60px"
                                                            : "6px",
                                                    }}
                                                    className={`absolute transition-all duration-300 ${showNavigation ? "" : "w-7 h-7"}`}
                                                >
                                                    <AvatarImage
                                                        src={
                                                            session.data.user
                                                                ?.image ||
                                                            undefined
                                                        }
                                                        alt={
                                                            session.data.user
                                                                ?.name || "User"
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        <User />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="pl-10">
                                                    <p className="font-semibold">
                                                        {
                                                            session.data.user
                                                                ?.name
                                                        }
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            session.data.user
                                                                ?.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    case "loading":
                                        return (
                                            <div className="flex items-center space-x-2 mb-6">
                                                <div
                                                    style={{
                                                        top: showNavigation
                                                            ? "85px"
                                                            : "60px",
                                                        left: showNavigation
                                                            ? "60px"
                                                            : "6px",
                                                    }}
                                                    className={`bg-neutral-500 absolute transition-all duration-300 rounded-full ${showNavigation ? "w-10 h-10" : "w-7 h-7"}`}
                                                >
                                                    <Skeleton className="w-full h-full relative rounded-full"></Skeleton>
                                                </div>
                                                <div className="pl-10">
                                                    <Skeleton className="bg-neutral-500 h-4 w-36 mt-2" />
                                                    <Skeleton className="bg-neutral-400 h-3 w-32 mt-1" />
                                                </div>
                                            </div>
                                        );
                                    case "unauthenticated":
                                        return (
                                            <Button
                                                size="icon"
                                                variant="default"
                                                onClick={() => {
                                                    signIn("google", {
                                                        callbackUrl:
                                                            "/experimental",
                                                    });
                                                }}
                                                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                                                className="w-full"
                                            >
                                                Login
                                            </Button>
                                        );
                                }
                            })()}

                            <nav>
                                <ul className="space-y-2">
                                    <NavigationBar showing={showNavigation}>
                                        <NavigationPath
                                            path="/experimental"
                                            label="Home"
                                            Icon={Home}
                                        />
                                        <NavigationPath
                                            path="/experimental/search"
                                            label="Search"
                                            Icon={Search}
                                        />
                                        <NavigationPath
                                            path="/experimental/library"
                                            label="Your Library"
                                            Icon={Library}
                                        />
                                        {session.data?.user?.admin === true ? (
                                            <>
                                                <NavigationSeparator />
                                                <NavigationPath
                                                    path="/admin/general"
                                                    label="Admin"
                                                    Icon={Lock}
                                                />
                                                <NavigationPath
                                                    path="/admin/users"
                                                    label="Users"
                                                    Icon={Users}
                                                />
                                                <NavigationPath
                                                    path="/admin/lists"
                                                    label="Lists"
                                                    Icon={ListMusic}
                                                />
                                                <NavigationPath
                                                    path="/admin/songs"
                                                    label="Songs"
                                                    Icon={Music2}
                                                />
                                                <NavigationSeparator />
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </NavigationBar>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* Content and Queue View */}
                    <div className="flex-1 flex overflow-hidden h-[calc(100vh_-_8rem)]">
                        {/* Content View */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full relative">
                                {showLyrics ? (
                                    <ScrollArea className="h-full px-6">
                                        <div className="p-6">
                                            <h2 className="text-2xl font-semibold mb-4">
                                                Lyrics
                                            </h2>
                                            <pre className="whitespace-pre-wrap font-sans">
                                                {lyrics ||
                                                    "No lyrics available"}
                                            </pre>
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    children
                                )}
                            </div>
                        </div>

                        {/* Queue View */}
                        <div
                            className={`${showQueue ? "w-80" : "w-0"} transition-all duration-300 bg-card border-l relative`}
                        >
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-4 -left-10 z-10"
                                onClick={() => setShowQueue(!showQueue)}
                                aria-label={
                                    showQueue ? "Hide queue" : "Show queue"
                                }
                            >
                                {showQueue ? (
                                    <ChevronRight className="h-5 w-5" />
                                ) : (
                                    <ChevronLeft className="h-5 w-5" />
                                )}
                            </Button>
                            <div className="p-4 border-b">
                                <h2 className="font-semibold">Queue</h2>
                            </div>
                            <QueueContainer />
                        </div>
                    </div>
                </div>

                {/* Persistent player UI */}
                <div className="border-t bg-card text-card-foreground h-32">
                    <div className="container mx-auto px-4 py-2">
                        <div
                            className="grid items-center justify-betw een "
                            style={{
                                gridTemplateColumns: "1fr min-content 1fr",
                            }}
                        >
                            {/* Current song info */}
                            <div className="flex items-center space-x-4">
                                {currentSong && (
                                    <Image
                                        src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id}_64x64`}
                                        alt={`${currentSong.title} cover`}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded"
                                    />
                                )}
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-nowrap text-ellipsis overflow-x-hidden">
                                        {currentSong?.title ||
                                            "No song playing"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground text-nowrap text-ellipsis overflow-x-hidden">
                                        {currentSong?.artist ||
                                            "Unknown artist"}
                                    </p>
                                </div>
                            </div>

                            {/* Playback controls */}
                            <div className="flex items-center space-x-4 justify-self-center">
                                <Button
                                    size="icon"
                                    variant={randomQueue ? "default" : "ghost"}
                                    onClick={toggleRandomQueue}
                                    aria-label={
                                        showLyrics
                                            ? "Hide lyrics"
                                            : "Show lyrics"
                                    }
                                    className="h-8 w-8"
                                >
                                    <Shuffle className="h-4 w-4" />
                                </Button>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handlePrevious}
                                >
                                    <SkipBack className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={() => {
                                        isPlaying
                                            ? handlePause()
                                            : handlePlay();
                                    }}
                                >
                                    {isPlaying ? (
                                        <Pause className="h-5 w-5" />
                                    ) : (
                                        <Play className="h-5 w-5" />
                                    )}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleNext}
                                >
                                    <SkipForward className="h-5 w-5" />
                                </Button>

                                {/* <label className='w-5'></label> */}

                                <Button
                                    size="icon"
                                    variant={showLyrics ? "default" : "ghost"}
                                    onClick={() => setShowLyrics(!showLyrics)}
                                    aria-label={
                                        showLyrics
                                            ? "Hide lyrics"
                                            : "Show lyrics"
                                    }
                                    className="h-8 w-8"
                                >
                                    <MicVocal className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Volume control */}
                            <div className="hidden md:flex items-center space-x-2 justify-self-end">
                                <Volume2 className="h-5 w-5" />
                                <Slider
                                    value={[audioVolume]}
                                    onValueChange={(e) => {
                                        audio.volume = e[0] ** 2;
                                        setAudioVolume(e[0]);
                                    }}
                                    className="w-24"
                                    max={1}
                                    step={0.01}
                                />
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-2">
                            <Slider
                                className="w-full"
                                defaultValue={[0]}
                                onValueChange={(e) => {
                                    audio.currentTime =
                                        (e[0] / 100) * audioDuration;
                                }}
                                value={[(currentTime / audioDuration) * 100]}
                                max={100}
                                step={0.1}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{getTime(currentTime)}</span>
                                <span>{currentSong?.duration || "0:00"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={clsx(
                    "fixed top-0 left-0 right-0 bottom-0 bg-neutral-900/80 z-50",
                    { hidden: !dragOver },
                )}
                onDragLeave={handleDragLeave}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="left-1/2 top-1/2 relative -translate-y-1/2 -translate-x-1/2 flex flex-col w-fit items-center">
                    <Download className=" w-32 h-32"></Download>
                    <h2>Drop your playlist to add it to your library</h2>
                </div>
            </div>
            <Toaster />
        </>
    );
}
