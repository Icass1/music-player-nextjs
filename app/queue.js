'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AudioContext } from '@/app/audioContext';

export default function Queue() {
    const {
        queue,
        queueIndex,
    } = useContext(AudioContext);


    return (
        <div>
            {queue?.slice(queueIndex+1, queue.length).map((item) => (
                <div key={item.id}>{item.title}</div>
            ))}
        </div>
    );
}