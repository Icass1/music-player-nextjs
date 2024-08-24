'use client';

import { MediaPlayerContext } from './audioContext';
import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from './slider';
import Equalizer from './equalizer';
import clsx from 'clsx';
import Lyrics from './lyrics';
import useWindowWidth from '../hooks/useWindowWidth';

import SVG from '../utils/renderSVG';
import Queue from './queue';
import useColors from '../hooks/getColors';
import { apiFetch } from '../utils/apiFetch';
import { Link } from 'next-view-transitions';
import useWindowSize from '../hooks/useWindowSize';

const handleDownloadMP3 = (song) => {
    apiFetch(`/api/song/${song.id}`)
        .then(response => response.blob())
        .then(blob => {
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.href = url;
            link.download = `${song.title} - ${song.artist}.mp3`;  // Assign a meaningful filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Download failed:', error));
}

export default function SongInfo() {
    const {
        audio,
        getTime,
        currentSong,
        isPlaying,
        currentTime,
        audioDuration,
        queue,
        randomQueue,
        setRandomQueue,
        queueIndex,
        setCurrentSong,
        setQueueIndex,

        setQueue,
    } = useContext(MediaPlayerContext);

    const [sliderValue, setSliderValue] = useState(0);
    const [showingEqualizer, setShowingEqualizer] = useState(false);
    const innerWidth = useWindowWidth();
    const [topScrollBarValue, setTopScrollBarValue] = useState(1);


    const mobileSongViewScrollRef = useRef();
    const [showMobileSongView, setShowMobileSongView] = useState(false);
    const colors = useColors();

    const [showDesktopSongView, setShowDesktopSongView] = useState(false);

    useEffect(() => {
        if (audioDuration == 0) { return }
        setSliderValue(currentTime / audioDuration)
    }, [currentTime, audioDuration]);

    const sliderInput = (e) => {
        audio.currentTime = e.target.value * audioDuration;
    }

    const sliderChange = (event) => {
        setSliderValue(event.target.value);
    };

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

    useEffect(() => {

        if (innerWidth > 768) {
            return
        }
        const element = mobileSongViewScrollRef?.current

        const handleScrollEnd = (e) => {
            e?.target?.scrollTo(Math.round(e?.target?.scrollLeft / innerWidth) * innerWidth, 0)
        }

        element.scrollTo(topScrollBarValue * innerWidth, 0)

        mobileSongViewScrollRef?.current?.addEventListener("scrollend", handleScrollEnd)

        return () => {
            element.removeEventListener("scrollend", handleScrollEnd)
        }

    }, [mobileSongViewScrollRef, innerWidth])

    const handleViewScroll = (e) => {
        setTopScrollBarValue(e?.target?.scrollLeft / innerWidth * 100)
    }

    const toggleShowMobileSongView = () => {
        setShowMobileSongView(value => !value)
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
        <>
            {innerWidth > 768 ?
                <></>
                :
                <div
                    ref={mobileSongViewScrollRef}
                    className='fixed md:hidden flex flex-row bg-neutral-500 top-0 left-0 right-0 overflow-x-scroll bottom-[58px] z-10 scroll-smooth transition-all'
                    onClick={toggleShowMobileSongView}
                    onScroll={handleViewScroll}
                    style={{ clipPath: showMobileSongView ? `inset(0% 0px 0px 0px)` : `inset(100% 0px 0px 0px)` }}
                >
                    <Image
                        priority="high"
                        className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-auto md:w-auto max-w-none blur-lg opacity-60 brightness-[.2] select-none'
                        alt="Current Song"
                        sizes="100vw"
                        src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`}
                        width={0}
                        height={0}
                    />

                    <div className='fixed top-4 left-1/2 -translate-x-1/2 z-50'>
                        <div className='absolute bg-[#8b8b8b7c] rounded-full w-[80px] h-[40px]' style={{ left: `calc((100% - 240px)/3 + ${topScrollBarValue}/100*240px/3)` }}></div>

                        <div className='bg-[#8b8b8b7c] w-[240px] rounded-full ml-auto mr-auto grid items-center h-[40px]' style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                            <label className='text-center text-xs z-10' onClick={(e) => { e.stopPropagation(); e.target.parentNode.parentNode.parentNode.scrollTo(0, 0) }}>QUEUE</label>
                            <label className='text-center text-xs z-10' onClick={(e) => { e.stopPropagation(); e.target.parentNode.parentNode.parentNode.scrollTo(innerWidth, 0) }}>COVER</label>
                            <label className='text-center text-xs z-10' onClick={(e) => { e.stopPropagation(); e.target.parentNode.parentNode.parentNode.scrollTo(innerWidth * 2, 0) }}>LYRICS</label>
                        </div>
                    </div>

                    <div className='h-full flex-shrink-0 w-full relative overflow-x-hidden'>
                        <div className='absolute overflow-y-hidden h-full w-full z-10'>
                            <div className='absolute top-16 bottom-0 left-2 right-2 overflow-y-auto'>
                                <Queue />
                                <div
                                    className='h-[60px] left-1 right-1 bottom-3 overflow-hidden absolute rounded-lg'
                                    onTouchStart={(e) => { mobileSongViewScrollRef.current.style.overflowX = 'hidden' }}
                                    onTouchEnd={(e) => { mobileSongViewScrollRef.current.style.overflowX = '' }}
                                >
                                    <SongInfoMenu
                                        toggleShowMobileSongView={toggleShowMobileSongView}
                                        showingEqualizer={showingEqualizer}
                                        handlePrevious={handlePrevious}
                                        handleNext={handleNext}
                                        handlePause={handlePause}
                                        handlePlay={handlePlay}
                                        toggleRandomQueue={toggleRandomQueue}
                                        sliderValue={sliderValue}
                                        sliderInput={sliderInput}
                                        sliderChange={sliderChange}
                                        setShowingEqualizer={setShowingEqualizer}
                                        setShowDesktopSongView={setShowDesktopSongView}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' h-full flex-shrink-0 w-full relative overflow-x-hidden'>
                        <div className='relative grid max-w-full' style={{ gridTemplateRows: "2fr max-content 1fr max-content 60px 60px", height: 'calc(100% - 60px)' }}>

                            <label></label>

                            <div className='w-11/12 h-0 pb-[91.666667%] ml-auto mr-auto' onClick={(e) => { e.stopPropagation(); setShowingEqualizer((prevState) => !prevState) }}>

                                <div className='z-10 relative w-full h-0 pb-[100%] mb-[-100%]'>
                                    {showingEqualizer ? (
                                        <Equalizer bar_gap={0} bar_count={innerWidth > 768 ? 180 : 52} toggleCenter={false} centered={true} className='w-full h-full absolute' />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <Image
                                    priority="high"
                                    className={clsx('w-full rounded-xl transition-opacity', { 'opacity-70': showingEqualizer })}
                                    // className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-auto md:w-auto max-w-none blur-sm opacity-60 brightness-50 select-none'
                                    alt="Current Song"
                                    sizes='100%'
                                    src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`}
                                    width={0}
                                    height={0}
                                />

                            </div>

                            <label></label>

                            <div className='flex flex-col ml-4 mr-4 min-w-0'>
                                <label className='text-2xl fade-out-neutral-200 font-bold'>{currentSong.title}</label>
                                <label className='text-1xl fade-out-neutral-300 '>{currentSong.artist}</label>
                            </div>

                            <div
                                className='grid relative gap-1 ml-2 mr-2 items-center justify-items-center scroll-'
                                onTouchStart={(e) => { mobileSongViewScrollRef.current.style.overflowX = 'hidden' }}
                                onTouchEnd={(e) => { mobileSongViewScrollRef.current.style.overflowX = '' }}
                                style={{ gridTemplateColumns: '50px 1fr 50px' }}
                            >
                                <label className='text-neutral-300'>{getTime(currentTime)}</label>
                                <Slider value={sliderValue} onInput={sliderInput} onChange={sliderChange}></Slider>
                                <label className='text-neutral-300'>{getTime(audioDuration)}</label>
                            </div>
                            <div className='grid items-center justify-items-center ml-auto mr-auto gap-8' style={{ gridTemplateColumns: '30px max-content max-content max-content 30px' }}>
                                <SVG
                                    className="select-none cursor-pointer transition-all"
                                    color='rgb(204 204 204)'
                                    src='https://api.music.rockhosting.org/images/download.svg'
                                    width={30}
                                    height={30}
                                    title="Download MP3"
                                    onClick={(e) => { e.stopPropagation(); handleDownloadMP3(currentSong) }}
                                />
                                <SVG alt="Previous" color='rgb(204 204 204)' className='cursor-pointer' src='https://api.music.rockhosting.org/images/previous.svg' width={40} height={40} onClick={(e) => { e.stopPropagation(); handlePrevious() }} />

                                <div className='abg-[#9DE2B0] rounded-full'>
                                    {isPlaying ?
                                        <SVG alt="Puase" color='rgb(204 204 204)' className='cursor-pointer' src='https://api.music.rockhosting.org/images/pause.svg' width={60} height={60} onClick={(e) => { e.stopPropagation(); handlePause() }} />
                                        :
                                        <SVG alt="Play" color='rgb(204 204 204)' className='icursor-pointer' src='https://api.music.rockhosting.org/images/play.svg' width={60} height={60} onClick={(e) => { e.stopPropagation(); handlePlay() }} />
                                    }
                                </div>
                                <SVG alt="Next" color='rgb(204 204 204)' className='cursor-pointer' src='https://api.music.rockhosting.org/images/next.svg' width={40} height={40} onClick={(e) => { e.stopPropagation(); handleNext() }} />
                                <SVG
                                    className="select-none cursor-pointer transition-all"
                                    color={randomQueue ? `rgb(${colors.foreground1})` : 'rgb(204 204 204)'}
                                    src='https://api.music.rockhosting.org/images/random.svg'
                                    width={30}
                                    height={30}
                                    alt="Toggle random queue"
                                    onClick={toggleRandomQueue}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='h-full flex-shrink-0 w-full relative overflow-x-hidden'>
                        <div className='absolute overflow-y-hidden h-full w-full z-10'>
                            <div className='absolute top-16 bottom-0 w-full overflow-y-auto scroll-smooth'>
                                <Lyrics />
                            </div>
                            <div
                                className='absolute h-[60px] left-3 right-3 bottom-3 overflow-hidden rounded-lg bg-[#525151b6]'
                                onTouchStart={(e) => { mobileSongViewScrollRef.current.style.overflowX = 'hidden' }}
                                onTouchEnd={(e) => { mobileSongViewScrollRef.current.style.overflowX = '' }}
                            >
                                <SongInfoMenu
                                    toggleShowMobileSongView={toggleShowMobileSongView}
                                    showingEqualizer={showingEqualizer}
                                    handlePrevious={handlePrevious}
                                    handleNext={handleNext}
                                    handlePause={handlePause}
                                    handlePlay={handlePlay}
                                    toggleRandomQueue={toggleRandomQueue}
                                    sliderValue={sliderValue}
                                    sliderInput={sliderInput}
                                    sliderChange={sliderChange}
                                    setShowingEqualizer={setShowingEqualizer}
                                    setShowDesktopSongView={setShowDesktopSongView}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            <SongInfoMenu
                toggleShowMobileSongView={toggleShowMobileSongView}
                showingEqualizer={showingEqualizer}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handlePause={handlePause}
                handlePlay={handlePlay}
                toggleRandomQueue={toggleRandomQueue}
                sliderValue={sliderValue}
                sliderInput={sliderInput}
                sliderChange={sliderChange}
                setShowingEqualizer={setShowingEqualizer}
                setShowDesktopSongView={setShowDesktopSongView}
            />
            {showDesktopSongView ?
                <SongView
                    sliderValue={sliderValue}
                    sliderInput={sliderInput}
                    sliderChange={sliderChange}
                    setShowingEqualizer={setShowingEqualizer}
                    showingEqualizer={showingEqualizer}
                    toggleRandomQueue={toggleRandomQueue}
                    setShowDesktopSongView={setShowDesktopSongView}
                    handlePrevious={handlePrevious}
                    handleNext={handleNext}
                    handlePause={handlePause}
                    handlePlay={handlePlay}
                />
                :
                <></>
            }
        </>
    )
}


function SongView({
    setShowingEqualizer,
    showingEqualizer,
    setShowDesktopSongView,
    sliderValue,
    sliderInput,
    sliderChange,
    handlePrevious,
    handleNext,
    handlePause,
    handlePlay,
    toggleRandomQueue,
}) {

    const { currentSong, queue, queueIndex, getTime, currentTime, audioDuration, isPlaying, randomQueue } = useContext(MediaPlayerContext)
    const [innerWidth, innerHeight] = useWindowSize();
    const songDataRef = useRef();
    const coverRef = useRef();
    const backgroundCoverRef = useRef();
    const colors = useColors();

    useEffect(() => {

        console.log(innerHeight, innerWidth)

        let maxHeight = innerHeight - 400;
        let maxWidth = innerWidth - 200;

        if (coverRef.current) {
            coverRef.current.style.height = Math.min(maxHeight, maxWidth) + 'px'
            coverRef.current.style.width = Math.min(maxHeight, maxWidth) + 'px'
        }

        if (backgroundCoverRef.current) {
            backgroundCoverRef.current.style.height = Math.max(innerHeight, innerWidth) + 'px'
            backgroundCoverRef.current.style.width = Math.max(innerHeight, innerWidth) + 'px'
        }
        songDataRef.current.scrollTo(coverRef.current.style.width * queueIndex, 0)

    }, [coverRef, backgroundCoverRef, queue, queueIndex, songDataRef, innerWidth, innerHeight])


    return (
        <div className='hidden md:block bg-neutral-800 z-50 fixed top-[75px] left-2 right-2 bottom-2 rounded-md overflow-hidden'>

            <Image
                ref={backgroundCoverRef}
                priority="high"
                className='md:block absolute top-1/2 md:left-1/2 -translate-y-1/2 md:-translate-x-1/2 blur-xl opacity-60 brightness-50 select-none'
                alt="Current Song"
                sizes="100vw"
                src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`}
                width={0}
                height={0}
            />

            <SVG
                className="select-none cursor-pointer transition-all absolute"
                color='rgb(204 204 204)'
                src='https://api.music.rockhosting.org/images/back.svg'
                width={40}
                height={40}
                alt="Toggle random queue"
                onClick={() => { setShowDesktopSongView(false) }}
            />

            <div style={{ width: coverRef?.current?.style?.width ? coverRef.current.style.width : '50%' }} className='left-1/2 -translate-x-1/2 block absolute top-1/2 -translate-y-1/2'>

                <div ref={coverRef} className='ml-auto mr-auto relative' onClick={(e) => { e.stopPropagation(); setShowingEqualizer((prevState) => !prevState) }}>

                    <div className='z-10 relative w-full h-0 pb-[100%] mb-[-100%]'>
                        {showingEqualizer ? (
                            <Equalizer bar_gap={0} bar_count={innerWidth > 768 ? 180 : 52} toggleCenter={false} centered={true} className='w-full h-full absolute' />
                        ) : (
                            <></>
                        )}
                    </div>
                    <Image
                        priority="high"
                        className={clsx('w-full rounded-xl transition-opacity', { 'opacity-70': showingEqualizer })}
                        // className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-auto md:w-auto max-w-none blur-sm opacity-60 brightness-50 select-none'
                        alt="Current Song"
                        sizes='100%'
                        src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`}
                        width={0}
                        height={0}
                    />
                </div>

                <div ref={songDataRef} className='flex flex-row scroll-smooth overflow-hidden relative'>
                    {queue.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-full">
                            <label className='text-lg md:text-3xl flex flex-row ml-2 mt-1 md:mt-2 mr-2 items-center gap-2 h-6 md:h-auto md:min-h-9 font-bold md:w-[calc(100%_-_35px)] fade-out-neutral-200'>{item.title}</label>
                            <label className='block text-base md:text-2xl fade-out-neutral-300 ml-2 mr-2 mb-2 md:min-h-8'>{item.artist}</label>
                        </div>
                    ))}
                </div>

                <div className='hidden md:grid relative gap-1 items-center justify-items-center' style={{ gridTemplateColumns: '40px 1fr 40px' }}>
                    <label className='text-sm'>{getTime(currentTime)}</label>
                    <Slider value={sliderValue} onInput={sliderInput} onChange={sliderChange}></Slider>
                    <label className='text-sm'>{getTime(audioDuration)}</label>
                </div>

                <div className='grid items-center justify-items-center ml-auto mr-auto w-min' style={{ gridTemplateColumns: innerWidth > 768 ? '60px 60px 60px 60px 60px' : '60px' }}>
                    <SVG
                        className="hidden md:block select-none cursor-pointer transition-all hover:brightness-110"
                        color='rgb(204 204 204)'
                        src='https://api.music.rockhosting.org/images/download.svg'
                        width={30}
                        height={30}
                        title="Download MP3"
                        onClick={() => { handleDownloadMP3(currentSong) }}
                    />
                    <SVG color='rgb(204, 204, 204)' className='hidden md:block cursor-pointer hover:brightness-110' src='https://api.music.rockhosting.org/images/previous.svg' width={40} height={40} onClick={handlePrevious} />
                    {isPlaying ?
                        <SVG color='rgb(204, 204, 204)' className='md:block cursor-pointer hover:brightness-110' src='https://api.music.rockhosting.org/images/pause.svg' width={55} height={55} onClick={(e) => { e.stopPropagation(); handlePause() }} />
                        :
                        <SVG color='rgb(204, 204, 204)' className='md:block cursor-pointer hover:brightness-110' src='https://api.music.rockhosting.org/images/play.svg' width={55} height={55} onClick={(e) => { e.stopPropagation(); handlePlay() }} />
                    }
                    <SVG color='rgb(204, 204, 204)' className='hidden md:block cursor-pointer hover:brightness-110' src='https://api.music.rockhosting.org/images/next.svg' width={40} height={40} onClick={handleNext} />
                    <SVG
                        className="hidden md:block select-none cursor-pointer transition-all hover:brightness-110"
                        color={randomQueue ? `rgb(${colors.foreground1})` : 'rgb(204 204 204)'}
                        src='https://api.music.rockhosting.org/images/random.svg'
                        width={30}
                        height={30}
                        title="Toggle random queue"
                        onClick={toggleRandomQueue}
                    />
                </div>
            </div>
        </div>
    )
}



