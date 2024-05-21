'use client';

import { MediaPlayerContext } from './audioContext';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
// import './globals.css'
import Slider from './slider';
import Equalizer from './equalizer';
import clsx from 'clsx';

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
    } = useContext(MediaPlayerContext);

    const [sliderValue, setSliderValue] = useState(0);
    const [showingEqualizer, setShowingEqualizer] = useState(false);
    const [innerWidth, setInnerWidth] = useState(0);

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
                audio.src = `https://api.music.rockhosting.org/api/song/${queue[queueIndex - 1].id}`;
                audio.play();

                setCurrentSong(queue[queueIndex - 1]);
                setQueueIndex(queueIndex - 1);
            }
        }
    }

    const handleNext = () => {

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
    }


    useEffect(() => {
        setInnerWidth(window.innerWidth)
    }, [])


    return (
        <>
            <Image
                priority="high"
                className='hidden md:block absolute left-1/2 -translate-x-1/2 h-full w-auto max-w-none blur-sm opacity-60 brightness-50 select-none'
                alt="Current Song"
                sizes="100vw"
                src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`}
                width={0}
                height={0}
            />

            <div className='relative grid md:flex md:flex-col z-40 h-full w-full m-0 top-0 items-center' style={{gridTemplateColumns: '60px 60px 1fr', gridTemplateRows: '100%'}}>
                <div className='md:w-full md:order-none order-3'>
                    <label className='block text-xl md:text-3xl ml-2 mt-2 mr-2 fade-out-neutral-200 md:min-h-9 font-bold'>{currentSong.title}</label>
                    <label className='block text-lg md:text-2xl fade-out-neutral-300 ml-2 mr-2 mb-2 md:min-h-8'>{currentSong.artist}</label>
                </div>
                <div className='realtive md:order-none order-1 h-full md:w-[180px] md:h-[180px] flex cursor-pointer' onClick={() => { setShowingEqualizer((prevState) => !prevState) }}>

                    <Image priority="high" className={clsx('realtive select-none h-full w-auto', { "opacity-40": showingEqualizer })} alt="Current Song" src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`} width={180} height={180} />

                    {showingEqualizer ? (
                        <Equalizer bar_gap={0} bar_count={innerWidth > 768 ? 180 : 60} toggleCenter={false} centered={true} className='select-none w-[60px] h-[60px] absolute md:w-[180px] md:h-[180px]' />
                    ) : (
                        <></>
                    )}
                </div>

                <div className='bottom-1 md:order-none order-2'>
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
                <div className='hidden md:block md:order-none'>
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
