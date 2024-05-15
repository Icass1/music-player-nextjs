import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function ContextMenu({ children, options }) {

    const [position, setPosition] = useState([10, 10]);
    const [showing, setShowing] = useState(false);
    const contextMenuRef = useRef();
    const close = (e) => {
        if (
            e.clientX < position[0] ||
            e.clientX > position[0] + contextMenuRef.current.offsetWidth ||
            e.clientY < position[1] ||
            e.clientY > position[1] + contextMenuRef.current.offsetHeight
        ) {
            setShowing(false);
        }
    };

    useEffect(() => {
        if (showing) {
            // document.removeEventListener("mousedown", close)
            document.addEventListener("mousedown", close)
        } else {
            document.removeEventListener("mousedown", close)
        }
        return () => {
            document.removeEventListener("mousedown", close);
        };
    }, [showing, close])

    return (
        <>
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    setShowing(true)

                    let x = e.clientX
                    let y = e.clientY

                    if (e.clientX + contextMenuRef.current.offsetWidth > window.innerWidth) {
                        x = e.clientX - contextMenuRef.current.offsetWidth
                    }

                    if (e.clientY + contextMenuRef.current.offsetHeight > window.innerHeight) {
                        y = e.clientY - contextMenuRef.current.offsetHeight
                    }

                    setPosition([x, y])
                }}
            >
                {children}
            </div>
            <div ref={contextMenuRef} className={clsx(`fixed bg-[#50505090] rounded-lg z-50 w-max border-solid border-neutral-700 border-1`, { "invisible": !showing })} style={{ left: position[0], top: position[1] }}>
                {Object.keys(options).map((key) => (
                    <div key={key} className="p-2 rounded-lg text-sm hover:bg-neutral-600 cursor-pointer opacity-100" onClick={() => { options[key](); setShowing(false)}}>{key}</div>
                ))}
            </div>
        </>
    )
}