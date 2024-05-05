'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AudioContext } from './audioContext';

export default function Queue() {
    const {
        queue,
        queueIndex,
    } = useContext(AudioContext);

    return (
        <div className='flex flex-col'>
            {queue?.slice(queueIndex+1).map((item) => (
                <label className='text-lg fade-out-neutral-50' key={item.id}>{item.title}</label>
            ))}
        </div>
    );
}