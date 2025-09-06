import React, { useEffect, useState } from 'react'

export const Timer = ({ running }) => {
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        let interval = null
        if (running) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)
        } else if (interval) {
            clearInterval(interval)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [running])

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    return (
        <span className="countdown font-mono md:text-2xl text-xl mt-2 border rounded-md p-3 text-white">
            <span style={{ "--value": h }}>{h}</span>:
            <span style={{ "--value": m }}>{m}</span>:
            <span style={{ "--value": s }}>{s}</span>
        </span>
    )
}
