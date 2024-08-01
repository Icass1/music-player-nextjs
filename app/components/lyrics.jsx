import { useContext, useEffect, useState } from "react";
import { MediaPlayerContext } from "./audioContext";
import clsx from "clsx";


function DynamicLyrics(lyrics) {
    const {
        currentTime,
    } = useContext(MediaPlayerContext);

    if (!lyrics.lyrics) {
        return (
            <div className="text-center top-1/2 relative h-full font-bold text-xl">
                Loading lyrics...
            </div>
        )
    }



    console.log(currentTime)

    return (
        <>
            {lyrics.lyrics.segments.map((line, index) =>
                <div key={"line" + index} className="w-fit ml-auto mr-auto">
                    {line.words.map((word, index) =>
                        <label key={"word" + index} className={clsx("text-center ml-1", { 'text-neutral-100': word.start < currentTime, 'text-neutral-500': word.start > currentTime })}>{word.text}</label>
                    )}
                </div>
            )}
        </>
    )
}

function NormalLyrics(lyrics) {
    if (lyrics.lyrics == '') {
        return (
            <div className="text-center top-1/2 relative h-full font-bold text-xl">
                No lyrics found
            </div>
        )
    } else if (!lyrics.lyrics) {
        return (
            <div className="text-center top-1/2 relative h-full font-bold text-xl">
                Loading lyrics...
            </div>
        )
    }

    return (
        <>
            {lyrics.lyrics.split("\n").map((line, index) =>
                line == "" ?
                    <div key={index} className="min-h-4"></div>
                    :
                    <label key={index} className="text-center text-neutral-200">{line}</label>
            )}
        </>
    )
}

export default function Lyrics() {

    const {
        currentSong,
    } = useContext(MediaPlayerContext);

    const [dynamicLyrics, setDynamicLyrics] = useState(false)
    const [lyrics, setLyrics] = useState()

    useEffect(() => {
        if (!currentSong.id) {
            return
        }

        fetch(`https://api.music.rockhosting.org/api/song/lyrics/${currentSong.id}`).then(reponse => {
            if (reponse.status == 200) {
                reponse.json().then(response => {
                    setDynamicLyrics(response.has_dynamic_lyrics)
                    setLyrics(response.lyrics)
                })
            } else {
                setDynamicLyrics(false)
                setLyrics('')
            }
        })

    }, [currentSong])


    return (
        <div className="flex flex-col h-full text-lg">
            <div className="min-h-6 list-item"></div>
            {dynamicLyrics ? <DynamicLyrics lyrics={lyrics} /> : <NormalLyrics lyrics={lyrics} />}
            <div className="min-h-20 list-item"></div>
        </div>
    )
}