import React from 'react'

export const SetPoint = ({ value }) => {
    return (
        <div className="card w-full md:h-20 h-10 bg-base-100 card-xs shadow-sm border rounded-sm">
            <div className="card-body flex justify-center text-center items-center">
                <h2 className="card-title md:text-5xl text-xl px-3 text-center">{value}</h2>
            </div>
        </div>
    )
}
