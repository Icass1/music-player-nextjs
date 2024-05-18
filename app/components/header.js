
'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

import Slider from "./slider";
import { MediaPlayerContext } from './audioContext';
import { usePathname } from "next/navigation";
import Animation from "./animation";

export default function Header({ handleSearch }) {

    const {
        audio,
        audioVolume,
        setAudioVolume,
        randomQueue,
        setRandomQueue,
        queueIndex,
        queue,
        setQueue,
    } = useContext(MediaPlayerContext);

    const [muteAnimationValue, toggleMuteAnimation] = Animation(30, 0, 30, 1, 1);
    const [lastAudioVolume, setLastAudioVolume] = useState(null);
    const [muted, setMuted] = useState(false);


    const session = useSession();

    const sliderChange = (event) => {
        audio.volume = event.target.value;
        setAudioVolume(event.target.value);

        if (muted) {
            setMuted(false);
            toggleMuteAnimation();
        }
    };

    useEffect(() => {
        if (muteAnimationValue == 0) {
            if (!muted) {
                setLastAudioVolume(audio.volume);
                setMuted(true);
                audio.volume = 0;
            }
        } else if (muteAnimationValue == 30) {
            if (muted) {
                setMuted(false)
                if (lastAudioVolume) {
                    audio.volume = lastAudioVolume;
                }
            }
        }
    }, [audio, muteAnimationValue, lastAudioVolume, muted])

    let debounceTimer;
    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        // setSearchQuery(query);

        // Clear the previous timer to avoid multiple fetches
        clearTimeout(debounceTimer);

        // Set a new timer to call onSearch after 500ms (half a second)
        debounceTimer = setTimeout(() => {
            handleSearch(query);
        }, 1000);
    };

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
        <div className="grid h-full items-center ml-5 mr-5 gap-4" style={{ gridTemplateColumns: '30px 30px min-content 1fr 30px 30px 30px 150px min-content', gridTemplateRows: '60px' }}>
            <Link href="/">
                <Image className="invert-[0.8] hover:invert-[0.7] select-none" src='https://api.music.rockhosting.org/images/home.svg' width={30} height={30} alt="Search" />
            </Link>
            <Link href="/search">
                <Image className="invert-[0.8] hover:invert-[0.7] select-none" src='https://api.music.rockhosting.org/images/search.svg' width={30} height={30} alt="Search" />
            </Link>
            {usePathname() == "/search" ? (
                // <Input
                //     type="text"
                //     label='Type to search...'
                //     className="w-52 scale-75"
                //     size="sm"
                // />
                <input
                    placeholder="Type to search..."
                    className="border-solid border-neutral-300 bg-transparent border-b-1 focus:outline-none"
                    onInput={handleSearchInputChange}
                />
            ) : (
                <label>{/* Empty label to fill min-content */}</label>
            )

            }
            <label></label> {/* Empty label to fill 1fr */}
            {/* <Equalizer className='w-full max-h-full pt-1 pb-1'></Equalizer> */}
            <Image className="invert-[0.8] select-none hover:invert-[0.9]" src='https://api.music.rockhosting.org/images/lyrics.png' width={30} height={30} alt="Toggle lyrics" />
            <Image
                className="invert-[0.6] select-none hover:invert-[0.7] cursor-pointer"
                style={{ filter: randomQueue ? ('brightness(0) saturate(100%) invert(44%) sepia(91%) saturate(474%) hue-rotate(3deg) brightness(105%) contrast(97%)') : ('') }}
                src='https://api.music.rockhosting.org/images/random.svg'
                width={30}
                height={30}
                alt="Toggle random queue"
                onClick={toggleRandomQueue}
            />

            <div className="relative h-[30px] w-[30px]">
                <Image
                    className="absolute invert-[0.6] select-none cursor-pointer hover:invert-[0.7]"
                    src='https://api.music.rockhosting.org/images/volumeMuted.png'
                    width={30}
                    height={30}
                    priority={true}
                    alt=""
                    style={{ clipPath: `inset(0px ${muteAnimationValue}px 0px 0px)` }}
                    onClick={toggleMuteAnimation}
                />

                <Image
                    className="absolute invert-[0.6] select-none cursor-pointer hover:invert-[0.7]"
                    src='https://api.music.rockhosting.org/images/volume.svg'
                    width={30}
                    height={30}
                    alt=""
                    priority={true}
                    style={{ clipPath: `inset(0px 0px 0px ${30 - muteAnimationValue}px)` }}
                    onClick={toggleMuteAnimation}
                />

                {/* <div className="absolute h-[30px] w-[10px] left-[0px]" style={{backgroundColor: 'rgb(28 28 28)'}}></div> */}

                {/* <Image className="rounded-full invert-[0.6] select-none" src='https://api.music.rockhosting.org/images/volume.svg' width={30} height={30} alt=""/> */}
            </div>
            <Slider value={audioVolume} onChange={sliderChange}></Slider>
            {session.data ? (
                <div className="flex flex-row gap-2 w-max items-center">
                    <Image className="rounded-full" src={session?.data?.user?.image} width={40} height={40} alt="" />
                    <div>{session?.data?.user?.name}</div>
                    <button className="bg-neutral-700 pl-2 pr-2 rounded-lg hover:bg-red-600" onClick={() => signOut()}>Logout</button>
                </div>
            ) : (
                <Link className="bg-neutral-700 pl-2 pr-2 rounded-lg hover:bg-green-600" href='/login'>Login</Link>
            )}
        </div>
    )
}