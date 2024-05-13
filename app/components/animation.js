import { useEffect, useState } from "react";

export default function Animation(initialValue, min, max, step, delay=1) {

    const [animationValue, setAnimationValue] = useState(initialValue)
    const [animationInterval, setAnimationInterval] = useState(undefined)
    const [animationIsIncreasing, setAnimationIsIncreasing] = useState(null)

    const toggleAnimation = () => {

        if (animationInterval) {
            console.error("Animation already in progress")
            return
        }

        if (animationValue <= min) {

            let interval = setInterval(() => {
                setAnimationValue((prevValue) => {
                    return Math.min(prevValue + step, max)
                });
            }, delay);

            setAnimationInterval(interval)
            setAnimationIsIncreasing(true)

        } else if (animationValue >= max) {

            let interval = setInterval(() => {
                setAnimationValue((prevValue) => {
                    return Math.max(prevValue - step, min)
                });
            }, delay);
            setAnimationInterval(interval)
            setAnimationIsIncreasing(false)

        } else {
            console.error(animationValue, max, min)
        }
    }

    useEffect(() => {
        
        if (animationIsIncreasing != null && animationValue > max - 1 && animationIsIncreasing) {
            clearInterval(animationInterval)
            setAnimationInterval(undefined)
            setAnimationIsIncreasing(null)
            setAnimationValue(max)
        } else if (animationIsIncreasing != null && animationValue < min + 1 && !animationIsIncreasing) {
            clearInterval(animationInterval)
            setAnimationInterval(undefined)
            setAnimationIsIncreasing(null)
            setAnimationValue(min)
        }

    }, [animationValue, animationInterval])

    return [animationValue, toggleAnimation, animationIsIncreasing]
}