'use client';

import React, { useState, useEffect, useContext } from 'react';
import DefaultListPage from '@/app/components/listPage';

export default function ListPage({ params }) {

    const [musicData, setMusicData] = useState({
        songs: [],
        author: '',
        id: '',
        name: '',
        type: '',
        cover_url: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.music.rockhosting.org/api/list/${params.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.type == "Album") {
                data.songs = data.songs.map(song => Object.assign({}, song, { "search": song.title.toUpperCase() }))
            } else {
                data.songs = data.songs.map(song => Object.assign({}, song, { "search": song.title.toUpperCase() + " " +  song.artist.toUpperCase() + " "  + song.album.toUpperCase() + " "  + song.genre.toUpperCase()}))
            }
            
            setMusicData(data);
        };
        fetchData();
    }, [params.id]);

    return (
        <DefaultListPage listId={params.id} musicData={musicData} />
    )
}