import { useEffect, useState } from "react"

export default function useColors() {

    const [colors, setColors] = useState({
        background1: '',
        background2: '',
        background3: '',
        foreground1: '',
        foreground2: '',
    })

    useEffect(() => {

        setColors({
            background1: getComputedStyle(document.body).getPropertyValue("--background-1"),
            background2: getComputedStyle(document.body).getPropertyValue("--background-2"),
            background3: getComputedStyle(document.body).getPropertyValue("--background-3"),
            foreground1: getComputedStyle(document.body).getPropertyValue("--foreground-1"),
            foreground2: getComputedStyle(document.body).getPropertyValue("--foreground-2"),
        })

    }, [])

    return colors
}