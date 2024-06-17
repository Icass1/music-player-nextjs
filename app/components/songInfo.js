'use client';

import { MediaPlayerContext } from './audioContext';
import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
// import './globals.css'
import Slider from './slider';
import Equalizer from './equalizer';
import clsx from 'clsx';

import { FixedSizeList as List } from 'react-window';
import { startsWith } from 'lodash';

export default function SongInfo() {
    const {
        audio,
        getTime,
        currentSong,
        isPlaying,
        currentTime,
        audioDuration,
        queue,
        queueIndex,
        setCurrentSong,
        setQueueIndex,
        nextSong,
        previousSong,
    } = useContext(MediaPlayerContext);

    const [sliderValue, setSliderValue] = useState(0);
    const [showingEqualizer, setShowingEqualizer] = useState(false);
    const [innerWidth, setInnerWidth] = useState(0);

    const songDataRef = useRef();

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
                // audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex - 1].id}`;
                // audio.play();

                setCurrentSong(queue[queueIndex - 1]);
                setQueueIndex(queueIndex - 1);
            }
        }
    }

    const handleNext = () => {

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
    }

    useEffect(() => {

        const handleResize = () => {
            setInnerWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        setInnerWidth(window.innerWidth)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {

        if (!songDataRef.current) {return}
        

        songDataRef.current.addEventListener('touchstart', handleTouchStart);
        songDataRef.current.addEventListener('touchmove', handleTouchMove);

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

        return () => {
            if (!songDataRef.current) {return}

            songDataRef.current.removeEventListener('touchstart', handleTouchStart);
            songDataRef.current.removeEventListener('touchmove', handleTouchMove);
        }
    }, [queue, queueIndex, currentTime, songDataRef])








    // useEffect(() => {

    //     let xStartPos;
    //     let startScrollPos;
    //     const handleTouchStart = (event) => {
    //         let x = event.touches[0].clientX;

    //         xStartPos = x
    //         startScrollPos = songDataRef.current.scrollLeft

    //         songDataRef.current.style.scrollBehavior = "unset"
    //         console.log("handleTouchStart", { startScrollPos: startScrollPos })
    //     }

    //     const handleTouchMove = (event) => {

    //         console.log("handleTouchMove", { startScrollPos: startScrollPos })

    //         let x = event.touches[0].clientX;
    //         songDataRef.current.scrollTo(startScrollPos + xStartPos - x, 0)

    //     }
    //     const handleTouchEnd = (event) => {
    //         if (startScrollPos == undefined) {
    //             console.log("startscrollpos is not defined")
    //             return
    //         }
    //         songDataRef.current.style.scrollBehavior = ""

    //         console.log("handleTouchEnd", songDataRef.current.scrollLeft - songDataRef.current.offsetWidth, startScrollPos, startScrollPos + songDataRef.current.offsetWidth / 4)


    //         let index = Math.floor((songDataRef.current.scrollLeft + songDataRef.current.offsetWidth / 2) / songDataRef.current.offsetWidth)
    //         songDataRef.current.scrollTo(songDataRef.current.offsetWidth * index, 0)
    //         console.log(index)
    //         if (index == queueIndex) { return }


    //         audio.src = `https://api.music.rockhosting.org/api/song/${queue[index].id}`;
    //         audio.play();

    //         setCurrentSong(queue[index]);
    //         setQueueIndex(index);

    //         return

    //         if (Math.abs(songDataRef.current.scrollLeft - songDataRef.current.offsetWidth) > startScrollPos + songDataRef.current.offsetWidth / 4) {

    //             if (songDataRef.current.scrollLeft - songDataRef.current.offsetWidth > 0) {
    //                 songDataRef.current.scrollTo(songDataRef.current.offsetWidth * 2, 0)

    //                 // // nextSong()
    //                 // function func() {
    //                 //     console.log(songDataRef.current.offsetWidth * 2, songDataRef.current.scrollLeft)
    //                 //     if (songDataRef.current.scrollLeft == songDataRef.current.offsetWidth * 2) {
    //                 //         songDataRef.current.removeEventListener("scroll", func)
    //                 //         console.log("nextsong 2")
    //                 //         nextSong()
    //                 //     }
    //                 // }
    //                 // songDataRef.current.addEventListener("scroll", func)

    //                 console.log("nextsong 1")

    //             } else {
    //                 songDataRef.current.scrollTo(0, 0)

    //                 // function func() {
    //                 //     console.log(0, songDataRef.current.scrollLeft)
    //                 //     if (songDataRef.current.scrollLeft == 0) {
    //                 //         songDataRef.current.removeEventListener("scroll", func)
    //                 //         console.log("previousSong 2")
    //                 //         previousSong()
    //                 //     }
    //                 // }
    //                 // songDataRef.current.addEventListener("scroll", func)

    //                 console.log("previousSong 1")
    //             }
    //         } else {
    //             songDataRef.current.scrollTo(songDataRef.current.offsetWidth, 0)
    //         }
    //     }

    //     const handleTouchCancel = () => {
    //         songDataRef.current.style.scrollBehavior = ""
    //     }

    //     // console.log("1", songDataRef.current)

    //     songDataRef.current.addEventListener('touchstart', handleTouchStart);
    //     songDataRef.current.addEventListener('touchmove', handleTouchMove,);
    //     songDataRef.current.addEventListener('touchend', handleTouchEnd);
    //     songDataRef.current.addEventListener('touchcancel', handleTouchCancel);

    //     return () => {
    //         if (!songDataRef.current) {return}
    //         // console.log("2", songDataRef.current)
    //         songDataRef.current.removeEventListener('touchstart', handleTouchStart);
    //         songDataRef.current.removeEventListener('touchmove', handleTouchMove);
    //         songDataRef.current.removeEventListener('touchend', handleTouchEnd);
    //         songDataRef.current.removeEventListener('touchcancel', handleTouchCancel);
    //     }

    // }, [queue, queueIndex, currentTime, songDataRef])











    useEffect(() => {
        // songDataRef.current.style.scrollBehavior = "unset"
        songDataRef.current.scrollTo(songDataRef.current.offsetWidth*queueIndex, 0)
        // songDataRef.current.style.scrollBehavior = ""
    }, [queue, queueIndex, songDataRef])

    return (
        <>
            <Image
                priority="high"
                className=' md:block absolute top-1/2 md:left-1/2 -translate-y-1/2 md:-translate-x-1/2 h-auto md:h-full w-full md:w-auto max-w-none blur-sm opacity-60 brightness-50 select-none'
                alt="Current Song"
                sizes="100vw"
                src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`}
                width={0}
                height={0}
            />

            <div className='relative grid z-40 h-full w-full m-0 top-0 items-center justify-items-start md:justify-items-center ' style={{ gridTemplateColumns: '60px 1fr 60px', gridTemplateRows: `${innerWidth > 768 ? '80px' : '60px'} 1fr 40px 40px` }}>
                <div id="asdf" ref={songDataRef} className='w-full absolute  flex flex-row scroll-smooth overflow-hidden  row-start-1 row-end-2     col-start-2 col-end-3     md:row-start-1 md:row-end-2    md:col-start-1 md:col-end-4'>


                    {queue.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-full">
                            <label className='block text-xl md:text-3xl ml-2 mt-2 mr-2 fade-out-neutral-200 md:min-h-9 font-bold'>{item.title}</label>
                            <label className='block text-lg md:text-2xl fade-out-neutral-300 ml-2 mr-2 mb-2 md:min-h-8'>{item.artist}</label>
                        </div>
                    ))}

                    {/* <div className="flex-shrink-0 w-full">
                        <label className='block text-xl md:text-3xl ml-2 mt-2 mr-2 fade-out-neutral-200 md:min-h-9 font-bold'>{queue[queueIndex - 1]?.title}</label>
                        <label className='block text-lg md:text-2xl fade-out-neutral-300 ml-2 mr-2 mb-2 md:min-h-8'>{queue[queueIndex - 1]?.artist}</label>
                    </div>
                    <div className="flex-shrink-0 w-full">
                        <label className='block text-xl md:text-3xl ml-2 mt-2 mr-2 fade-out-neutral-200 md:min-h-9 font-bold'>{queue[queueIndex]?.title}</label>
                        <label className='block text-lg md:text-2xl fade-out-neutral-300 ml-2 mr-2 mb-2 md:min-h-8'>{queue[queueIndex]?.artist}</label>
                    </div>
                    <div className="flex-shrink-0 w-full">
                        <label className='block text-xl md:text-3xl ml-2 mt-2 mr-2 fade-out-neutral-200 md:min-h-9 font-bold'>{queue[queueIndex + 1]?.title}</label>
                        <label className='block text-lg md:text-2xl fade-out-neutral-300 ml-2 mr-2 mb-2 md:min-h-8'>{queue[queueIndex + 1]?.artist}</label>
                    </div> */}
                </div>

                <div className='realtive   row-start-1 row-end-2     col-start-1 col-end-2    md:row-start-2 md:row-end-3     md:col-start-1 md:col-end-4    p-1 md:p-0  h-full md:w-[180px] md:h-[180px] flex cursor-pointer' onClick={() => { setShowingEqualizer((prevState) => !prevState) }}>

                    <Image priority="high" className={clsx('realtive select-none h-full w-auto rounded-lg md:rounded-none', { "opacity-40": showingEqualizer })} alt="Current Song" src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`} width={180} height={180} />

                    {showingEqualizer ? (
                        <Equalizer bar_gap={0} bar_count={innerWidth > 768 ? 180 : 52} toggleCenter={false} centered={true} className='select-none w-[52px] h-[52px] absolute md:w-[180px] md:h-[180px]' />
                    ) : (
                        <></>
                    )}
                </div>

                <div className='bottom-1     row-start-1 row-end-2    col-start-3 col-end-4     md:row-start-3 md:row-end-4    md:col-start-1 md:col-end-4'>
                    <div className='grid items-center justify-items-center ml-auto mr-auto' style={{ gridTemplateColumns: innerWidth > 768 ? '30px 60px 30px' : '60px' }}>
                        <Image alt="Previous" className='hidden md:block invert-[0.8] hover:invert-[0.9] cursor-pointer' src='https://api.music.rockhosting.org/images/previous.svg' width={30} height={30} onClick={handlePrevious} />
                        {isPlaying ?
                            <Image alt="Puase" className='invert-[0.8] hover:invert-[0.9] cursor-pointer' src='https://api.music.rockhosting.org/images/pause.svg' width={40} height={40} onClick={handlePause} />
                            :
                            <Image alt="Play" className='invert-[0.8] hover:invert-[0.9] cursor-pointer' src='https://api.music.rockhosting.org/images/play.svg' width={40} height={40} onClick={handlePlay} />
                        }
                        <Image alt="Next" className='hidden md:block invert-[0.8] hover:invert-[0.9] cursor-pointer' src='https://api.music.rockhosting.org/images/next.svg' width={30} height={30} onClick={handleNext} />
                    </div>
                </div>

                <div className='hidden md:block    md:row-start-4 md:row-end-5   md:col-start-1 md:col-end-4'>
                    <div className='hidden md:grid relative gap-1 ml-2 mr-2 items-center justify-items-center' style={{ gridTemplateColumns: '50px 1fr 50px' }}>
                        <label>{getTime(currentTime)}</label>
                        <Slider value={sliderValue} onInput={sliderInput} onChange={sliderChange}></Slider>
                        <label>{getTime(audioDuration)}</label>
                    </div>
                </div>
            </div>
        </>
    )
}
