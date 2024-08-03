import { useContext, useEffect, useRef, useState } from "react";
import { MediaPlayerContext } from "./audioContext";
import clsx from "clsx";
import { debounce } from "lodash";
import classNames from "classnames";
import { apiFetch } from "../utils/apiFetch";


function DynamicLyrics({ lyrics, fontSize }) {
    const {
        currentTime,
    } = useContext(MediaPlayerContext);

    if (!lyrics) {
        return (
            <div className="text-center top-1/2 relative h-full font-bold text-xl">
                Loading lyrics...
            </div>
        )
    }
    return (
        <>
            {lyrics.segments.map((line, index) =>
                <div key={"line" + index} id={"segment-id-" + line.id} className="w-fit ml-auto mr-auto">
                    {line.words.map((word, index) =>
                        <label key={"word" + index} style={{ fontSize: fontSize }} className={clsx("text-center ml-1", { 'text-fg-2': word.start < currentTime, 'text-neutral-500': word.start > currentTime })}>{word.text}</label>
                    )}
                </div>
            )}
        </>
    )
}

function NormalLyrics({ lyrics, fontSize, lineClassName }) {
    if (lyrics == '') {
        return (
            <div className="text-center top-1/2 relative h-full font-bold text-xl">
                No lyrics found
            </div>
        )
    } else if (!lyrics) {
        return (
            <div className="text-center top-1/2 relative h-full font-bold text-xl">
                Loading lyrics...
            </div>
        )
    }
    return (
        <>
            {lyrics.split("\n").map((line, index) =>
                line == "" ?
                    <div key={index} className="min-h-4"></div>
                    :
                    <label key={index} style={{ fontSize: fontSize }} className={classNames("text-center text-neutral-200", lineClassName)}>{line}</label>
            )}
        </>
    )
}

export default function Lyrics({ songID, fontSize, lineClassName }) {

    const {
        currentSong,
        currentTime,
    } = useContext(MediaPlayerContext);

    const [dynamicLyrics, setDynamicLyrics] = useState(false)
    const [lyrics, setLyrics] = useState()
    const mainRef = useRef();

    const [followLyrics, setFollowLyrics] = useState(true)

    useEffect(() => {
        if (!currentSong.id) {
            return
        }

        if (!songID || currentSong.id == songID) {
            apiFetch(`/api/song/lyrics/${currentSong.id}`).then(response => {
                if (response.status == 200) {
                    response.json().then(data => {

                        let lyricsOut;

                        if (data.has_dynamic_lyrics && data.lyrics) {
                            lyricsOut = { segments: [] }
                            let segmentIndex = 0

                            for (let segment of data.lyrics.segments) {

                                let newSegment = { id: segmentIndex, words: [] }
                                segmentIndex++;

                                for (let word of segment.words) {

                                    if (word.text.includes(",")) {
                                        word.text = word.text.replace(",", "")
                                        newSegment.words.push(word)
                                        newSegment.end = word.end
                                        lyricsOut.segments.push(newSegment)

                                        newSegment = { id: segmentIndex, words: [] }
                                        segmentIndex++;
                                    } else {
                                        if (newSegment.words.length == 0) {
                                            newSegment.start = word.start
                                            word.text = word.text[0].toUpperCase() + word.text.slice(1,)
                                        }
                                        newSegment.words.push(word)
                                    }
                                }
                                newSegment.end = segment.end
                                lyricsOut.segments.push(newSegment)

                            }
                        }
                        setDynamicLyrics(data.has_dynamic_lyrics)
                        if (lyricsOut) {
                            setLyrics(lyricsOut)
                        } else {
                            setLyrics(data.lyrics)
                        }
                    })
                } else {
                    setDynamicLyrics(false)
                    setLyrics('')
                }
            })
        } else {
            apiFetch(`/api/song/normal-lyrics/${songID}`).then(response => {

                if (response.status == 200) {
                    response.text().then(data => {
                        console.log(data)
                        setDynamicLyrics(false)
                        setLyrics(data)
                    })
                } else {
                    setDynamicLyrics(false)
                    setLyrics('')
                }
            })
        }


    }, [currentSong, songID])

    useEffect(() => {
        if (!dynamicLyrics) { return }
        if (!followLyrics) { return }

        for (let segmentIndex in lyrics.segments) {
            let segment = lyrics.segments[segmentIndex];

            if (segment.start < currentTime && segment.end > currentTime) {

                let scroll = document.querySelector("#segment-id-" + segment.id).offsetTop - mainRef.current.parentNode.offsetTop

                mainRef.current.parentNode.scrollTo(0, scroll - mainRef.current.parentNode.offsetHeight / 2)
                break
            }
        }
    }, [dynamicLyrics, lyrics, currentTime, mainRef, followLyrics])

    useEffect(() => {

        const element = mainRef.current

        const timeoutFollowLyrics = debounce((e) => {
            setFollowLyrics(true)
        }, 4000);

        const handleScroll = () => {
            setFollowLyrics(false)
            timeoutFollowLyrics()
        }

        element.parentNode.addEventListener("scroll", handleScroll)

        return () => {
            element?.parentNode?.removeEventListener("scroll", handleScroll)
        }

    }, [mainRef])

    return (
        <div ref={mainRef} className="flex flex-col h-full text-lg">
            <div className="min-h-6 list-item"></div>
            {dynamicLyrics ? <DynamicLyrics lyrics={lyrics} fontSize={fontSize} /> : <NormalLyrics lyrics={lyrics} fontSize={fontSize} lineClassName={lineClassName}/>}
            <div className="min-h-20 list-item"></div>
        </div>
    )
}