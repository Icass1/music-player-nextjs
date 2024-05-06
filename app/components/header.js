
'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

import Slider from "./slider";
import { AudioContext } from './audioContext';

export default function Header() {

    const {
        audio,
        audioVolume,
        setAudioVolume,
    } = useContext(AudioContext);

    const session = useSession();

    const sliderInput = (e) => {
        audio.volume = e.target.value;
    }

    const sliderChange = (event) => {
        setAudioVolume(event.target.value);
    };

    return (
        <div className="grid h-full items-center ml-3 mr-3 gap-4" style={{gridTemplateColumns: '1fr 30px 30px 30px 30px 150px min-content'}}>
            <label></label>
            <Image className="rounded-full invert-[0.8] select-none" src='https://api.music.rockhosting.org/images/lyrics.png' width={30} height={30} alt=""/>
            <Image className="rounded-full invert-[0.6] select-none" src='https://api.music.rockhosting.org/images/random.svg' width={30} height={30} alt=""/>
            <Image className="rounded-full invert-[0.6] select-none" src='https://api.music.rockhosting.org/images/volumeMuted.png' width={30} height={30} alt=""/>
            <Image className="rounded-full invert-[0.6] select-none" src='https://api.music.rockhosting.org/images/volume.svg' width={30} height={30} alt=""/>
            <Slider value={audioVolume} onInput={sliderInput} onChange={sliderChange}></Slider>
            {session.data ? (
                <div className="flex flex-row gap-2 w-max items-center">
                    <Image className="rounded-full" src={session?.data?.user?.image} width={40} height={40} alt=""/>
                    <div>{session?.data?.user?.name}</div>
                    <button className="bg-neutral-700 pl-2 pr-2 rounded-lg hover:bg-red-600" onClick={() => signOut()}>Logout</button>
                </div>
            ) : (
                <Link className="bg-neutral-700 pl-2 pr-2 rounded-lg hover:bg-green-600" href='/login'>Login</Link>
            )}
        </div>
    )
}