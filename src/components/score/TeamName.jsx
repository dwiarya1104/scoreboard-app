import React from 'react'

export const TeamName = ({ value, onChange, disabled }) => {
    return (
        <>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Nama Tim"
                className="input w-full rounded-xl text-center font-bold text-xl md:text-2xl border shadow-2xl"
                readOnly={disabled}
            />
        </>
    )
}
