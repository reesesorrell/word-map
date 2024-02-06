'use client'

import { useState, useEffect } from "react"

export default function GameTimer({setGameStarted, gameStarted}) {

    const [time, setTime] = useState(60);
    
    useEffect(() => {
        let interval;
        if (gameStarted) {
            interval = setInterval(() => {
                setTime(lastTimerCount => {
                    if (lastTimerCount <= 0) {
                        setTime(60)
                        setGameStarted(false);
                    } else {
                        lastTimerCount <= 0 && clearInterval(interval)
                        return lastTimerCount - 1
                    }
                })
            }, 1000) 
        }

        //cleanup the interval on complete
        return () => clearInterval(interval)
    }, [gameStarted]);

    return(
        <div>
            <div>{time}</div>
        </div>
        
    )
}