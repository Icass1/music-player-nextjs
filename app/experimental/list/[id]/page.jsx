'use client'

import React, { useContext, useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Play, Pause, MoreHorizontal } from "lucide-react"
import { apiFetch } from '@/app/utils/apiFetch'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MediaPlayerContext } from '@/app/components/audioContext'

function ListView({ musicData }) {

    const { handlePlayList, currentList, isPlaying, handlePause, handlePlay } = useContext(MediaPlayerContext)

    return (
        <div className="h-full flex flex-col bg-background text-foreground">
            {/* List header */}
            <div className="p-6 flex items-end space-x-6">

                <Image src={`https://api.music.rockhosting.org/api/list/image/${musicData.id}_300x300`} className='rounded-md shadow-lg' alt='' width={192} height={192} />

                {/* <div className="w-48 h-48 bg-muted rounded-md shadow-lg"></div> */}

                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{musicData.name}</h1>
                    <p className="text-muted-foreground">Created by {musicData.author}</p>
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
            </div>

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
                    <TableBody>
                        {musicData.songs.map((song, index) => (
                            <TableRow className='border-b-0 cursor-pointer' key={song.id} onClick={() => { handlePlayList(musicData.id, song.id) }} variant={'ghost'}>
                                <TableCell className='py-2 w-4 text-center cursor-pointer'>{index}</TableCell>
                                <TableCell className='py-2 max-w-1 truncate'>
                                    <div className='flex flex-col'>
                                        <label className='font-medium truncate cursor-pointer text-primary'>{song.title}</label>
                                        <label className='text-sm text-muted-foreground truncate cursor-pointer'>{song.artist}</label>
                                    </div>
                                </TableCell>
                                <TableCell className='py-2 max-w-1 truncate'>{song.album}</TableCell>
                                <TableCell className='py-2 w-4'>{song.duration}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    )
}

export default function List({ params }) {


    const [musicData, setMusicData] = useState(null);


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
        <>
            {
                musicData ?

                    <ListView musicData={musicData}></ListView>
                    :
                    <></>
            }
        </>
    )
}