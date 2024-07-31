'use client';

import React, { useState, useEffect, useContext } from 'react';
import { MediaPlayerContext } from './audioContext';

export default function Queue() {
    const {
        queue,
        queueIndex,
        audio,
        setCurrentSong,
        setQueueIndex,
    } = useContext(MediaPlayerContext);

    const handleClick = (e) => {
        let index = Number(e.target.getAttribute('index'));

        // audio.src = `https://api.music.rockhosting.org/api/song/${queue[index].id}`;
        // audio.play()

        setQueueIndex(index);
        setCurrentSong(queue[index]);
    }

    return (
        <div className='flex flex-col'>
            <label className='mt-1 ml-1 mr-1 text-left text-neutral-400 text-base'>Next in queue</label>
            {queue?.slice(queueIndex+1).map((item, index) => (
                <div key={item.id + index} className='rounded-lg w-full relative hover:bg-3'>
                    <label className='ml-1 mr-1 text-lg fade-out-neutral-50 cursor-pointer block' index={index+queueIndex+1} onClick={handleClick}>{item.title}</label>
                </div>
            ))}
        </div>
    );
}