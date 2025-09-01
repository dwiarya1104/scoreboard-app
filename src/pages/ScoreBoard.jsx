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
    const [ready, setReady] = useState(false)

    // 🚫 Matikan pull-to-refresh di mobile
    useEffect(() => {
        const preventPullToRefresh = (e) => {
            if (e.touches.length !== 1) return
            if (window.scrollY === 0 && e.touches[0].clientY > 50) {
                e.preventDefault()
            }
        }
        document.addEventListener("touchmove", preventPullToRefresh, { passive: false })
        return () => document.removeEventListener("touchmove", preventPullToRefresh)
    }, [])

    // 🚫 Disable scroll total
    useEffect(() => {
        document.documentElement.style.height = "100%"
        document.body.style.height = "100%"
        document.body.style.margin = "0"
        document.body.style.overflow = "hidden"
    }, [])

    // 🚨 Popup wajib saat pertama kali buka (mobile & desktop)
    useEffect(() => {
        if (!ready) {
            MySwal.fire({
                title: '📺 Mode Landscape Fullscreen',
                text: 'Aplikasi ini akan berjalan dalam mode landscape fullscreen. Klik OK untuk melanjutkan.',
                icon: 'info',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true
            }).then(async () => {
                await enterFullscreen()
                setReady(true)
            })
        }
    }, [ready])

    // ⌨️ Keyboard shortcuts (PC only, hanya kalau running)
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

    const handleSwapTeams = () => {
        if (running) return
        setTeamAName(teamBName)
        setTeamBName(teamAName)
        setTeamAScore(teamBScore)
        setTeamBScore(teamAScore)
        setSetPointA(setPointB)
        setSetPointB(setPointA)
    }

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
                    console.warn("Orientation lock not supported:", err)
                }
            }
        } catch (err) {
            console.warn("Fullscreen API gagal, fallback pakai CSS:", err)
            document.body.style.overflow = "hidden"
            document.body.style.height = "100vh"
        }
    }

    const handleToggleMatch = async () => {
        const newRunning = !running
        setRunning(newRunning)

        if (newRunning) {
            await enterFullscreen()
        }
        // ❌ Jangan pernah exit fullscreen saat pause
    }

    // 🚧 Jangan render apapun sebelum user klik OK
    if (!ready) {
        return <div className="w-full h-screen bg-black" />
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
