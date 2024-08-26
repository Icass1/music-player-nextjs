'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
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
    const [homeView, setHomeView] = useState({ view: null, numberOfViews: 3 });

    const audioCacheRef = useRef();

    // useEffect(() => {

    //     if (session.status == "loading") {
    //         return
    //     }

    //     if (session.status == "authenticated") {
    //         if (session.data.user.dev_user) {
    //             return
    //         }
    //     }


    //     // Disable logging
    //     console.info("console.log disabled")
    //     console.log = () => {}

    // }, [session])

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

                apiFetch(`/api/song/info/${session.data.user.current_song}`).
                    then(response => response.json()).
                    then(data => {
                        setCurrentSong(data);
                    })
            }


            setHomeView((value) => {
                let newValue = { ...value }; // Create a new copy of the state
                newValue.view = session.data.user.view_layout_index;
                return newValue;
            });

            setCurrentList(session.data.user.current_list);

            setQueue(JSON.parse(session.data.user.queue));
            setQueueIndex(session.data.user.queue_index);
            setRandomQueue(session.data.user.random_queue);
            audio.currentTime = session.data.user.current_time;
            audio.volume = session.data.user.volume**2;
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

    }, [session, audio, randomQueue]);

    useEffect(() => {

        if (currentSong.title == '' && currentSong.artist == '') {
            document.title = "RockIt"
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { current_song: currentSong.id })
        } else if (session.status == "unauthenticated") {
            localStorage.setItem('currentSong', JSON.stringify(currentSong));
        }

        document.title = currentSong.title + " - " + currentSong.artist
        if (audio.src == `https://api.music.rockhosting.org/api/song/${currentSong.id}` || audio.id == currentSong.id) {
        } else if (audio.src == "") {
            let currentTime = audio.currentTime
            if (audioCacheRef.current?.id == currentSong.id) {
                // console.log("Loading cached audio 1 ")
                audio.src = URL.createObjectURL(audioCacheRef.current?.blob);
                audio.id = currentSong.id
                audio.load()
            } else {
                // console.log("Loading remote audio 1")
                audio.src = `https://api.music.rockhosting.org/api/song/${currentSong.id}`;
                audio.id = currentSong.id
            }
            audio.currentTime = currentTime
        } else {
            if (audioCacheRef.current?.id == currentSong.id) {
                // console.log("Loading cached audio 2")
                audio.src = URL.createObjectURL(audioCacheRef.current?.blob);
                audio.id = currentSong.id
                audio.load()
            } else {
                // console.log("Loading remote audio 2")
                audio.src = `https://api.music.rockhosting.org/api/song/${currentSong.id}`;
                audio.id = currentSong.id
            }
            audio.onload = () => { console.log("audio loaded") }

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

        const song = queue[queueIndex + 1]

        if (!song) { return }

        const controller = new AbortController()
        const signal = controller.signal

        console.log("Caching", song.title, "-", song.artist, song.id)
        apiFetch(`/api/song/${song.id}`, { signal: signal }).then(data => data.blob()).then(blob => {
            console.log("Cached")
            console.log(blob)
            audioCacheRef.current = { id: song.id, blob: blob }
        })
        return () => {
            controller.abort();
            console.log("cleanup", song.title, song.artist)
        }
    }, [queue, queueIndex])


    useEffect(() => {
        if (currentList == '') {
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { current_list: currentList })

        } else if (session.status == "unauthenticated") {
            localStorage.setItem('currentList', JSON.stringify(currentList));
        }

    }, [currentList, session, socket]);

    useEffect(() => {
        if (homeView.view == null) {
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { view_layout_index: homeView.view })
        }
    }, [homeView, session, socket])

    useEffect(() => {
        if (currentList == '') {
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { volume: audioVolume })

        } else if (session.status == "unauthenticated") {
            localStorage.setItem('volume', JSON.stringify(audioVolume));
        }

    }, [audioVolume, session, currentList, socket]);

    useEffect(() => {
        if (currentTime == "null" || currentTime == null) {
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { current_time: currentTime, })

        } else if (session.status == "unauthenticated") {
            localStorage.setItem('currentTime', JSON.stringify(currentTime));
        }
    }, [currentTime, session, socket]);

    useEffect(() => {
        if (queue == null || queue.length == 0) {
            return
        }

        if (session.status == "authenticated") {
            socket?.emit("set-user-data", { queue: JSON.stringify(queue) })

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


        } else if (session.status == "unauthenticated") {
            localStorage.setItem('queueIndex', JSON.stringify(queueIndex));
        }
    }, [queueIndex, session, socket]);

    useEffect(() => {
        if (!(audio instanceof HTMLAudioElement)) { return }

        audio.volume = 1;
        audio.crossOrigin = "anonymous"


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

                    setCurrentSong(queue[queueIndex - 1]);
                    setQueueIndex(queueIndex - 1);
                }
            }
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {

            if (queueIndex >= queue.length - 1) {

                setCurrentSong(queue[0]);
                setQueueIndex(0);

            } else {

                setCurrentSong(queue[queueIndex + 1]);
                setQueueIndex(queueIndex + 1);
            }
        });

    }, [audio, currentSong, currentTime, queue, queueIndex])

    useEffect(() => {
        if (!(audio instanceof HTMLAudioElement)) { return }

        audio.onended = function () {
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



    const previousSong = useCallback(() => {
        if (currentTime > 5) {
            audio.currentTime = 0;
        } else {
            if (queueIndex <= 0) {
                return
            }
            else {

                setCurrentSong(queue[queueIndex - 1]);
                setQueueIndex(queueIndex - 1);
            }
        }
    }, [audio, currentTime, queueIndex, queue, setCurrentSong, setQueueIndex])

    const nextSong = useCallback(() => {
        if (queueIndex >= queue.length - 1) {


            setCurrentSong(queue[0]);
            setQueueIndex(0);

        } else {

            setCurrentSong(queue[queueIndex + 1]);
            setQueueIndex(queueIndex + 1);
        }
    }, [audio, currentTime, queueIndex, queue, setCurrentSong, setQueueIndex, audio, currentTime])


    const handlePause = () => {
        audio.pause()
    }

    const handlePlay = () => {
        audio.play()
    }

    const handlePrevious = () => {
        if (currentTime > 5) {
            audio.currentTime = 0;
        } else {
            if (queueIndex <= 0) {
                return
            }
            else {

                setCurrentSong(queue[queueIndex - 1]);
                setQueueIndex(queueIndex - 1);
            }
        }
    }

    const handleNext = () => {

        if (queueIndex >= queue.length - 1) {

            setCurrentSong(queue[0]);
            setQueueIndex(0);

        } else {

            setCurrentSong(queue[queueIndex + 1]);
            setQueueIndex(queueIndex + 1);
        }
    }

    const handlePlayList = (id, startSong) => {

        if (currentList == id) {

            if (startSong) {


                apiFetch(`/api/list/${id}`)
                    .then(response => response.json())
                    .then(musicData => {

                        let _songsList = [...musicData.songs].filter(song => { if (song.in_database == false) { return false } else { return true } });

                        let song = _songsList.filter(tempSong => tempSong.id == startSong)[0]

                        console.log(song)
        
                        let index = _songsList.indexOf(song)
                        console.log(index)
                        let list = _songsList.slice(index + 1).concat(_songsList.slice(0, index))
                        console.log(list)
        
                        if (randomQueue) {
                            list.sort(() => Math.random() - 0.5)
                        }
        
                        setQueue([song].concat(list));
                        setQueueIndex(0);
                        setCurrentSong(song);

                    })


            }

            handlePlay();
        } else {
            apiFetch(`/api/list/${id}`)
                .then(response => response.json())
                .then(musicData => {

                    let _list = [...musicData.songs].filter(song => { if (song.in_database == false) { return false } else { return true } });

                    if (_list.length == 0) {
                        return;
                    }

                    if (randomQueue) {
                        _list.sort(() => Math.random() - 0.5);
                    }

                    setQueue(_list);
                    setQueueIndex(0);
                    setCurrentSong(_list[0]);
                    setCurrentList(id);
                    audio.play();
                })
        }
    }

    const toggleRandomQueue = () => {

        if (randomQueue) {
            setRandomQueue(false)
        } else {
            setRandomQueue(true)
            let newQueue = queue.slice(queueIndex + 1)
            newQueue.sort(() => Math.random() - 0.5)
            setQueue(queue.slice(0, queueIndex + 1).concat(newQueue))
        }
    }


    return (
        <MediaPlayerContext.Provider value={{

            audio,
            analyser,

            handlePlay,
            handlePause,
            handleNext,
            handlePrevious,
            handlePlayList,

            toggleRandomQueue,

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
