'use client';

import { MediaPlayerContext } from './audioContext';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
// import './globals.css'
import Slider from './slider';

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

    useEffect(() => {
        if (audioDuration == 0) {return}
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

        if (queueIndex >= queue.length -1) {
        
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
            <label className='block text-3xl ml-2 mt-2 mr-2 fade-out-neutral-400'>{currentSong.title}</label>
            <label className='block text-2xl fade-out-neutral-400 ml-2 mr-2 mb-2'>{currentSong.artist}</label>
            <Image priority="high" className='ml-auto mr-auto mt-auto mb-auto' alt="Current Song" src={`https://api.music.rockhosting.org/api/song/image/${currentSong.id == "" ? ("_"):(currentSong.id)}`} width={180} height={180} />

            <div className='absolute bottom-1'>
                <div className='grid items-center justify-items-center ml-auto mr-auto w-[120px]' style={{ gridTemplateColumns: '30px 60px 30px' }}>
                    <Image alt="Previous" className='invert-[0.7] cursor-pointer' src='https://api.music.rockhosting.org/images/previous.svg' width={30} height={30} onClick={handlePrevious}/>
                    {isPlaying ?
                        <Image alt="Puase" className='invert-[0.7] cursor-pointer' src='https://api.music.rockhosting.org/images/pause.svg' width={40} height={40} onClick={handlePause}/>
                        :
                        <Image alt="Play" className='invert-[0.7] cursor-pointer' src='https://api.music.rockhosting.org/images/play.svg' width={40} height={40} onClick={handlePlay}/>
                    }
                    <Image alt="Next" className='invert-[0.7] cursor-pointer' src='https://api.music.rockhosting.org/images/next.svg' width={30} height={30} onClick={handleNext}/>
                </div>

                <div className='grid gap-1 ml-2 mr-2 items-center justify-items-center' style={{ gridTemplateColumns: '50px 1fr 50px' }}>
                    <label>{getTime(currentTime)}</label>
                    <Slider value={sliderValue} onInput={sliderInput} onChange={sliderChange}></Slider>
                    <label>{getTime(audioDuration)}</label>
                </div>
            </div>
        </>
    )
}
