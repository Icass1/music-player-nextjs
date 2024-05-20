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

    return (
        <>
            <Image
                priority="high"
                className='absolute left-1/2 -translate-x-1/2 h-full w-auto max-w-none blur-sm opacity-60 brightness-50'
                alt="Current Song"
                sizes="100vw"
                src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`}
                width={0}
                height={0}
            />

            <div className='absolute z-40 h-full w-full m-0 top-0'>
                <label className='block text-3xl ml-2 mt-2 mr-2 fade-out-neutral-200 min-h-9 font-bold'>{currentSong.title}</label>
                <label className='block text-2xl fade-out-neutral-300 ml-2 mr-2 mb-2 min-h-8'>{currentSong.artist}</label>
                <div className='m-auto w-[180px] cursor-pointer' onClick={() => { setShowingEqualizer((prevState) => !prevState) }}>

                    <Image priority="high" className={clsx('absolute select-none', { "opacity-40": showingEqualizer })} alt="Current Song" src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_") : (currentSong.id)}`} width={180} height={180} />

                    {showingEqualizer ? (
                        <Equalizer bar_gap={0} bar_count={180} toggleCenter={false} centered={true} className='absolute w-[180px] h-[180px]' />
                    ) : (
                        <></>
                    )}
                </div>

                <div className='absolute bottom-1'>
                    <div className='grid items-center justify-items-center ml-auto mr-auto w-[120px]' style={{ gridTemplateColumns: '30px 60px 30px' }}>
                        <Image alt="Previous" className='invert-[0.8] hover:invert-[0.9] cursor-pointer' src='https://api.music.rockhosting.org/images/previous.svg' width={30} height={30} onClick={handlePrevious} />
                        {isPlaying ?
                            <Image alt="Puase" className='invert-[0.8] hover:invert-[0.9] cursor-pointer' src='https://api.music.rockhosting.org/images/pause.svg' width={40} height={40} onClick={handlePause} />
                            :
                            <Image alt="Play" className='invert-[0.8] hover:invert-[0.9] cursor-pointer' src='https://api.music.rockhosting.org/images/play.svg' width={40} height={40} onClick={handlePlay} />
                        }
                        <Image alt="Next" className='invert-[0.8] hover:invert-[0.9] cursor-pointer' src='https://api.music.rockhosting.org/images/next.svg' width={30} height={30} onClick={handleNext} />
                    </div>

                    <div className='grid gap-1 ml-2 mr-2 items-center justify-items-center' style={{ gridTemplateColumns: '50px 1fr 50px' }}>
                        <label>{getTime(currentTime)}</label>
                        <Slider value={sliderValue} onInput={sliderInput} onChange={sliderChange}></Slider>
                        <label>{getTime(audioDuration)}</label>
                    </div>
                </div>
            </div>
        </>
    )
}
