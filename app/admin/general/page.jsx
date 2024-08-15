'use client'

import useWindowWidth from "@/app/hooks/useWindowWidth"
import { apiFetch } from "@/app/utils/apiFetch"
import { useSession } from "next-auth/react"
import { Link } from "next-view-transitions"
import { useEffect, useState } from "react"



function NumberOfLists({ number }) {
    return (
        <div className="bg-3 rounded-lg p-3">
            <label className="ml-auto mr-auto block font-bold text-neutral-100 text-2xl w-fit">Number of lists</label>
            <label className="ml-auto mr-auto mt-2 block font-bold text-fg-1 text-2xl w-fit">{number}</label>
            <Link href='/admin/lists' className="ml-auto mr-auto mt-2 block font-bold text-neutral-400 text-sm w-fit">See more</Link>
        </div>
    )
}

function NumberOfSongs({ total, dynamicLyrics, normalLyrics }) {
    return (
        <div className="bg-3 rounded-lg p-3">
            <label className="ml-auto mr-auto block font-bold text-neutral-100 text-2xl w-fit">Number of songs</label>
            <label className="ml-auto mr-auto mt-2 block font-bold text-fg-1 text-2xl w-fit">{total}</label>
            <label className="ml-auto mr-auto mt-2 w-fit flex flex-row items-center">
                <label className="font-bold text-fg-1 text-2xl ">{dynamicLyrics}</label>
                <label className="ml-1 mr-1 bg-neutral-500 pl-1 pr-1 rounded-md">DYNAMIC LYRICS</label>
                <label className="font-bold text-fg-1 text-xl ">{Math.round(dynamicLyrics / total * 100)}%</label>
            </label>
            <label className="ml-auto mr-auto mt-2 w-fit flex flex-row items-center">
                <label className="font-bold text-fg-1 text-2xl ">{normalLyrics}</label>
                <label className="ml-1 mr-1 bg-neutral-500 pl-1 pr-1 rounded-md">NORMAL LYRICS</label>
                <label className="font-bold text-fg-1 text-xl ">{Math.round(normalLyrics / total * 100)}%</label>
            </label>
            <Link href='/admin/songs' className="ml-auto mr-auto mt-2 block font-bold text-neutral-400 text-sm w-fit">See more</Link>
        </div>
    )
}

function PendingSongs({ number }) {
    return (
        <div className="bg-3 rounded-lg p-3">
            <label className="ml-auto mr-auto block font-bold text-neutral-100 text-2xl w-fit">Pending songs</label>
            <label className="ml-auto mr-auto mt-2 block font-bold text-fg-1 text-2xl w-fit">{number}</label>
            <Link href='/admin/songs' className="ml-auto mr-auto mt-2 block font-bold text-neutral-400 text-sm w-fit">See more</Link>
        </div>
    )
}

function NumberOfUsers({ number }) {
    return (
        <div className="bg-3 rounded-lg p-3">
            <label className="ml-auto mr-auto block font-bold text-neutral-100 text-2xl w-fit">Number of users</label>
            <label className="ml-auto mr-auto mt-2 block font-bold text-fg-1 text-2xl w-fit">{number}</label>
            <Link href='/admin/users' className="ml-auto mr-auto mt-2 block font-bold text-neutral-400 text-sm w-fit">See more</Link>
        </div>
    )
}

export default function General() {

    const session = useSession()
    const [data, setData] = useState({
        total_lists: "Loading...",
        total_users: "Loading...",
        total_songs: "Loading...",
        pending_songs: "Loading...",
        dynamic_lyrics_songs: "Loading...",
        normal_lyrics_songs: "Loading...",
    });
    const [loaded, setLoaded] = useState(false)
    const innerWidth = useWindowWidth()


    useEffect(() => {
        // if (session.status != "authenticated") { return }
        apiFetch("https://api.music.rockhosting.org/api/admin/info", session).then(response => {

            console.log(response)

            if (response.status == 200) {
                response.json().then(data => {
                    console.log(data)
                    setData(data)
                    setLoaded(true)
                })
            }
            else {
                setData("error")
                setLoaded(true)
            }
        }).catch(error => {
            setData("error")
            setLoaded(true)
        })
    }, [session])

    if (!loaded) {
        return (
            <label className="ml-auto mr-auto w-fit block top-1/2 relative text-4xl font-bold text-neutral-200 h-fit">Loading...</label>
        )
    }

    if (data == 'error') {
        return (
            <label className="ml-auto mr-auto w-fit block top-1/2 relative text-4xl font-bold text-neutral-200 h-fit">Error</label>
        )
    }

    return (
        <div className="grid gap-2 m-2 " style={{ gridTemplateColumns: innerWidth < 1000 ? '1fr' : '1fr 1fr', display: innerWidth < 1000 ? 'flex' : '', flexDirection: 'column' }}>
            <div className="flex flex-col gap-2">
                <NumberOfLists number={data.total_lists} />
                <NumberOfUsers number={data.total_users} />
            </div>
            <div className="flex flex-col gap-2">
                <NumberOfSongs total={data.total_songs} dynamicLyrics={data.dynamic_lyrics_songs} normalLyrics={data.normal_lyrics_songs} />
                <PendingSongs number={data.pending_songs} />
            </div>
        </div>
    )
}
