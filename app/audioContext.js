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
    const [audioDuration, setAudioDuration] = useState(0);

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

        audio.src = `https://music.rockhosting.org/api/song/${currentSong.id}`;
        audio.volume = 1;
        const storedCurrentTime = localStorage.getItem('currentTime');
        if (storedCurrentTime) {
            audio.currentTime = storedCurrentTime;
        }

        audio.addEventListener("play", function () {
            setIsPlaying(true);
        })

        audio.addEventListener("pause", function () {
            setIsPlaying(false);
        })

        audio.addEventListener("timeupdate", function () {
            setCurrentTime(audio.currentTime);
        })

        audio.addEventListener("canplay", function () {
            setAudioDuration(audio.duration);
        })

        audio.addEventListener("ended", function () {
            console.log("audio ended")
        })

    }, [audio]);

    function getTime(seconds) {

        seconds = Math.round(seconds);

        if (typeof seconds !== 'number' || isNaN(seconds)) {
            return "Invalid input";
        }
      
        // Calculate minutes and remaining seconds
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
      
        // Format the result with leading zeros
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
      
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    return (
        <AudioContext.Provider value={{
            getTime,

            audio,
            setAudio,

            currentSong,
            setCurrentSong,

            currentList,
            setCurrentList,

            currentTime,
            setCurrentTime,

            audioDuration,
            setAudioDuration,

            isPlaying,
            setIsPlaying,
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export { AudioContext, AudioProvider };
