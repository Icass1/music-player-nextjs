'use client'

import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { AudioContext } from '@/app/audioContext';
import clsx from 'clsx';

export default function Home() {
    const [musicData, setMusicData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://music.rockhosting.org/api/lists');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMusicData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Grid musicData={musicData}></Grid>
    );
}

function Grid ({ musicData }) {
    const { currentList } = useContext(AudioContext);
    return (
        <div className='grid gap-2 p-2' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {musicData.map((item) => (
                <Link href={`/list/${item.id}`} key={item.id} className={
                    clsx('rounded-lg grid grid-cols-2 bg-neutral-800 hover:bg-neutral-700', { 'bg-yellow-700 hover:bg-yellow-600': item.id == currentList })
                } style={{ gridTemplateColumns: '50px 1fr' }}>
                    <Image id="TEST" src={`https://music.rockhosting.org/api/list/image/${item.id}_50x50`} width={50} height={50} className='rounded-lg' alt={item.name}></Image>
                    <div className='grid' style={{gridTemplateRows: '24px 25px'}}>
                        <label className='pl-3 text-lg pr-3 fade-out-neutral-200 font-bold cursor-pointer min-w-0 max-w-full'>{item.name}</label>
                        <label className='pl-3 fade-out-neutral-300 cursor-pointer min-w-0 max-w-full'>{item.author}</label>
                    </div>
                </Link>
            ))}
        </div>
    )
}