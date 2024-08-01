import clsx from "clsx";
import React, { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import useWindowWidth from "../hooks/useWindowWidth";

export default function ContextMenu({ children, options }) {

    const [position, setPosition] = useState([10, 10]);
    const [showing, setShowing] = useState(false);
    const contextMenuRef = useRef();
    const innerWidth = useWindowWidth();

    const close = useCallback((e) => {
        let clientX = innerWidth > 768 ? e.clientX : e.touches[0].clientX
        let clientY = innerWidth > 768 ? e.clientY : e.touches[0].clientY

        if (
            clientX < position[0] ||
            clientX > position[0] + contextMenuRef.current.offsetWidth ||
            clientY < position[1] ||
            clientY > position[1] + contextMenuRef.current.offsetHeight
        ) {
            // console.log("setShowing(false)")
            setShowing(false);
        }
    }, [contextMenuRef, position])

    useEffect(() => {
        if (showing) {
            innerWidth > 768 ? document.addEventListener("mousedown", close) : document.addEventListener("touchstart", close)
        } else {
            document.removeEventListener("touchstart", close)
            document.removeEventListener("mousedown", close)
        }
        return () => {
            document.removeEventListener("mousedown", close);
            document.removeEventListener("touchstart", close)
        };
    }, [showing, close])

    const applyStyleToChildren = (child) => {
        if (React.isValidElement(child)) {

            let newProps = {
                onContextMenu: (e) => {
                    e.preventDefault();
                    setShowing(true)

                    let x;
                    let y;

                    if (innerWidth > 768) {
                        x = e.clientX;
                        y = e.clientY;
                    } else {
                        x = e.clientX - contextMenuRef.current.offsetWidth;
                        y = e.clientY - contextMenuRef.current.offsetHeight;
                    }

                    if (e.clientX + contextMenuRef.current.offsetWidth > window.innerWidth) {
                        x = e.clientX - contextMenuRef.current.offsetWidth;
                    }

                    if (e.clientY + contextMenuRef.current.offsetHeight > window.innerHeight) {
                        y = e.clientY - contextMenuRef.current.offsetHeight;
                    }

                    if (x < 5) {
                        x = 5
                    }

                    if (y < 5) {
                        y = 5
                    }
                    setPosition([x, y]);

                }
            }
            return cloneElement(child, newProps);
        }
        return child;
    };

    return (
        <>
            {applyStyleToChildren(children)}
            <div ref={contextMenuRef} className={clsx(`fixed bg-[#252525e0] rounded-lg z-50 w-max border-solid border-neutral-700 border-1`, { "hidden": !showing })} style={{ left: position[0], top: position[1] }}>
                {Object.keys(options).map((key) => (
                    <div key={key} className="p-2 rounded-lg md:text-sm text-lg hover:bg-neutral-600 cursor-pointer opacity-100" onClick={() => { options[key](); setShowing(false) }}>{key}</div>
                ))}
            </div>
        </>
    )
}