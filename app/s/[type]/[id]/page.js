'use client';

import React, { useState, useEffect, useContext } from 'react';
import DefaultListPage from '@/app/components/listPage';

export default function SearchListPage({ params }) {

    const [musicData, setMusicData] = useState({
        songs: [],
        author: '',
        id: '',
        name: '',
        type: '',
    });


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.music.rockhosting.org/api/s/${params.type}/${params.id}`);
            // const response = await fetch(`http://12.12.12.3:8000/api/s/${params.type}/${params.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)

            setMusicData(data);
        };
        fetchData();
    }, [params]);


    return (
        <DefaultListPage listId={params.id} musicData={musicData} />
    )
};

