"use client"

import React, { useContext, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SkipBack, SkipForward, Play, Pause, Volume2, MicVocal, Shuffle, Sun, Moon, Home, Library, Search, Menu, ChevronLeft, ChevronRight, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { MediaPlayerContext } from '../components/audioContext'
import { getTime } from '../utils/getTime'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import Image from 'next/image'



export default function Layout({ children }) {
    const [showLyrics, setShowLyrics] = React.useState(false);

    const [showNavigation, setShowNavigation] = React.useState(false);
    const [showQueue, setShowQueue] = React.useState(false);
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession();

    const pathname = usePathname();

    const {
        audio,
        currentSong,
        currentTime,
        queue,
        queueIndex,
        audioDuration,
        isPlaying,
        handleNext,
        handlePrevious,
        handlePlay,
        handlePause,
    } = useContext(MediaPlayerContext)

    useEffect(() => {

        if (!audio) { return }

        if (isPlaying === true) {
            audio.play()
        } else if (isPlaying === false) {
            audio.pause()
        }
    }, [audio, isPlaying])

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            {/* Main content area */}
            <div className="flex-1 flex">
                {/* Navigation toggle button */}
                <Button
                    size="icon"
                    variant="ghost"
                    className="relative top-4 z-10"
                    onClick={() => setShowNavigation(!showNavigation)}
                    aria-label={showNavigation ? "Hide navigation" : "Show navigation"}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Sidebar */}
                <div className={`${showNavigation ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-r`}>
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">RockIT</h1>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </div>
                        {session && (
                            <div className="flex items-center space-x-2 mb-6">
                                <Avatar>
                                    <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{session.user?.name}</p>
                                    <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                                </div>
                            </div>
                        )}
                        <nav>
                            <ul className="space-y-2">
                                <Link href={"/experimental"}>
                                    <Button
                                        variant={pathname === '/experimental' ? 'default' : 'ghost'}
                                        className={`absolute justify-start transition-all duration-300 ${showNavigation ? 'w-[230px] top-[150px] left-[56px]' : ' top-[60px] left-[3px] p-0 w-[32px] h-8'}`}
                                    >
                                        <Home className={`h-4 w-4 transition-all duration-300 ${showNavigation ? 'mr-2' : 'mr-0 ml-[7px]'}`} />
                                        {showNavigation ? <label className='w-auto overflow-hidden'>Home</label> : <></>}
                                    </Button>
                                </Link>
                                <Link href={"/experimental/search"}>
                                    <Button
                                        variant={pathname === '/experimental/search' ? 'default' : 'ghost'}
                                        className={`absolute justify-start transition-all duration-300 ${showNavigation ? 'w-[230px] top-[200px] left-[56px]' : ' top-[100px] left-[3px] p-0 w-[32px] h-8'}`}
                                    >
                                        <Search className={`h-4 w-4 transition-all duration-300 ${showNavigation ? 'mr-2' : 'mr-0 ml-[7px]'}`} />
                                        {showNavigation ? <label className='w-auto overflow-hidden'>Search</label> : <></>}
                                    </Button>
                                </Link>
                                <Link href={"/experimental/library"}>
                                    <Button
                                        variant={pathname === '/experimental/library' ? 'default' : 'ghost'}
                                        className={`absolute justify-start transition-all duration-300 ${showNavigation ? 'w-[230px] top-[250px] left-[56px]' : ' top-[140px] left-[3px] p-0 w-[32px] h-8'}`}
                                    >
                                        <Library className={`h-4 w-4 transition-all duration-300 ${showNavigation ? 'mr-2' : 'mr-0 ml-[7px]'}`} />
                                        {showNavigation ? <label className='w-auto overflow-hidden'>Your Library</label> : <></>}

                                    </Button>
                                </Link>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Content and Queue View */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Content View */}
                    <div className="flex-1 overflow-hidden">
                        {/* <ScrollArea className="h-[calc(100vh-7rem)]">
                            {showLyrics ?
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">Lyrics</h2>
                                    <pre className="whitespace-pre-wrap font-sans">{currentSong.lyrics || "No lyrics available"}</pre>
                                </div>
                                :
                                children
                            }
                        </ScrollArea> */}

                        <div className="h-[calc(100vh-8rem)] relative">
                            {showLyrics ?
                                <ScrollArea className='h-full px-6'>
                                    <div className="p-6">
                                        <h2 className="text-2xl font-semibold mb-4">Lyrics</h2>
                                        <p className="text-md mb-4">{JSON.stringify(currentSong).replace(/,/g, ' ')}</p>
                                        <pre className="whitespace-pre-wrap font-sans">{currentSong.lyrics || "No lyrics available"}</pre>
                                    </div>
                                </ScrollArea>
                                :
                                children
                            }
                        </div>



                    </div>

                    {/* Queue View */}
                    <div className={`${showQueue ? 'w-80' : 'w-0'} transition-all duration-300 bg-card border-l relative`}>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-4 -left-10 z-10"
                            onClick={() => setShowQueue(!showQueue)}
                            aria-label={showQueue ? "Hide queue" : "Show queue"}
                        >
                            {showQueue ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </Button>
                        <div className="p-4 border-b">
                            <h2 className="font-semibold">Queue</h2>
                        </div>
                        <ScrollArea className="h-[calc(100vh-14rem)]">
                            <div className="p-4 space-y-2">
                                {queue.slice(queueIndex + 1,).map((song, index) => (
                                    <div key={song.id} className="flex items-center space-x-2">
                                        <Image
                                            src={`https://api.music.rockhosting.org/api/song/image/${song.id}_64x64`}
                                            alt={`${song.title} cover`}
                                            className="w-10 h-10 rounded"
                                            width={40}
                                            height={40}
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{song.title}</p>
                                            <p className="text-xs text-muted-foreground">{song.artist}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>

            {/* Persistent player UI */}
            <div className="border-t bg-card text-card-foreground h-auto">
                <div className="container mx-auto px-4 py-2">
                    <div className="grid items-center justify-betw een " style={{ gridTemplateColumns: '1fr min-content 1fr' }}>
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
                            <div>
                                <h3 className="font-semibold">{currentSong?.title || "No song playing"}</h3>
                                <p className="text-sm text-muted-foreground">{currentSong?.artist || "Unknown artist"}</p>
                            </div>
                        </div>

                        {/* Playback controls */}
                        <div className="flex items-center space-x-4 justify-self-center">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowLyrics(!showLyrics)}
                                aria-label={showLyrics ? "Hide lyrics" : "Show lyrics"}
                            >
                                <Shuffle className="h-4 w-4" />
                            </Button>

                            <Button size="icon" variant="ghost" onClick={handlePrevious}>
                                <SkipBack className="h-5 w-5" />
                            </Button>
                            <Button size="icon" onClick={() => { isPlaying ? handlePause() : handlePlay() }}>
                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>
                            <Button size="icon" variant="ghost" onClick={handleNext}>
                                <SkipForward className="h-5 w-5" />
                            </Button>

                            {/* <label className='w-5'></label> */}

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowLyrics(!showLyrics)}
                                aria-label={showLyrics ? "Hide lyrics" : "Show lyrics"}
                            >
                                <MicVocal className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Volume control */}
                        <div className="hidden md:flex items-center space-x-2 justify-self-end">
                            <Volume2 className="h-5 w-5" />
                            <Slider
                                className="w-24"
                                defaultValue={[50]}
                                max={100}
                                step={1}
                            />
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2">
                        <Slider
                            className="w-full"
                            defaultValue={[0]}
                            onValueChange={(e) => { audio.currentTime = e[0] / 100 * audioDuration }}
                            value={[currentTime / audioDuration * 100]}
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
    )
}