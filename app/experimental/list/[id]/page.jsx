'use client'

import React, { useContext, useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Play, Pause, Download, Search, AudioLines, X } from "lucide-react"
import { apiFetch } from '@/app/utils/apiFetch'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MediaPlayerContext } from '@/app/components/audioContext'
import { Input } from "@/components/ui/input"
import Equalizer from '@/app/components/equalizer'
import { Progress } from '@/components/ui/progress'

function AlbumView({ musicData }) {

    const { handlePlayList, currentList, isPlaying, handlePause, handlePlay, currentSong } = useContext(MediaPlayerContext)
    const [searchTerm, setSearchTerm] = useState('')

    const onDownload = () => {

    }

    const filteredSongs = musicData.songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            {/* Song list */}
            <ScrollArea className="flex-1 px-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='font-medium text-center'>#</TableHead>
                            <TableHead className='font-medium'>Title</TableHead>
                            <TableHead className='font-medium'>Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='gap-10'>
                        {filteredSongs.map((song, index) => {

                            const isCurrentSong = currentSong && currentSong.id === song.id;

                            return (
                                <TableRow className={`border-b-0 h-12 cursor-pointer hover:bg-muted/50 ${isCurrentSong ? 'bg-muted' : ''}`} key={song.id} onClick={() => { handlePlayList(musicData.id, song.id) }} variant={'ghost'}>
                                    <TableCell className='py-1 w-16 text-center cursor-pointer'>
                                        {
                                            isCurrentSong && isPlaying ?
                                                <AudioLines className='ml-auto mr-auto'></AudioLines>
                                                :
                                                <label>{index + 1}</label>
                                        }

                                    </TableCell>
                                    <TableCell className='py-2 max-w-1 truncate'>
                                        <label className='font-medium truncate cursor-pointer text-primary'>{song.title}</label>
                                    </TableCell>
                                    <TableCell className='py-2 w-4'>{song.duration}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </ScrollArea>
        </>
    )
}

function PlaylistView({ musicData, searchTerm }) {

    const { handlePlayList, currentList, isPlaying, handlePause, handlePlay, currentSong } = useContext(MediaPlayerContext)

    const [filteredSongs, setFilteredSongs] = useState(musicData.songs);


    useEffect(() => {


        console.log("filter")
        setFilteredSongs(musicData.songs.filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.album.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    }, [searchTerm, musicData])

    // let filteredSongs = musicData.songs


    return (
        <>

            {/* Song list */}
            <ScrollArea className="flex-1 px-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='font-medium text-center'>#</TableHead>
                            <TableHead className='font-medium'>Title</TableHead>
                            <TableHead className='font-medium'>Album</TableHead>
                            <TableHead className='font-medium'>Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='gap-10'>
                        {filteredSongs.slice(0, 20).map((song, index) => {

                            const isCurrentSong = currentSong && currentSong.id === song.id;

                            return (
                                <TableRow
                                    className={`border-b-0  cursor-pointer hover:bg-muted/50 ${isCurrentSong ? ' bg-muted ' : ''} ${song.status != "ready" ? " pointer-events-none opacity-40 " : ""}`}
                                    key={song.id + index}
                                    onClick={() => { handlePlayList(musicData.id, song.id) }}
                                    variant={'ghost'}
                                >
                                    <TableCell className='py-1 px-0 w-14 text-center cursor-pointer'>
                                        <div className='w-14 h-14 relative'>
                                            <Image className={`ml-auto mr-auto absolute ${isCurrentSong && isPlaying ? 'opacity-30' : ''}`} src={`https://api.music.rockhosting.org/api/song/image/${song.id}_64x64`} height={64} width={64} alt=''></Image>
                                            {
                                                isCurrentSong && isPlaying ?
                                                    <Equalizer bar_count={8} bar_gap={2} className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-12 w-10' centered={true} toggleCenter={false}></Equalizer>
                                                    // <AudioLines className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-8 w-8'></AudioLines>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-2 max-w-1 truncate'>
                                        <div className='flex flex-col'>
                                            <label className='truncate cursor-pointer text-primary font-medium'>{song.title}</label>
                                            <label className='truncate cursor-pointer text-sm text-muted-foreground'>{song.artist}</label>
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-2 max-w-1 truncate'>
                                        <label className='py-2 truncate cursor-pointer '>{song.album}</label>
                                    </TableCell>
                                    <TableCell className='py-2 w-4'>{song.duration}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </ScrollArea>
        </>
    )
}

function ListHeader({ musicData, setSearchTerm, searchTerm }) {
    const { handlePlayList, currentList, isPlaying, handlePause, handlePlay, currentSong } = useContext(MediaPlayerContext)

    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)

    const handleDownload = () => {
        console.log("handleDownload")

        const eventSource = new EventSource(`https://api.music.rockhosting.org/api/compress-list/${musicData.id}`)
        setIsDownloading(true)
        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.status == "compress-ended") {
                setDownloadProgress(100);
                eventSource.close();

                setTimeout(() => {
                    setDownloadProgress(0);
                    setIsDownloading(false)
                }, 1000);

                let uri = `https://api.music.rockhosting.org/api/download-list/${message.outputName}`;
                let link = document.createElement("a");
                link.href = uri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } else if (message.status == "compress-started") {
                setDownloadProgress(0);
            } else if (message.status == "compressing") {
                setDownloadProgress(message.progress);
            }
        };

        eventSource.onerror = (error) => {
            eventSource.close();
            setIsDownloading(false);
            setDownloadProgress(0);
        };

        return () => {
            eventSource.close();
        };
    }

    const handleCancelDownload = () => {
        setIsDownloading(false)
        setDownloadProgress(0)
    }

    return (
        <>
            {/* List header */}
            <div className="p-6 flex items-end space-x-6">
                <Image src={`https://api.music.rockhosting.org/api/list/image/${musicData.id}_300x300`} className='rounded-md shadow-lg' alt='' width={192} height={192} />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{musicData.name}</h1>
                    <p className="text-muted-foreground">{musicData.author}</p>
                    <p className="text-muted-foreground">{musicData.songs.length} songs</p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="px-6 py-4 flex items-center space-x-4">
                {currentList == musicData.id && isPlaying ?
                    <Button size="lg" className="rounded-full" onClick={handlePause}>
                        <Pause className="h-6 w-6 mr-2" />
                        Pause
                    </Button>
                    :
                    <Button size="lg" className="rounded-full" onClick={() => { currentList == musicData.id ? handlePlay() : handlePlayList(musicData.id) }}>
                        <Play className="h-6 w-6 mr-2" />
                        Play
                    </Button>
                }


                {isDownloading ? (
                    <div className="flex items-center space-x-2 flex-1 max-w-xs">
                        <Progress value={downloadProgress} className="flex-1" />
                        <Button variant="ghost" size="icon" onClick={handleCancelDownload} aria-label="Cancel download">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="h-5 w-5 mr-2" />
                        Download
                    </Button>
                )}
            </div>

            {/* Search input */}
            <div className="px-6 py-2">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search in album"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
        </>

    )

}

export default function List({ params }) {

    const [musicData, setMusicData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        apiFetch(`/api/list/${params.id}`).then(response => {

            if (response.ok) {
                response.json().then(data => {
                    setMusicData(data)
                })
            }
        })
    }, [params])

    return (
        <div className="h-full flex flex-col bg-background text-foreground">
            {
                musicData ?
                    <>
                        <ListHeader musicData={musicData} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
                        {
                            musicData.type == "Album" ?
                                <AlbumView musicData={musicData} searchTerm={searchTerm}></AlbumView>
                                :
                                <PlaylistView musicData={musicData} searchTerm={searchTerm}></PlaylistView>
                        }
                    </>
                    :
                    <></>
            }
        </div>
    )
}