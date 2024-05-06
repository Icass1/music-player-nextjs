'use client'

import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { AudioContext } from './components/audioContext';

export default function Home() {
    const [musicData, setMusicData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.music.rockhosting.org/api/lists');
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
        // <Grid musicData={musicData}></Grid>
        <ListWithName musicData={musicData}></ListWithName>
    );
}

function Grid({ musicData }) {
    const { currentList } = useContext(AudioContext);
    return (
        <div className='grid gap-2 p-2' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {musicData.map((item) => (
                <Link href={`/list/${item.id}`} key={item.id} className={
                    clsx('rounded-lg grid grid-cols-2 bg-neutral-800 hover:bg-neutral-700', { 'bg-yellow-700 hover:bg-yellow-600': item.id == currentList })
                } style={{ gridTemplateColumns: '50px 1fr' }}>
                    <Image src={`https://api.music.rockhosting.org/api/list/image/${item.id}_50x50`} width={50} height={50} className='rounded-lg' alt={item.name}></Image>
                    <div className='grid' style={{ gridTemplateRows: '24px 25px' }}>
                        <label className='pl-3 text-lg pr-3 fade-out-neutral-200 font-bold cursor-pointer min-w-0 max-w-full'>{item.name}</label>
                        <label className='pl-3 fade-out-neutral-300 cursor-pointer min-w-0 max-w-full'>{item.author}</label>
                    </div>
                </Link>
            ))}
        </div>
    )
}

function ListWithName({ musicData }) {
    const { currentList } = useContext(AudioContext);

    let listsByName = {};
    let listsByNameTemp = {};

    for (let i of musicData) {
        if (listsByName[i.author] == undefined) {
            listsByName[i.author] = [];
        }
        listsByName[i.author].push(i);
    }

    for (let k of Object.keys(listsByName).sort()) {
        listsByNameTemp[k] = listsByName[k];
    }

    listsByName = listsByNameTemp;

    return (
        <div>
            {Object.keys(listsByName).map((author) => (
                <div key={author} className='m-2 mb-4'>
                    <label className='text-4xl font-bold'>{author}</label>
                    <div className='grid gap-2 mt-1' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                        {listsByName[author].map((item) => (

                            <Link href={`/list/${item.id}`} key={item.id} className={
                                clsx('rounded-lg grid grid-cols-2 bg-neutral-700 hover:bg-neutral-700 items-center')
                            } style={{ gridTemplateColumns: '50px 1fr' }}>

                                <Image src={`https://api.music.rockhosting.org/api/list/image/${item.id}_50x50`} width={50} height={50} className='rounded-lg' alt={item.name}></Image>
                                <label className={clsx('ml-2 text-2xl pr-3 fade-out-neutral-200 font-bold cursor-pointer min-w-0 max-w-full', {'fade-out-yellow-600': item.id == currentList})}>{item.name}</label>
    
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}