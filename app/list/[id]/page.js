'use client';

import React, { useState, useEffect, useContext } from 'react';
import DefaultListPage from '@/app/components/listPage';
import { apiFetch } from '@/app/utils/apiFetch';

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
            const response = await apiFetch(`/api/list/${params.id}`);
            if (!response.ok) {
                setMusicData({ 'error': true, 'status': response.status, 'statusText': response.statusText });
                return
            }
            const data = await response.json();
            if (data.type == "Album") {
                data.songs = data.songs.map(song => Object.assign({}, song, { "search": song.title.toUpperCase() }))
            } else {
                data.songs = data.songs.map(song => Object.assign({}, song, { "search": song.title.toUpperCase() + " " + song.artist.toUpperCase() + " " + song.album.toUpperCase() + " " + song.genre.toUpperCase() }))
            }

            setMusicData(data);
        };
        fetchData();
    }, [params.id]);

    if (musicData?.error === true) {
        return (
            <div className='w-fit h-fit relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col' >
                {musicData.status === 404 ?
                    <label className='text-center text-4xl font-bold text-neutral-100'>List not found</label>
                    :
                    <></>
                }
                <label className='text-center text-xs'>{musicData.status} {musicData.statusText}</label>
            </div >
        )
    } else if (musicData?.id === '') {
        return <label className='w-fit h-fit relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col text-center text-4xl font-bold text-neutral-100'>Loading...</label>
    }

    return (
        <DefaultListPage listId={params.id} musicData={musicData} setMusicData={setMusicData} />
    )
}