import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Timer } from '../components/score/Timer'
import { TeamName } from '../components/score/TeamName'
import { Score } from '../components/score/Score'
import { SetPoint } from '../components/score/SetPoint'
import { FaPlay, FaRedo, FaStop } from 'react-icons/fa'
import { HiSwitchHorizontal } from 'react-icons/hi'
import { MdOutlineReplay } from 'react-icons/md'

const MySwal = withReactContent(Swal)

export const ScoreBoard = ({ config, onExit }) => {
    const [teamAName, setTeamAName] = useState(config.playerA || "Team 1")
    const [teamBName, setTeamBName] = useState(config.playerB || "Team 2")
    const [teamAScore, setTeamAScore] = useState(0)
    const [teamBScore, setTeamBScore] = useState(0)
    const [setPointA, setSetPointA] = useState(0)
    const [setPointB, setSetPointB] = useState(0)
    const [running, setRunning] = useState(false)
    const [setFinished, setSetFinished] = useState(false)
    const [pausedByExit, setPausedByExit] = useState(false) // overlay jeda

    const maxPoint = config.maxPoint || 21
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)

    // masuk fullscreen otomatis di mobile
    useEffect(() => {
        if (isMobile) requestFullscreen()

        const handleFsChange = () => {
            if (isMobile && !document.fullscreenElement) {
                setRunning(false)
                setPausedByExit(true)
            }
        }

        document.addEventListener("fullscreenchange", handleFsChange)
        return () => document.removeEventListener("fullscreenchange", handleFsChange)
    }, [])

    const requestFullscreen = () => {
        const el = document.documentElement
        if (el.requestFullscreen) el.requestFullscreen()
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch(() => { })
        }
    }

    // keyboard desktop
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!running || setFinished) return
            switch (e.key) {
                case "w": case "W": setTeamAScore(prev => prev + 1); break
                case "s": case "S": setTeamAScore(prev => (prev > 0 ? prev - 1 : 0)); break
                case "ArrowUp": setTeamBScore(prev => prev + 1); break
                case "ArrowDown": setTeamBScore(prev => (prev > 0 ? prev - 1 : 0)); break
                default: break
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [running, setFinished])

    // cek kemenangan otomatis
    useEffect(() => {
        if (!config.usePoint || !maxPoint) return
        if (!running || setFinished) return

        const winA = teamAScore >= maxPoint && teamAScore - teamBScore >= 2
        const winB = teamBScore >= maxPoint && teamBScore - teamAScore >= 2

        if (winA || winB) {
            if (winA) setSetPointA(prev => prev + 1)
            if (winB) setSetPointB(prev => prev + 1)
            setRunning(false)
            setSetFinished(true)
        }
    }, [teamAScore, teamBScore, maxPoint, running, setFinished, config.usePoint])

    const handleSwapTeams = () => {
        if (running) return
        setTeamAName(teamBName)
        setTeamBName(teamAName)
        setTeamAScore(teamBScore)
        setTeamBScore(teamAScore)
        setSetPointA(setPointB)
        setSetPointB(setPointA)
    }

    const handleToggleMatch = () => {
        if (!setFinished) setRunning(!running)
    }

    const handleNextSet = () => {
        setTeamAScore(0)
        setTeamBScore(0)
        setSetFinished(false)
        setRunning(false)
    }

    const handleManualEndSet = () => {
        if (teamAScore === teamBScore) {
            MySwal.fire({
                title: "Skor Seri!",
                text: "Pilih tim yang jadi pemenang set:",
                showCancelButton: true,
                confirmButtonText: teamAName,
                cancelButtonText: teamBName,
                reverseButtons: true,
            }).then(result => {
                if (result.isConfirmed) setSetPointA(prev => prev + 1)
                else if (result.dismiss === Swal.DismissReason.cancel) setSetPointB(prev => prev + 1)
                setRunning(false)
                setSetFinished(true)
            })
        } else {
            if (teamAScore > teamBScore) setSetPointA(prev => prev + 1)
            else setSetPointB(prev => prev + 1)
            setRunning(false)
            setSetFinished(true)
        }
    }

    const handleResetMatch = () => {
        MySwal.fire({
            title: "Reset Pertandingan?",
            text: "Semua skor & nama akan direset.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Reset",
            cancelButtonText: "Batal"
        }).then(result => {
            if (result.isConfirmed) {
                setTeamAName("")
                setTeamBName("")
                setTeamAScore(0)
                setTeamBScore(0)
                setSetPointA(0)
                setSetPointB(0)
                setRunning(false)
                setSetFinished(false)
            }
        })
    }

    if (pausedByExit) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-900 text-white text-center p-6">
                <h1 className="text-2xl font-bold mb-6">⏸️ Pertandingan Dijeda</h1>
                {/* <p className="text-lg mb-8">Kamu keluar dari fullscreen. Pilih aksi:</p> */}
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <button
                        className="btn btn-primary btn-md px-8 py-4 rounded-xl shadow-lg"
                        onClick={() => {
                            requestFullscreen()
                            setPausedByExit(false)
                        }}
                    >
                        Lanjutkan
                    </button>
                    <button
                        className="btn btn-error btn-md px-8 py-4 rounded-xl shadow-lg"
                        onClick={onExit}
                    >
                        Kembali ke Form
                    </button>
                </div>
            </div>
        )
    }

    return (
        // <div className='flex flex-col items-center justify-center w-full h-screen overflow-hidden px-6 bg-gradient-to-br from-blue-100 via-white to-blue-50'>
        <div className='flex flex-col items-center justify-center w-full h-screen overflow-hidden px-6 bg-[#17153B]'>
            <div className='flex gap-6 md:mt-10 mt-3 w-full'>
                <div className='flex flex-col gap-3 w-1/2'>
                    <TeamName value={teamAName} onChange={setTeamAName} disabled={running || setFinished} />
                    <Score value={teamAScore} onChange={setTeamAScore} running={running && !setFinished} />
                </div>

                <div className={`flex flex-col gap-5 justify-between ${config.useTimer ? '-mt-2' : ''}  items-center`}>
                    {config.useTimer && <Timer running={running} duration={config.duration} />}
                    <div className='flex flex-row gap-5'>
                        <SetPoint value={setPointA} />
                        <SetPoint value={setPointB} />
                    </div>
                    <p className='md:text-7xl text-6xl font-extrabold text-white'>VS</p>
                    <button className='btn btn-md rounded-md text-xs' onClick={handleSwapTeams}>
                        <HiSwitchHorizontal /> Tukeran
                    </button>
                </div>

                <div className='flex flex-col gap-3 w-1/2'>
                    <TeamName value={teamBName} onChange={setTeamBName} disabled={running || setFinished} />
                    <Score value={teamBScore} onChange={setTeamBScore} running={running && !setFinished} />
                </div>
            </div>

            <div className="flex gap-4 w-full mt-6">
                {setFinished ? (
                    <button className='btn bg-[#C8ACD6] w-1/2 rounded-md border-none' onClick={handleNextSet}>
                        <FaPlay className='mr-2' /> Gas Next Game
                    </button>
                ) : (
                    <button className='btn bg-[#C8ACD6] w-1/2 rounded-md border-none' onClick={handleToggleMatch}>
                        <FaPlay className='mr-2' /> {running ? "Jeda Bentar" : "Gaskeun Cuks"}
                    </button>
                )}

                {!config.usePoint && !setFinished && teamAScore != 0 && teamBScore != 0 && (
                    <button className='btn bg-[#C8ACD6] w-1/2 rounded-md border-none' onClick={handleManualEndSet}>
                        <FaStop className='mr-2' /> Udahan Dah
                    </button>
                )}

                <button className='btn bg-[#C8ACD6] w-1/2 rounded-md border-none' onClick={handleResetMatch}>
                    <FaRedo className='mr-2' /> Ulangin Bang
                </button>
            </div>
        </div>
    )
}
