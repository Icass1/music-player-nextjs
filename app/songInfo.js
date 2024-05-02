'use client';

import { AudioContext } from '@/app/audioContext';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';

import './globals.css'

export default function SongInfo() {
    const {
        audio,
        getTime,
        currentSong,
        isPlaying,
        currentTime,
        setCurrentTime,
        audioDuration,
    } = useContext(AudioContext);

    // const [sliderPos, setSliderPos] = useState(0);
    const [mouseOver, setMouseOver] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    useEffect(() => {
        setSliderValue(currentTime / audioDuration)
    }, [currentTime, audioDuration]);

    const sliderInput = (e) => {
        audio.currentTime = e.target.value * audioDuration;
    }

    const sliderMouseEnter = () => {
        setMouseOver(true)
    }
    const sliderMouseLeave = () => {
        setMouseOver(false)
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

    return (
        <>
            <label className='block text-3xl w-full ml-2 mt-2 mr-2 fade-out-neutral-400'>{currentSong.title}</label>
            <label className='block text-2xl text-neutral-500 truncate w-full ml-2 mr-2 mb-2'>{currentSong.artist}</label>
            <Image priority="high" className='ml-auto mr-auto mt-auto mb-auto' alt="Current Song" src={`https://music.rockhosting.org/api/song/image/${currentSong.id}`} width={180} height={180} />

            <div className='absolute bottom-1'>
                <div className='grid items-center justify-items-center ml-auto mr-auto w-[120px]' style={{ gridTemplateColumns: '30px 60px 30px' }}>
                    <Image alt="Previous" className='invert-[0.7] cursor-pointer' src='https://music.rockhosting.org/images/previous.svg' width={30} height={30} />
                    {isPlaying ?
                        <Image alt="Puase" className='invert-[0.7] cursor-pointer' src='https://music.rockhosting.org/images/pause.svg' width={40} height={40} onClick={handlePause} />
                        :
                        <Image alt="Play" className='invert-[0.7] cursor-pointer' src='https://music.rockhosting.org/images/play.svg' width={40} height={40} onClick={handlePlay} />
                    }
                    <Image alt="Next" className='invert-[0.7] cursor-pointer' src='https://music.rockhosting.org/images/next.svg' width={30} height={30} />
                </div>

                <div className='grid gap-1 ml-2 mr-2 items-center justify-items-center' style={{ gridTemplateColumns: '50px 1fr 50px' }}>
                    <label>{getTime(currentTime)}</label>
                    <input
                        {...mouseOver && { mouseOver: '' }}
                        id='current-time-slider'
                        type='range'
                        className='min-w-0 w-full h-[0.4rem] rounded-full appearance-none'
                        {...(mouseOver ? {
                            style: { background: `linear-gradient(90deg, #ca8a04 0%, #ca8a04 calc(${sliderValue * 100}%), black calc(${sliderValue * 100}%), black 100%)` }
                        } : {
                            style: { background: `linear-gradient(90deg, rgb(150, 150, 150) 0%, rgb(150, 150, 150) calc(${sliderValue * 100}%), black calc(${sliderValue * 100}%), black 100%)` }
                        })}
                        min='0'
                        max='1'
                        value={sliderValue}
                        step='0.005'
                        onInput={sliderInput}
                        onMouseEnter={sliderMouseEnter}
                        onMouseLeave={sliderMouseLeave}
                        onChange={sliderChange}
                    />
                    <label>{getTime(audioDuration)}</label>
                </div>
            </div>
        </>
    )
}
