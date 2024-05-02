
'use client';

import React, { createContext, useState, useEffect } from 'react';

const AudioContext = createContext();

const AudioProvider = ({ children }) => {
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(null);

    const [currentSong, setCurrentSong] = useState({
        title: '',
        artist: '',
        id: '',
        genre: '',
        album: '',
        duration: '',
    });
    const [currentList, setCurrentList] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        setAudio(new Audio(URL))
    }, [])

    useEffect(() => {
        const storedCurrentSong = localStorage.getItem('currentSong');
        const storedCurrentList = localStorage.getItem('currentList');

        if (storedCurrentSong) {
            setCurrentSong(JSON.parse(storedCurrentSong));
        }
        if (storedCurrentList) {
            setCurrentList(JSON.parse(storedCurrentList));
        }
    }, []);

    useEffect(() => {
        if (currentSong.title !== '') {
            localStorage.setItem('currentSong', JSON.stringify(currentSong));
        }
    }, [currentSong]);

    useEffect(() => {
        if (currentList !== '') {
            localStorage.setItem('currentList', JSON.stringify(currentList));
        }
    }, [currentList]);

    useEffect(() => {
        if (currentTime !== '') {
            localStorage.setItem('currentTime', JSON.stringify(currentTime));
        }
    }, [currentTime]);

    useEffect(() => {
        if (!(audio instanceof HTMLAudioElement)) { return }

        audio.src = `https://music.rockhosting.org/api/song/${currentSong.id}`

        const storedCurrentTime = localStorage.getItem('currentTime');

        if (storedCurrentTime) {
            audio.currentTime = storedCurrentTime
        }

        audio.addEventListener("play", function () {
            setIsPlaying(true)
        })
        audio.addEventListener("pause", function () {
            setIsPlaying(false)
        })

        audio.addEventListener("timeupdate", function () {
            setCurrentTime(audio.currentTime)
        })

    }, [audio]);

    return (
        <AudioContext.Provider value={{
            audio,
            setAudio,

            currentSong,
            setCurrentSong,

            currentList,
            setCurrentList,

            isPlaying,
            setIsPlaying,
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export { AudioContext, AudioProvider };
