import React from 'react'

export const TeamName = ({ value, onChange, disabled }) => {
    return (
        <label className="floating-label w-full">
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Nama Tim"
                className="input input-lg rounded-md w-full"
                disabled={disabled}
            />
            <span>{value}</span>
        </label>
    )
}