function SongInfoMenu({
    toggleShowMobileSongView,
    showingEqualizer,
    handlePrevious,
    handleNext,
    handlePause,
    handlePlay,
    toggleRandomQueue,
    sliderValue,
    sliderInput,
    sliderChange,
    setShowingEqualizer,
    setShowDesktopSongView
}) {

    const {
        nextSong,
        previousSong,
        getTime,
        currentSong,
        isPlaying,
        currentTime,
        audioDuration,
        queue,
        randomQueue,
        queueIndex
    } = useContext(MediaPlayerContext);

    const songDataRef = useRef();
    const colors = useColors();
    const [innerWidth, innerHeight] = useWindowSize();

    useEffect(() => {
        songDataRef.current.scrollTo(songDataRef.current.offsetWidth * queueIndex, 0)
    }, [queue, queueIndex, songDataRef, innerWidth])

    useEffect(() => {

        if (!songDataRef.current) { return }

        songDataRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
        songDataRef.current.addEventListener('touchmove', handleTouchMove, { passive: true });

        var xDown = null;
        var yDown = null;

        function getTouches(evt) {
            // console.log("getTouches", evt)
            return evt.touches ||             // browser API
                evt.originalEvent.touches; // jQuery
        }

        function handleTouchStart(evt) {
            // console.log("handleTouchStart", evt)
            const firstTouch = getTouches(evt)[0];
            xDown = firstTouch.clientX;
            yDown = firstTouch.clientY;
        };

        function handleTouchMove(evt) {
            // console.log("handleTouchMove", evt)
            if (!xDown || !yDown) {
                return;
            }
            console.log("A")

            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;

            var xDiff = xDown - xUp;
            var yDiff = yDown - yUp;

            // console.log(xDiff, yDiff)

            if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
                if (xDiff > 0) {
                    console.log("right")
                    nextSong()
                } else {
                    previousSong()
                    console.log("left")
                }
            } else {
                if (yDiff > 0) {
                    console.log("down")
                } else {
                    console.log("up")
                }
            }
            xDown = null;
            yDown = null;
        };

        const element = songDataRef.current

        return () => {

            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
        }
    }, [queue, queueIndex, currentTime, songDataRef, nextSong, previousSong])

    return (
        <>
            <Image
                priority="high"
                className=' md:block absolute top-1/2 md:left-1/2 -translate-y-1/2 md:-translate-x-1/2 h-auto md:h-full w-full md:w-auto max-w-none blur-xl opacity-60 brightness-50 select-none'
                alt="Current Song"
                sizes="100vw"
                src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`}
                width={0}
                height={0}
            />

            <div
                className='relative grid h-full w-full m-0 top-0 items-center justify-items-start md:justify-items-center'
                style={{ gridTemplateColumns: '60px 1fr 60px', gridTemplateRows: `${innerWidth > 768 ? '80px' : '60px'} 1fr 40px 40px` }}
                onClick={toggleShowMobileSongView}
            >
                <div className='hidden md:block w-5 h-5 absolute z-50 right-2 top-4'>
                    <SVG
                        color='rgb(204, 204, 204)'
                        className='cursor-pointer hover:brightness-110'
                        src='https://api.music.rockhosting.org/images/expand.svg'
                        width={20}
                        height={20}
                        onClick={() => { setShowDesktopSongView(true) }}
                    />
                </div>

                <div ref={songDataRef} className='w-full absolute  flex flex-row scroll-smooth overflow-hidden  row-start-1 row-end-2     col-start-2 col-end-3     md:row-start-1 md:row-end-2    md:col-start-1 md:col-end-4'>
                    {queue.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-full">
                            <label className='text-lg md:text-3xl flex flex-row ml-2 mt-1 md:mt-2 mr-2 items-center gap-2 h-6 md:h-auto md:min-h-9 font-bold md:w-[calc(100%_-_35px)] fade-out-neutral-200'>{item.title}</label>
                            <label className='block text-base md:text-2xl fade-out-neutral-300 ml-2 mr-2 mb-2 md:min-h-8'>{item.artist}</label>
                        </div>
                    ))}
                </div>

                <div className='realtive   row-start-1 row-end-2     col-start-1 col-end-2    md:row-start-2 md:row-end-3     md:col-start-1 md:col-end-4    p-1 md:p-0  h-full md:w-[180px] md:h-[180px] flex cursor-pointer' onClick={(e) => { e.stopPropagation(); setShowingEqualizer((prevState) => !prevState) }}>

                    <Image priority="high" className={clsx('realtive select-none h-full w-auto rounded-lg md:rounded-none transition-opacity', { "opacity-70": showingEqualizer })} alt="Current Song" src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`} width={180} height={180} />

                    {showingEqualizer ? (
                        <Equalizer bar_gap={0} bar_count={innerWidth > 768 ? 180 : 52} toggleCenter={false} centered={true} className='select-none w-[52px] h-[52px] absolute md:w-[180px] md:h-[180px]' />
                    ) : (
                        <></>
                    )}
                </div>

                <div className='bottom-1     row-start-1 row-end-2    col-start-3 col-end-4     md:row-start-3 md:row-end-4    md:col-start-1 md:col-end-4'>
                    <div className='grid items-center justify-items-center ml-auto mr-auto' style={{ gridTemplateColumns: innerWidth > 768 ? '60px 30px 60px 30px 60px' : '60px' }}>
                        <SVG
                            className="hidden md:block select-none cursor-pointer transition-all hover:brightness-110"
                            color='rgb(204 204 204)'
                            src='https://api.music.rockhosting.org/images/download.svg'
                            width={25}
                            height={25}
                            title="Download MP3"
                            onClick={() => { handleDownloadMP3(currentSong) }}
                        />
                        <SVG color='rgb(204, 204, 204)' className='hidden md:block cursor-pointer hover:brightness-110' src='https://api.music.rockhosting.org/images/previous.svg' width={30} height={30} onClick={handlePrevious} />
                        {isPlaying ?
                            <SVG color='rgb(204, 204, 204)' className='md:block cursor-pointer hover:brightness-110' src='https://api.music.rockhosting.org/images/pause.svg' width={40} height={40} onClick={(e) => { e.stopPropagation(); handlePause() }} />
                            :
                            <SVG color='rgb(204, 204, 204)' className='md:block cursor-pointer hover:brightness-110' src='https://api.music.rockhosting.org/images/play.svg' width={40} height={40} onClick={(e) => { e.stopPropagation(); handlePlay() }} />
                        }
                        <SVG color='rgb(204, 204, 204)' className='hidden md:block cursor-pointer hover:brightness-110' src='https://api.music.rockhosting.org/images/next.svg' width={30} height={30} onClick={handleNext} />
                        <SVG
                            className="hidden md:block select-none cursor-pointer transition-all hover:brightness-110"
                            color={randomQueue ? `rgb(${colors.foreground1})` : 'rgb(204 204 204)'}
                            src='https://api.music.rockhosting.org/images/random.svg'
                            width={25}
                            height={25}
                            title="Toggle random queue"
                            onClick={toggleRandomQueue}
                        />
                    </div>
                </div>

                <div className='hidden md:block    md:row-start-4 md:row-end-5   md:col-start-1 md:col-end-4'>
                    <div className='hidden md:grid relative gap-1 ml-2 mr-2 items-center justify-items-center' style={{ gridTemplateColumns: '40px 1fr 40px' }}>
                        <label className='text-sm'>{getTime(currentTime)}</label>
                        <Slider value={sliderValue} onInput={sliderInput} onChange={sliderChange}></Slider>
                        <label className='text-sm'>{getTime(audioDuration)}</label>
                    </div>
                </div>
            </div>
            <div className='block md:hidden absolute h-1 left-0 bottom-0 bg-neutral-200 ' style={{ right: (currentTime == null ? 100 : 100 - 100 * currentTime / audioDuration) + "%" }}></div>
        </>
    )
}