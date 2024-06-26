'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch';

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

    const session = useSession()

    useEffect(() => {
        setAudio(new Audio())
    }, [])

    useEffect(() => {

        let storedCurrentSong;
        let storedCurrentList;
        let storedQueue;
        let storedQueueIndex;
        let storedRandomQueue;

        if (session.status == "authenticated") {

            if (randomQueue != null) {
                return
            }

            fetch(`https://api.music.rockhosting.org/api/song/info/${session.data.user.current_song}`).
                then(response => response.json()).
                then(data => {
                    setCurrentSong(data);
                })

            setCurrentList(session.data.user.current_list);

            setQueue(JSON.parse(session.data.user.queue))
            setQueueIndex(session.data.user.queue_index)
            setRandomQueue(session.data.user.random_queue)
            audio.currentTime = session.data.user.current_time

        } else if (session.status == "unauthenticated") {
            storedCurrentSong = JSON.parse(localStorage.getItem('currentSong'));
            storedCurrentList = JSON.parse(localStorage.getItem('currentList'));
            storedQueue = JSON.parse(localStorage.getItem('queue'));
            storedQueueIndex = JSON.parse(localStorage.getItem('queueIndex'));
            storedRandomQueue = JSON.parse(localStorage.getItem('randomQueue'));

            if (storedCurrentSong) {
                setCurrentSong(storedCurrentSong);
            }
            if (storedCurrentList) {
                setCurrentList(storedCurrentList);
            }
            if (storedQueue) {
                setQueue(storedQueue);
            } else {
                setQueue([]);
            }
            if (storedRandomQueue) {
                setRandomQueue(storedRandomQueue);
            } else {
                setRandomQueue(false);
            }
            if (storedQueueIndex) {
                setQueueIndex(storedQueueIndex)
            } else {
                setQueueIndex(0)
            }
        }

    }, [session]);

    useEffect(() => {

        if (currentSong.title == '' && currentSong.artist == '') {
            document.title = "Music Player"
            return
        }

        if (session.status == "authenticated") {
            apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
                method: "POST",
                body: JSON.stringify({
                    current_song: currentSong.id,
                })
            })
        } else if (session.status == "unauthenticated") {
            localStorage.setItem('currentSong', JSON.stringify(currentSong));
        }

        document.title = currentSong.title + " - " + currentSong.artist
        if (audio.src == `https://api.music.rockhosting.org/api/song/${currentSong.id}`) {

        } else if (audio.src == "") {
            let currentTime = audio.currentTime
            audio.src = `https://api.music.rockhosting.org/api/song/${currentSong.id}`;
            audio.currentTime = currentTime
        } else {
            audio.src = `https://api.music.rockhosting.org/api/song/${currentSong.id}`;
            audio.play()
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

    }, [currentSong, session, audio]);

    useEffect(() => {
        if (currentList == '') {
            return
        }

        if (session.status == "authenticated") {
            apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
                method: "POST",
                body: JSON.stringify({
                    current_list: currentList,
                })
            })

        } else if (session.status == "unauthenticated") {
            localStorage.setItem('currentList', JSON.stringify(currentList));
        }

    }, [currentList, session]);



    // const updateCurrentTime = debounce((currentTime, session) => {
    //     console.log("ASDF")
    //     apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
    //         method: "POST",
    //         body: JSON.stringify({
    //             current_time: currentTime,
    //         })
    //     })
    // }, 1000);

    useEffect(() => {
        if (currentTime == "null" || currentTime == null) {
            return
        }

        if (session.status == "authenticated") {

            apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
                method: "POST",
                body: JSON.stringify({
                    current_time: currentTime,
                })
            })

            // updateCurrentTime(currentTime, session);

        } else if (session.status == "unauthenticated") {
            localStorage.setItem('currentTime', JSON.stringify(currentTime));
        }
    }, [currentTime, session]);

    useEffect(() => {
        if (queue == null || queue.length == 0) {
            return
        }

        if (session.status == "authenticated") {
            apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
                method: "POST",
                body: JSON.stringify({
                    queue: queue,
                })
            })
        } else if (session.status == "unauthenticated") {
            localStorage.setItem('queue', JSON.stringify(queue));
        }

    }, [queue, session]);

    useEffect(() => {

        if (queueIndex == null) {
            return
        }
        if (session.status == "authenticated") {
            apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
                method: "POST",
                body: JSON.stringify({
                    queue_index: queueIndex,
                })
            })
        } else if (session.status == "unauthenticated") {
            localStorage.setItem('queueIndex', JSON.stringify(queueIndex));
        }
    }, [queueIndex, session]);

    useEffect(() => {
        if (!(audio instanceof HTMLAudioElement)) { return }

        // audio.src = `https://api.music.rockhosting.org/api/song/${currentSong.id}`;
        audio.volume = 1;
        audio.crossOrigin = "anonymous"


        // const storedCurrentTime = localStorage.getItem('currentTime');
        // if (storedCurrentTime && storedCurrentTime != "null") {
        //     audio.currentTime = storedCurrentTime;
        // }

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
                    // audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex - 1].id}`;
                    // audio.play();

                    setCurrentSong(queue[queueIndex - 1]);
                    setQueueIndex(queueIndex - 1);
                }
            }
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {

            if (queueIndex >= queue.length - 1) {
                // audio.src = `https://api.music.rockhosting.org/api/song/${queue[0].id}`;
                // audio.play();

                setCurrentSong(queue[0]);
                setQueueIndex(0);

            } else {
                // audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex + 1].id}`;
                // audio.play();

                setCurrentSong(queue[queueIndex + 1]);
                setQueueIndex(queueIndex + 1);
            }
        });

    }, [audio, currentSong, currentTime, queue, queueIndex])

    useEffect(() => {
        if (!(audio instanceof HTMLAudioElement)) { return }

        audio.onended = function () {

            // console.log(currentSong)
            apiFetch("https://api.music.rockhosting.org/api/user/end-song", session, {method: "POST", body: JSON.stringify({song_id: currentSong})})

            if (queueIndex + 1 >= queue.length) {
                setCurrentSong(queue[0]);
                setQueueIndex(0);
                return;
            }
            setCurrentSong(queue[queueIndex + 1]);
            setQueueIndex(queueIndex + 1);
        }

    }, [audio, queue, queueIndex, session])


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

    const previousSong = useCallback(() => {
        // console.log("previousSong useCallback")
        if (currentTime > 5) {
            audio.currentTime = 0;
        } else {
            if (queueIndex <= 0) {
                return
            }
            else {
                // audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex - 1].id}`;
                // audio.play();

                setCurrentSong(queue[queueIndex - 1]);
                setQueueIndex(queueIndex - 1);
            }
        }
    }, [audio, currentTime, queueIndex, queue, setCurrentSong, setQueueIndex])

    const nextSong = useCallback(() => {
        // console.log("nextSong useCallback", queue)
        if (queueIndex >= queue.length - 1) {

            // audio.src = `https://api.music.rockhosting.org/api/song/${queue[0].id}`;
            // audio.play();

            setCurrentSong(queue[0]);
            setQueueIndex(0);

        } else {
            // audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex + 1].id}`;
            // audio.play();

            setCurrentSong(queue[queueIndex + 1]);
            setQueueIndex(queueIndex + 1);
        }
    }, [audio, currentTime, queueIndex, queue, setCurrentSong, setQueueIndex])

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

            previousSong,
            nextSong,
        }}>
            {children}
        </MediaPlayerContext.Provider>
    );
};

export { MediaPlayerContext, AudioProvider };
