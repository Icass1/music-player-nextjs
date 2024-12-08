"use client";

import { apiFetch } from "@/app/utils/apiFetch";
import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Artist({ params }) {
    useEffect(() => {
        console.log(`/api/artist/${params.id}`);
        apiFetch(`/api/artist/${params.id}`)
            .then((data) => data.json())
            .then((data) => {
                console.log(data);
                setLists(data);
            });
    }, [params.id]);

    const [lists, setLists] = useState([]);
    const [showing, setShowing] = useState("");

    const scrollRef = useRef();
    const [scroll, setScroll] = useState(0);
    const [transition, setTransition] = useState(true);

    useEffect(() => {
        if (!scrollRef.current) {
            return;
        }

        const handleScroll = (e) => {
            setScroll(scrollRef.current.scrollLeft);
            // console.log("setTransition(false)")
            setTransition(false);
        };

        const handleScrollEnd = (e) => {
            // console.log("setTransition(true)")
            setTransition(true);
        };

        scrollRef.current.addEventListener("scroll", handleScroll);
        scrollRef.current.addEventListener("scrollend", handleScrollEnd);
    }, [scrollRef]);

    const handleClick = useCallback(
        (e) => {
            scrollRef.current.getBoundingClientRect().x;

            let index = Math.floor(
                (e.clientX -
                    scrollRef.current.getBoundingClientRect().x +
                    scroll) /
                    100,
            );
            if (index >= lists.length) {
                index = lists.length - 1;
            }
            setShowing(lists[index]);
        },
        [scrollRef, scroll, lists],
    );

    return (
        <div className="ml-6 mt-6 mr-6">
            <label className="text-5xl block font-bold h-14 fade-out-neutral-100 w-full ml-1 mr-1">
                {params.id}
            </label>
            <div className="relative flex flex-row h-[600px] overflow-x-hidden">
                {lists.map((list, index) => (
                    <Cover
                        index={index}
                        list={list}
                        key={list.id}
                        showing={showing}
                        setShowing={setShowing}
                        scroll={scroll}
                        transition={transition}
                    />
                ))}

                <div
                    ref={scrollRef}
                    className="mt-6 w-full h-[240px] z-10 overflow-x-scroll"
                    onClick={handleClick}
                >
                    <div
                        className="h-full"
                        style={{ width: `${100 * lists.length + 80}px` }}
                    ></div>
                </div>
            </div>

            <div className="ml-64 -mt-32 text-4xl font-bold">
                {showing.name}
            </div>
        </div>
    );
}

function Cover({ index, list, showing, setShowing, scroll, transition }) {
    const states = {
        default: `perspective(400px) rotate3d(0, 1, 0, 30deg)`,
        showing:
            "perspective(400px) rotate3d(0, 1, 0, 0deg) scale(1.2) translateY(250px)",
    };

    const handleClick = useCallback(
        (e) => {
            if (showing == list) {
                setShowing("");
            } else {
                setShowing(list);
            }
        },
        [showing, list, setShowing],
    );

    return (
        <Image
            src={`https://api.music.rockhosting.org/api/list/image/${list.id}_300x300`}
            alt="f"
            width={200}
            height={200}
            className={clsx("absolute -mr-24 rounded-lg mt-10", {
                "transition-all": transition,
            })}
            style={{
                transform:
                    showing == list ? states["showing"] : states["default"],
                left: showing == list ? "30px" : `${index * 100 - scroll}px`,
            }}
            onClick={handleClick}
        />
    );
}
