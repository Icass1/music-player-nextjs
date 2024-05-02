
'use client';

import { AudioContext } from '@/app/audioContext';
import { useContext, useEffect } from 'react';
import Image from 'next/image';
import { Slider } from "@nextui-org/react";

import './globals.css'

export default function SongInfo() {

    const { currentSong } = useContext(AudioContext);

    return (
        <>
            <label className='block text-3xl w-full ml-2 mt-2 mr-2 fade-out-neutral-400'>{currentSong.title}</label>
            <label className='block text-2xl text-neutral-500 truncate w-full ml-2 mr-2'>{currentSong.artist}</label>
            <Image priority="high" className='ml-auto mr-auto' alt="Current Song" src={`https://music.rockhosting.org/api/song/image/${currentSong.id}`} width={180} height={180} />
            
        </>
    )
}
