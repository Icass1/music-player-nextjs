
'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Link } from 'next-view-transitions'

import { useContext, useEffect, useRef, useState } from "react";

import Slider from "./slider";
import { MediaPlayerContext } from './audioContext';
import { usePathname } from "next/navigation";
import useWindowWidth from "../hooks/useWindowWidth";

export default function Header({ handleSearch }) {

    const {
        audio,
        audioVolume,
        setAudioVolume,
        randomQueue,
        setRandomQueue,
        showLyrics,
        setShowLyrics,
        queueIndex,
        queue,
        setQueue,
        homeView,
        setHomeView,
    } = useContext(MediaPlayerContext);

    const [lastAudioVolume, setLastAudioVolume] = useState(null);
    const [muted, setMuted] = useState(false);
    const innerWidth = useWindowWidth();

    const [homeViewIndicatorImagePath, setHomeViewIndicatorImagePath] = useState();

    const session = useSession();

    const searchInputRef = useRef();

    const pathname = usePathname();

    const sliderChange = (event) => {
        audio.volume = event.target.value;
        setAudioVolume(event.target.value);

        if (muted) {
            setMuted(false);
        }
    };

    useEffect(() => {
        if (muted && audio.volume != 0) {
            setLastAudioVolume(audio.volume);
            audio.volume = 0;
        } else if (lastAudioVolume) {
            audio.volume = lastAudioVolume
        }

    }, [muted, audio]) // Do not add lastAudioVolume as a dependency.

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

    // const toggleRandomQueue = () => {

    //     if (randomQueue) {
    //         setRandomQueue(false)
    //     } else {
    //         setRandomQueue(true)
    //         let newQueue = queue.slice(queueIndex + 1)
    //         newQueue.sort(() => Math.random() - 0.5)
    //         setQueue(queue.slice(0, queueIndex + 1).concat(newQueue))
    //     }
    // }

    const toggleShowLyrics = () => {

        if (showLyrics) {
            setShowLyrics(false)
        } else {
            setShowLyrics(true)
        }
    }

    const handleViewChange = () => {

        setHomeView((value) => {
            let newValue = { ...value }; // Create a new copy of the state
            newValue.view = newValue.view + 1;
            if (newValue.view >= newValue.numberOfViews) {
                newValue.view = 0;
            }
            return newValue;
        });
    }

    useEffect(() => {

        if (homeView.view == 0) {
            setHomeViewIndicatorImagePath('https://api.music.rockhosting.org/images/listWithName.svg')
        } else if (homeView.view == 1) {
            setHomeViewIndicatorImagePath('https://api.music.rockhosting.org/images/grid.svg')
        }

    }, [homeView])

    useEffect(() => {

        if (location.pathname != "/search") {
            return;
        }

        let params = new URL(document.location).searchParams;
        handleSearch(params.get("q"));
        searchInputRef.current.value = params.get("q");
    }, [handleSearch])

    return (
        <div
            className="grid h-full items-center ml-auto mr-auto w-min md:w-auto md:ml-5 md:mr-5 gap-10 md:gap-4"
            style={{
                gridTemplateColumns: innerWidth > 768 ? '30px 30px min-content 1fr max-content 30px 30px 150px min-content' : '30px 30px 30px',
                gridTemplateRows: '100%'
            }}
        >
            <Link href="/">
                <Image className="md:block invert-[0.8] hover:invert-[0.7] select-none" src='https://api.music.rockhosting.org/images/home.svg' width={30} height={30} alt="Search" />
            </Link>
            <Link href="/search">
                <Image className="md:block invert-[0.8] hover:invert-[0.7] select-none" src='https://api.music.rockhosting.org/images/search.svg' width={30} height={30} alt="Search" />
            </Link>
            {pathname == "/search" ? (
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

            {homeViewIndicatorImagePath && pathname === "/" ? (
                <Image
                    className="hidden md:block invert-[0.6] select-none hover:invert-[0.7]"
                    src={homeViewIndicatorImagePath}
                    width={30}
                    height={30}
                    alt="Toggle view"
                    onClick={handleViewChange}
                />
            ) : (
                <label className="hidden md:block"></label> //Label to fill max-content when homeViewIndicatorImagePath is null
            )}
            <Image
                className="hidden md:block invert-[0.8] select-none hover:invert-[0.9] cursor-pointer transition-all"
                src='https://api.music.rockhosting.org/images/lyrics.png'
                style={{ filter: showLyrics ? ('brightness(0) saturate(100%) invert(44%) sepia(91%) saturate(474%) hue-rotate(3deg) brightness(105%) contrast(97%)') : ('') }}
                width={30}
                height={30}
                alt="Toggle lyrics"
                onClick={toggleShowLyrics}
            />
            {/* <Image
                className="md:block invert-[0.6] select-none hover:invert-[0.7] cursor-pointer transition-all"
                style={{ filter: randomQueue ? ('brightness(0) saturate(100%) invert(44%) sepia(91%) saturate(474%) hue-rotate(3deg) brightness(105%) contrast(97%)') : ('') }}
                src='https://api.music.rockhosting.org/images/random.svg'
                width={30}
                height={30}
                alt="Toggle random queue"
                onClick={toggleRandomQueue}
            /> */}

            <div className="hidden md:block relative h-[30px] w-[30px]">
                <Image
                    className="absolute invert-[0.6] select-none cursor-pointer hover:invert-[0.7] transition-all"
                    src='https://api.music.rockhosting.org/images/volumeMuted.png'
                    width={30}
                    height={30}
                    priority={true}
                    alt=""
                    style={{ clipPath: muted ? `inset(0px 0px 0px 0px)` : `inset(0px 30px 0px 0px)` }}
                    onClick={() => setMuted(value => !value)}
                />

                <Image
                    className="absolute invert-[0.6] select-none cursor-pointer hover:invert-[0.7] transition-all"
                    src='https://api.music.rockhosting.org/images/volume.svg'
                    width={30}
                    height={30}
                    alt=""
                    priority={true}
                    style={{ clipPath: muted ? `inset(0px 0px 0px 30px)` : `inset(0px 0px 0px 0px)` }}
                    onClick={() => setMuted(value => !value)}
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
                    <button className="bg-3 pl-2 pr-2 rounded-lg hover:bg-red-600" onClick={() => signOut()}>Logout</button>
                </div>
            ) : (
                <Link className="hidden md:block bg-3 pl-2 pr-2 rounded-lg hover:bg-green-600" href='/login'>Login</Link>
            )}
        </div>
    )
}