'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch';
// import { getMusicFile } from '../utils/storage';
import io from 'socket.io-client';
import useWindowWidth from '../hooks/useWindowWidth';

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
    const [analyser, setAnalyser] = useState(null);

    const [queue, setQueue] = useState([]);
    const [queueIndex, setQueueIndex] = useState(null);
    const [randomQueue, setRandomQueue] = useState(null);

    const [showLyrics, setShowLyrics] = useState(null);

    const session = useSession();

    const innerWidth = useWindowWidth()

    const [socket, setSocket] = useState(null);
    const [homeView, setHomeView] = useState({ view: 0, numberOfViews: 2 });

    useEffect(() => {
        setAudio(new Audio());
    }, [])

    useEffect(() => {
        if (!innerWidth || !audio) { return }

        if (!(innerWidth > 768)) {
            audio.volume = 1
            setAudioVolume(1)
        }

    }, [innerWidth, audio])

    useEffect(() => {

        if (session.status !== "authenticated") { return }

        // let newSocket = io('http://12.12.12.3:8000')
        let newSocket = io('https://api.music.rockhosting.org');

        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket?.emit('register', { id: session.data.user.id });  // Send the client ID to the server
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            console.log('Reconnecting');
            newSocket?.newSocket?.connect()
        });

        newSocket.on('message', (message) => {
            // console.log('Received message:', message);
        });

        setSocket(newSocket)

        return () => {
            newSocket.disconnect();
        };
    }, [session]);


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

            if (session.data.user.current_song) {

                fetch(`https://api.music.rockhosting.org/api/song/info/${session.data.user.current_song}`).
                    then(response => response.json()).
                    then(data => {
                        setCurrentSong(data);
                    })
            }

            setCurrentList(session.data.user.current_list);

            setQueue(JSON.parse(session.data.user.queue));
            setQueueIndex(session.data.user.queue_index);
            setRandomQueue(session.data.user.random_queue);
            audio.currentTime = session.data.user.current_time;
            audio.volume = session.data.user.volume;
            setAudioVolume(session.data.user.volume);
            setShowLyrics(session.data.user.show_lyrics);

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

    }, [session, audio]);

    useEffect(() => {

        if (currentSong.title == '' && currentSong.artist == '') {
            document.title = "RockIt"
            return
        }

        if (session.status == "authenticated") {

            socket?.emit("set-user-data", { current_song: currentSong.id })

            // apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
            //     method: "POST",
            //     body: JSON.stringify({
            //         current_song: currentSong.id,
            //     })
            // })
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

    }, [currentSong, session, audio, socket]);

    useEffect(() => {
        if (currentList == '') {
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { current_list: currentList })

            // apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
            //     method: "POST",
            //     body: JSON.stringify({
            //         current_list: currentList,
            //     })
            // })

        } else if (session.status == "unauthenticated") {
            localStorage.setItem('currentList', JSON.stringify(currentList));
        }

    }, [currentList, session, socket]);

    useEffect(() => {
        if (currentList == '') {
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { volume: audioVolume })

            // apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
            //     method: "POST",
            //     body: JSON.stringify({
            //         current_list: currentList,
            //     })
            // })

        } else if (session.status == "unauthenticated") {
            localStorage.setItem('volume', JSON.stringify(audioVolume));
        }

    }, [audioVolume, session, currentList, socket]);

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
            socket?.emit("set-user-data", { current_time: currentTime, })

            // apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
            //     method: "POST",
            //     body: JSON.stringify({
            //         current_time: currentTime,
            //     })
            // })

            // updateCurrentTime(currentTime, session);

        } else if (session.status == "unauthenticated") {
            localStorage.setItem('currentTime', JSON.stringify(currentTime));
        }
    }, [currentTime, session, socket]);

    useEffect(() => {
        if (queue == null || queue.length == 0) {
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { queue: queue, })

            // apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
            //     method: "POST",
            //     body: JSON.stringify({
            //         queue: queue,
            //     })
            // })
        } else if (session.status == "unauthenticated") {
            localStorage.setItem('queue', JSON.stringify(queue));
        }

    }, [queue, session, socket]);

    useEffect(() => {

        if (queueIndex == null) {
            return
        }
        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { queue_index: queueIndex })

            // apiFetch('https://api.music.rockhosting.org/api/user/set', session, {
            //     method: "POST",
            //     body: JSON.stringify({
            //         queue_index: queueIndex,
            //     })
            // })
        } else if (session.status == "unauthenticated") {
            localStorage.setItem('queueIndex', JSON.stringify(queueIndex));
        }
    }, [queueIndex, session, socket]);

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
            apiFetch("https://api.music.rockhosting.org/api/user/end-song", session, { method: "POST", body: JSON.stringify({ song_id: currentSong }) })

            if (queueIndex + 1 >= queue.length) {
                setCurrentSong(queue[0]);
                setQueueIndex(0);
                return;
            }
            setCurrentSong(queue[queueIndex + 1]);
            setQueueIndex(queueIndex + 1);
        }

    }, [audio, queue, queueIndex, session, currentSong])


    useEffect(() => {

        if (randomQueue == null) { return }

        if (session.status == "authenticated") {

            socket?.emit("set-user-data", { random_queue: randomQueue })
        } else if (session.status == "unauthenticated") {
            localStorage.setItem('randomQueue', JSON.stringify(randomQueue))
        }


    }, [randomQueue, session, socket])

    useEffect(() => {

        if (showLyrics == null) { return }

        if (session.status == "authenticated") {

            socket?.emit("set-user-data", { show_lyrics: showLyrics })
        } else if (session.status == "unauthenticated") {
            localStorage.setItem('showLyrics', JSON.stringify(showLyrics))
        }


    }, [showLyrics, session, socket])

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
    }, [audio, currentTime, queueIndex, queue, setCurrentSong, setQueueIndex, audio, currentTime])

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

            showLyrics,
            setShowLyrics,

            audioVolume,
            setAudioVolume,

            previousSong,
            nextSong,

            homeView,
            setHomeView,
        }}>
            {children}
        </MediaPlayerContext.Provider>
    );
};

export { MediaPlayerContext, AudioProvider };
