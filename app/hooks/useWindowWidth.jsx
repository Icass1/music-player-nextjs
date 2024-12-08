import { useState, useEffect } from "react";

export default function useWindowWidth() {
    const [width, setWidth] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return width;
}
