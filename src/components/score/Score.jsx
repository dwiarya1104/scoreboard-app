import React, { useState } from 'react'

export const Score = ({ value, onChange, running }) => {
    const [touchStart, setTouchStart] = useState(null)

    const handleTouchStart = (e) => {
        if (!running) return
        setTouchStart(e.touches[0].clientY)
    }

    const handleTouchEnd = (e) => {
        if (!running || touchStart === null) return
        const touchEnd = e.changedTouches[0].clientY
        const diffY = touchStart - touchEnd

        if (diffY > 30) {
            onChange(value + 1)   // swipe ke atas → tambah
        } else if (diffY < -30 && value > 0) {
            onChange(value - 1)   // swipe ke bawah → kurang
        }

        setTouchStart(null)
    }

    return (
        <div
            className={`card w-full border border-black bg-base-100 card-md shadow-sm rounded-sm md:h-80 h-40 select-none ${running ? "cursor-pointer" : "cursor-not-allowed opacity-70"
                }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="card-body flex justify-center text-center items-center">
                <span className="countdown font-mono md:text-9xl text-5xl">
                    <span style={{ "--value": value }}>{value}</span>
                </span>
            </div>
        </div>
    )
}
