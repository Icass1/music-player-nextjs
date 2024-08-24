import { useState, useEffect } from 'react';


export default function useWindowSize() {

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight)
        };

        setWidth(window.innerWidth)
        setHeight(window.innerHeight)

        window.addEventListener('resize', handleResize);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return [width, height];
}