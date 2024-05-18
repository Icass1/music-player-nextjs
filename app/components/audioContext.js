'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';

const MediaPlayerContext = createContext();

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
    const [currentTime, setCurrentTime] = useState(null);

    const [audioDuration, setAudioDuration] = useState(0);
    const [audioVolume, setAudioVolume] = useState(1);
    const [analyser, setAnalyser] = useState(null)

    const [queue, setQueue] = useState([])
    const [queueIndex, setQueueIndex] = useState(null)
    const [randomQueue, setRandomQueue] = useState(null)

    useEffect(() => {
        setAudio(new Audio(URL))
    }, [])

    useEffect(() => {
        const storedCurrentSong = localStorage.getItem('currentSong');
        const storedCurrentList = localStorage.getItem('currentList');
        const storedQueue = localStorage.getItem('queue');
        const storedQueueIndex = localStorage.getItem('queueIndex');
        const storedRandomQueue = localStorage.getItem('randomQueue');

        if (storedCurrentSong) {
            setCurrentSong(JSON.parse(storedCurrentSong));
        }
        if (storedCurrentList) {
            setCurrentList(JSON.parse(storedCurrentList));
        }
        if (storedQueue) {
            setQueue(JSON.parse(storedQueue));
        } else {
            setQueue([]);
        }
        if (storedRandomQueue) {
            setRandomQueue(JSON.parse(storedRandomQueue));
        } else {
            setRandomQueue(false);
        }
        if (storedQueueIndex) {
            setQueueIndex(JSON.parse(storedQueueIndex))
        } else {
            setQueueIndex(0)
        }
    }, []);

    useEffect(() => {
        if (currentSong.title !== '') {
            localStorage.setItem('currentSong', JSON.stringify(currentSong));
        }

        if (currentSong.title != '' && currentSong.artist != '') {
            document.title = currentSong.title + " - " + currentSong.artist
        } else {
            document.title = "Music Player"
        }
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist,
                album: currentSong.album,
                artwork: [
                    { src: `https://api.music.rockhosting.org/api/song/image/${currentSong.id}`, sizes: '640x640', type: 'image/jpeg' },
                ]
            });
        }

    }, [currentSong]);

    useEffect(() => {
        if (currentList !== '') {
            localStorage.setItem('currentList', JSON.stringify(currentList));
        }
    }, [currentList]);

    useEffect(() => {
        if (currentTime != "null" && currentTime != null) {
            localStorage.setItem('currentTime', JSON.stringify(currentTime));
        }
    }, [currentTime]);

    useEffect(() => {
        if (queue != null && queue.length != 0) {
            localStorage.setItem('queue', JSON.stringify(queue));
        }
    }, [queue]);

    useEffect(() => {

        if (queueIndex != null) {

            localStorage.setItem('queueIndex', JSON.stringify(queueIndex));
        }
    }, [queueIndex]);


    useEffect(() => {
        if (!(audio instanceof HTMLAudioElement)) { return }

        audio.src = `https://api.music.rockhosting.org/api/song/${currentSong.id}`;
        audio.volume = 1;
        audio.crossOrigin = "anonymous"


        const storedCurrentTime = localStorage.getItem('currentTime');
        if (storedCurrentTime && storedCurrentTime != "null") {
            audio.currentTime = storedCurrentTime;
        }

        let context;

        audio.addEventListener("play", function () {
            setIsPlaying(true);

            if (context == undefined) {
                context = new AudioContext();
                const _analyser = context.createAnalyser()
                const source = context.createMediaElementSource(audio);
                source.connect(_analyser);
                _analyser.connect(context.destination);
                setAnalyser(_analyser)
            }
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

    }, [audio]);

    useEffect(() => {

        navigator.mediaSession.setActionHandler('previoustrack', () => {
            if (currentTime > 5) {
                audio.currentTime = 0;
            } else {
                if (queueIndex <= 0) {
                    return
                }
                else {
                    audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex - 1].id}`;
                    audio.play();

                    setCurrentSong(queue[queueIndex - 1]);
                    setQueueIndex(queueIndex - 1);
                }
            }
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {

            if (queueIndex >= queue.length - 1) {
                audio.src = `https://api.music.rockhosting.org/api/song/${queue[0].id}`;
                audio.play();
    
                setCurrentSong(queue[0]);
                setQueueIndex(0);
    
            } else {
                audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex + 1].id}`;
                audio.play();
    
                setCurrentSong(queue[queueIndex + 1]);
                setQueueIndex(queueIndex + 1);
            }

        });

    }, [audio, currentSong, currentTime, queue, queueIndex])

    useEffect(() => {
        if (!(audio instanceof HTMLAudioElement)) { return }

        audio.onended = function () {
            if (queueIndex + 1 >= queue.length) {
                audio.src = `https://api.music.rockhosting.org/api/song/${queue[0].id}`;
                audio.play();

                setCurrentSong(queue[0]);
                setQueueIndex(0);
                return;
            }

            audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex + 1].id}`;
            audio.play();

            setCurrentSong(queue[queueIndex + 1]);
            setQueueIndex(queueIndex + 1);
        }

    }, [audio, queue, queueIndex])


    useEffect(() => {

        if (randomQueue == null) { return }

        localStorage.setItem('randomQueue', JSON.stringify(randomQueue))

    }, [randomQueue])

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
        <MediaPlayerContext.Provider value={{
            getTime,

            audio,
            analyser,

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

            queue,
            setQueue,

            queueIndex,
            setQueueIndex,

            randomQueue,
            setRandomQueue,

            audioVolume,
            setAudioVolume,
        }}>
            {children}
        </MediaPlayerContext.Provider>
    );
};

export { MediaPlayerContext, AudioProvider };
