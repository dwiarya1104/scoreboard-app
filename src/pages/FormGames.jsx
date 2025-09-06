import React, { useState } from 'react'
import { ScoreBoard } from './ScoreBoard'

export const FormGames = () => {
    const [useTimer, setUseTimer] = useState(false)
    const [usePoint, setUsePoint] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            playerA: e.target.playerA.value || "Team A",
            playerB: e.target.playerB.value || "Team B",
            usePoint,
            maxPoint: usePoint ? Number(e.target.maxPoint.value || 21) : null,
            useTimer,
            duration: useTimer ? Number(e.target.duration.value || 15) : null,
        }
        setFormData(data)
        setSubmitted(true)
    }

    if (submitted) {
        return <ScoreBoard config={formData} onExit={() => setSubmitted(false)} />
    }

    return (
        // <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4">
        <div className="flex items-center justify-center min-h-screen bg-[#17153B] p-4">
            <div className="card w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8">
                <h2 className="md:text-3xl text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#433D8B] to-[#C8ACD6] font-extrabold text-center mb-6">
                   ⚡ Setup Pertandingan
                </h2>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Nama Player */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <div className="form-control ">
                            <label className="label font-semibold text-grey-700">Nama Player A</label>
                            <input
                                type="text"
                                name="playerA"
                                placeholder="Masukkan nama Player A"
                                className="input input-bordered w-full rounded-md"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold text-grey-700">Nama Player B</label>
                            <input
                                type="text"
                                name="playerB"
                                placeholder="Masukkan nama Player B"
                                className="input input-bordered w-full rounded-md"
                            />
                        </div>
                    </div>

                    {/* Score Akhir */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner">
                        <span className="font-medium text-grey-700">Pake score akhir gak?</span>
                        <input
                            type="checkbox"
                            className="toggle toggle-secondary"
                            checked={usePoint}
                            onChange={(e) => setUsePoint(e.target.checked)}
                        />
                    </div>
                    {usePoint && (
                        <div className="form-control">
                            <label className="label font-semibold text-grey-700">Poin Akhir</label>
                            <input
                                type="number"
                                name="maxPoint"
                                placeholder="Contoh: 21"
                                className="input input-bordered w-full rounded-md"
                            />
                        </div>
                    )}

                    {/* Timer */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner">
                        <span className="font-medium text-grey-700">Mao pake timer?</span>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={useTimer}
                            onChange={(e) => setUseTimer(e.target.checked)}
                        />
                    </div>
                    {useTimer && (
                        <div className="form-control">
                            <label className="label font-semibold text-grey-700">Durasi Timer (menit)</label>
                            <input
                                type="number"
                                name="duration"
                                placeholder="Contoh: 15"
                                className="input input-bordered w-full rounded-md"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg mt-6 rounded-lg shadow-md hover:scale-105 transition-transform"
                    >
                        🚀 Gaskeun
                    </button>
                </form>
            </div>
        </div>
    )
}
