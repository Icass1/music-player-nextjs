
'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

import Slider from "./slider";
import { MediaPlayerContext } from './audioContext';
import { usePathname } from "next/navigation";

export default function Header({ handleSearch }) {

    const {
        audio,
        audioVolume,
        setAudioVolume,
    } = useContext(MediaPlayerContext);

    // const muted = false;

    const [audioMuted, setAudioMuted] = useState(false);
    const [volumeAnimationValue, setVolumeAnimationValue] = useState(audioMuted ? (0) : (30));
    const [volumeAnimationIsIncreasing, setVolumeAnimationIsIncreasing] = useState(audioMuted ? (false) : (true));
    const firstUpdate = useRef(0);
    const [lastVolume, setLastVolume] = useState(null);

    const session = useSession();

    const sliderChange = (event) => {
        audio.volume = event.target.value;
        setAudioVolume(event.target.value);
        setAudioMuted(false);
    };

    useEffect(() => {
        if (firstUpdate.current < 2) { // Number of variables [volumeAnimationIsIncreasing, volumeAnimationValue]
            firstUpdate.current += 1;
            return;
        }

        if (volumeAnimationIsIncreasing && volumeAnimationValue < 30) {
            const interval = setInterval(() => {
                setVolumeAnimationValue((prevValue) => prevValue + 1);
            }, 3);
            return () => clearInterval(interval);
        } else if (!volumeAnimationIsIncreasing && volumeAnimationValue > 0) {
            const interval = setInterval(() => {
                setVolumeAnimationValue((prevValue) => prevValue - 1);
            }, 3);
            return () => clearInterval(interval);
        }
    }, [volumeAnimationIsIncreasing, volumeAnimationValue]);

    useEffect(() => {

        if (audioMuted == false) {
            setVolumeAnimationIsIncreasing(true);
            if (lastVolume != null) {
                setAudioVolume(lastVolume);
                audio.volume = lastVolume;
                setLastVolume(null);
            }
        } else if (audioMuted == true) {
            setVolumeAnimationIsIncreasing(false);

            setLastVolume(audioVolume);
            setAudioVolume(0);
            audio.volume = 0;
        }

        console.log(audioMuted)

    }, [audioMuted])

    const toggleVolumeAnimation = () => {
        setVolumeAnimationIsIncreasing((prevState) => !prevState);
        setAudioMuted((prevState) => !prevState);
    };

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

    return (
        <div className="grid h-full items-center ml-5 mr-5 gap-4" style={{ gridTemplateColumns: '30px min-content 1fr 30px 30px 30px 150px min-content', gridTemplateRows: '60px' }}>
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
            <Image className="invert-[0.6] select-none hover:invert-[0.7]" src='https://api.music.rockhosting.org/images/random.svg' width={30} height={30} alt="Toggle random queue" />
            <div className="relative h-[30px] w-[30px]">
                <Image
                    className="absolute invert-[0.6] select-none cursor-pointer hover:invert-[0.7]"
                    src='https://api.music.rockhosting.org/images/volumeMuted.png'
                    width={30}
                    height={30}
                    alt=""
                    style={{ clipPath: `inset(0px ${volumeAnimationValue}px 0px 0px)` }}
                    onClick={toggleVolumeAnimation}
                />

                <Image
                    className="absolute invert-[0.6] select-none cursor-pointer hover:invert-[0.7]"
                    src='https://api.music.rockhosting.org/images/volume.svg'
                    width={30}
                    height={30}
                    alt=""
                    style={{ clipPath: `inset(0px 0px 0px ${30 - volumeAnimationValue}px)` }}
                    onClick={toggleVolumeAnimation}
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