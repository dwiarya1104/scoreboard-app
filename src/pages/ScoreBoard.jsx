import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Timer } from '../components/score/Timer'
import { TeamName } from '../components/score/TeamName'
import { Score } from '../components/score/Score'
import { SetPoint } from '../components/score/SetPoint'
import { FaPlay } from 'react-icons/fa'
import { HiSwitchHorizontal } from 'react-icons/hi'

const MySwal = withReactContent(Swal)

export const ScoreBoard = () => {
    const [teamAName, setTeamAName] = useState("Team 1")
    const [teamBName, setTeamBName] = useState("Team 2")
    const [teamAScore, setTeamAScore] = useState(0)
    const [teamBScore, setTeamBScore] = useState(0)
    const [setPointA, setSetPointA] = useState(0)
    const [setPointB, setSetPointB] = useState(0)
    const [running, setRunning] = useState(false)
    const [showScoreboard, setShowScoreboard] = useState(false)

    const [isMobile, setIsMobile] = useState(false)

    // deteksi mobile
    useEffect(() => {
        const mobileCheck = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        setIsMobile(mobileCheck)
    }, [])

    // jika keluar fullscreen → balik ke info screen (mobile)
    useEffect(() => {
        const handleFsChange = () => {
            if (!document.fullscreenElement) {
                if (isMobile) {
                    // Mobile → balik ke info screen
                    setShowScoreboard(false)
                    setRunning(false)
                } else {
                    // Desktop → munculin alert ulang
                    MySwal.fire({
                        title: '🖥️ Mode Landscape Fullscreen',
                        text: 'Untuk melanjutkan, aplikasi ini memerlukan mode fullscreen.',
                        icon: 'warning',
                        confirmButtonText: 'OK',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(async () => {
                        await enterFullscreen()
                        setShowScoreboard(true)
                    })
                }
            }
        }
        document.addEventListener("fullscreenchange", handleFsChange)
        return () => document.removeEventListener("fullscreenchange", handleFsChange)
    }, [isMobile])

    // keyboard desktop
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!running) return
            switch (e.key) {
                case "w": case "W":
                    setTeamAScore(prev => prev + 1)
                    break
                case "s": case "S":
                    setTeamAScore(prev => (prev > 0 ? prev - 1 : 0))
                    break
                case "ArrowUp":
                    setTeamBScore(prev => prev + 1)
                    break
                case "ArrowDown":
                    setTeamBScore(prev => (prev > 0 ? prev - 1 : 0))
                    break
                default:
                    break
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [running])

    const enterFullscreen = async () => {
        const elem = document.documentElement
        try {
            if (elem.requestFullscreen) {
                await elem.requestFullscreen()
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen()
            }
            if ("orientation" in screen) {
                try {
                    await screen.orientation.lock("landscape")
                } catch (err) {
                    console.warn("Orientation lock gagal:", err)
                }
            }
        } catch (err) {
            console.warn("Fullscreen gagal:", err)
        }
    }

    const handleStartMobile = async () => {
        await enterFullscreen()
        setShowScoreboard(true)
    }

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
        setRunning(!running)
    }

    // 🚨 Desktop: tampilkan alert saat pertama kali buka
    useEffect(() => {
        if (!isMobile && !showScoreboard) {
            MySwal.fire({
                title: '🖥️ Mode Landscape Fullscreen',
                text: 'Aplikasi ini akan berjalan dalam mode landscape fullscreen. Klik OK untuk melanjutkan.',
                icon: 'info',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(async () => {
                await enterFullscreen()
                setShowScoreboard(true)
            })
        }
    }, [isMobile, showScoreboard])

    // 📱 Mobile info screen
    if (isMobile && !showScoreboard) {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen bg-base-200 text-center p-5">
                <h1 className="text-2xl font-bold mb-5">📱 Mode Landscape Diperlukan</h1>
                <p className="mb-6">
                    Aplikasi ini hanya bisa dijalankan dalam posisi layar <b>landscape fullscreen</b>.
                </p>
                <button
                    className="btn btn-primary btn-lg rounded-lg"
                    onClick={handleStartMobile}
                >
                    Masuk ke Mode Landscape
                </button>
            </div>
        )
    }

    // 🖥️ Desktop (setelah OK) atau Mobile setelah fullscreen
    if (!showScoreboard) {
        return <div className="w-screen h-screen bg-black" /> // placeholder sebelum alert ditutup
    }

    return (
        <div className='flex flex-col items-center justify-center w-full h-screen overflow-hidden px-10'>
            <Timer running={running} />
            <div className='flex gap-6 md:mt-10 mt-3 w-full'>
                {/* Team A */}
                <div className='flex flex-col gap-3 w-1/2'>
                    <TeamName value={teamAName} onChange={setTeamAName} disabled={running} />
                    <Score value={teamAScore} onChange={setTeamAScore} running={running} />
                </div>

                {/* Tengah */}
                <div className='flex flex-col gap-5 justify-between mt-[60px] items-center'>
                    <div className='flex flex-row gap-5'>
                        <SetPoint value={setPointA} />
                        <SetPoint value={setPointB} />
                    </div>
                    <p className='md:text-7xl text-2xl'>VS</p>
                    <button className='btn btn-md rounded-md' onClick={handleSwapTeams}>
                        <HiSwitchHorizontal /> Tukar
                    </button>
                </div>

                {/* Team B */}
                <div className='flex flex-col gap-3 w-1/2'>
                    <TeamName value={teamBName} onChange={setTeamBName} disabled={running} />
                    <Score value={teamBScore} onChange={setTeamBScore} running={running} />
                </div>
            </div>

            <button
                className='btn md:btn-lg btn-md w-full btn-primary rounded-md md:mt-10 mt-5'
                onClick={handleToggleMatch}
            >
                <FaPlay className='mr-3' /> {running ? "Pause" : "Mulai Pertandingan"}
            </button>
        </div>
    )
}
