
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
    const [innerWidth, setInnerWidth] = useState(0);

    const [storage, setStorage] = useState(0);

    const session = useSession();

    const searchInputRef = useRef();

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

    let debounceTimer;
    const handleSearchInputChange = (e) => {
        const query = e.target.value;

        window.history.replaceState({}, "RockIT", `/search?q=${query}`);

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

    useEffect(() => {

        if (location.pathname != "/search") {
            return;
        }

        let params = new URL(document.location).searchParams;
        handleSearch(params.get("q"));
        searchInputRef.current.value = params.get("q");
    }, [])


    // useEffect(() => {

    //     navigator.storage.estimate().then(data => {
    //         console.log(data)
    //     })

    // }, [])


    return (
        <div className="grid h-full items-center ml-auto mr-auto w-min md:w-auto md:ml-5 md:mr-5 gap-10 md:gap-4" style={{ gridTemplateColumns: innerWidth > 768 ? '30px 30px min-content 1fr 30px 30px 30px 150px min-content' : '30px 30px 30px', gridTemplateRows: '100%' }}>
            <Link href="/">
                <Image className="md:block invert-[0.8] hover:invert-[0.7] select-none" src='https://api.music.rockhosting.org/images/home.svg' width={30} height={30} alt="Search" />
            </Link>
            <Link href="/search">
                <Image className="md:block invert-[0.8] hover:invert-[0.7] select-none" src='https://api.music.rockhosting.org/images/search.svg' width={30} height={30} alt="Search" />
            </Link>
            {usePathname() == "/search" ? (
                <input
                    ref={searchInputRef}
                    placeholder="Type to search..."
                    className="hidden md:block border-solid border-neutral-300 bg-transparent border-b focus:outline-none"
                    onInput={handleSearchInputChange}
                />
            ) : (
                <label className="hidden md:block">{/* Empty label to fill min-content */}</label>
            )

            }
            <label className="hidden md:block"></label> {/* Empty label to fill 1fr */}
            <Image className="hidden md:block invert-[0.8] select-none hover:invert-[0.9]" src='https://api.music.rockhosting.org/images/lyrics.png' width={30} height={30} alt="Toggle lyrics" />
            <Image
                className="md:block invert-[0.6] select-none hover:invert-[0.7] cursor-pointer"
                style={{ filter: randomQueue ? ('brightness(0) saturate(100%) invert(44%) sepia(91%) saturate(474%) hue-rotate(3deg) brightness(105%) contrast(97%)') : ('') }}
                src='https://api.music.rockhosting.org/images/random.svg'
                width={30}
                height={30}
                alt="Toggle random queue"
                onClick={toggleRandomQueue}
            />

            <div className="hidden md:block relative h-[30px] w-[30px]">
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

            </div>

            {/* <div className="hidden md:block"> */}
            <Slider value={audioVolume} onChange={sliderChange} className="hidden md:block"></Slider>
            {/* </div> */}


            {session.data ? (
                <div className="hidden md:flex flex-row gap-2 w-max items-center">
                    <Link href='/user'>
                        <Image className="rounded-full" src={session?.data?.user?.image} width={40} height={40} alt="" />
                    </Link>
                    <button className="bg-neutral-700 pl-2 pr-2 rounded-lg hover:bg-red-600" onClick={() => signOut()}>Logout</button>
                </div>
            ) : (
                <Link className="hidden md:block bg-neutral-700 pl-2 pr-2 rounded-lg hover:bg-green-600" href='/login'>Login</Link>
            )}
        </div>
    )
}