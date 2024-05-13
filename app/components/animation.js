import { useEffect, useState } from "react";

export default function Animation(initialValue, min, max) {

    const [animationValue, setAnimationValue] = useState(initialValue)
    const [animationInterval, setAnimationInterval] = useState(undefined)
    const [animationIsIncreasing, setAnimationIsIncreasing] = useState(null)

    const toggleAnimation = () => {

        if (animationValue <= min) {
            // setAnimationValue(max)

            let interval = setInterval(() => {
                setAnimationValue((prevValue) => {
                    // if (prevValue + 10 > max) {
                    //     return max
                    // }
                    return Math.min(prevValue + 10, max)
                    // return 
                });
            }, 0.01);

            setAnimationInterval(interval)
            setAnimationIsIncreasing(true)

        } else if (animationValue >= max) {

            let interval = setInterval(() => {
                setAnimationValue((prevValue) => {
                    // if (prevValue - 10 < min) {
                    //     return min
                    // }
                    // return prevValue - 10
                    return Math.max(prevValue - 10, min)

                });
            }, 0.01);
            setAnimationInterval(interval)
            setAnimationIsIncreasing(false)

        } else {
            console.error(animationValue, max, min)
        }
    }

    useEffect(() => {
        
        if (animationIsIncreasing != null && animationValue > max - 1 && animationIsIncreasing) {
            clearInterval(animationInterval)
            setAnimationIsIncreasing(null)
            setAnimationValue(max)
        } else if (animationIsIncreasing != null && animationValue < min + 1 && !animationIsIncreasing) {
            clearInterval(animationInterval)
            setAnimationIsIncreasing(null)
            setAnimationValue(min)
        }

    }, [animationValue, animationInterval])

    return [animationValue, toggleAnimation, animationIsIncreasing]
}