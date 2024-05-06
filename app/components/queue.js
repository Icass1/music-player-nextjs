'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AudioContext } from './audioContext';

export default function Queue() {
    const {
        queue,
        queueIndex,
        audio,
        setCurrentSong,
        setQueueIndex,
    } = useContext(AudioContext);

    const handleClick = (e) => {
        let index = Number(e.target.getAttribute('index'));

        console.log(index, queue[index], typeof(index))

        audio.src = `https://api.music.rockhosting.org/api/song/${queue[index].id}`;
        audio.play()

        setQueueIndex(index);
        setCurrentSong(queue[index]);
    }

    return (
        <div className='flex flex-col'>
            {queue?.slice(queueIndex+1).map((item, index) => (
                <label className='ml-1 text-lg fade-out-neutral-50' key={item.id} index={index+queueIndex+1} onClick={handleClick}>{item.title}</label>
            ))}
        </div>
    );
}