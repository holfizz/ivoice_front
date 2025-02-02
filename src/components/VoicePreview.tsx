'use client'

import { useEffect, useRef, useState } from 'react'

interface VoicePreviewProps {
	src: string
	onPlay?: () => void
	onPause?: () => void
	isOtherPlaying?: boolean
	id: string
}

// Глобальный объект для отслеживания всех плееров
const players = new Map<
	string,
	{
		reset: () => void
	}
>()

let currentPlayingAudio: { element: HTMLAudioElement; id: string } | null = null

export function VoicePreview({
	src,
	onPlay,
	onPause,
	isOtherPlaying,
	id,
}: VoicePreviewProps) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [error, setError] = useState<string | null>(null)
	const audioRef = useRef<HTMLAudioElement>(null)

	// Регистрируем плеер при монтировании
	useEffect(() => {
		players.set(id, { reset: handleReset })
		return () => {
			players.delete(id)
		}
	}, [id])

	// Сбрасываем состояние при воспроизведении другого аудио
	useEffect(() => {
		if (isOtherPlaying) {
			handleReset()
		}
	}, [isOtherPlaying])

	const handleReset = () => {
		const audio = audioRef.current
		if (!audio) return

		audio.pause()
		audio.currentTime = 0
		setProgress(0)
		setIsPlaying(false)
		onPause?.()
	}

	const handleTimeUpdate = () => {
		const audio = audioRef.current
		if (!audio) return
		setProgress((audio.currentTime / audio.duration) * 100)
	}

	const handleError = (e: ErrorEvent) => {
		console.error('Audio error:', e)
		setError('Ошибка загрузки аудио')
	}

	const handleEnded = () => {
		handleReset()
		currentPlayingAudio = null
	}

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		audio.addEventListener('timeupdate', handleTimeUpdate)
		audio.addEventListener('ended', handleEnded)
		audio.addEventListener('error', handleError as EventListener)

		return () => {
			audio.removeEventListener('timeupdate', handleTimeUpdate)
			audio.removeEventListener('ended', handleEnded)
			audio.removeEventListener('error', handleError as EventListener)
		}
	}, [src])

	const togglePlay = async () => {
		const audio = audioRef.current
		if (!audio) return

		try {
			if (isPlaying) {
				handleReset()
				currentPlayingAudio = null
			} else {
				// Останавливаем все другие плееры
				players.forEach((player, playerId) => {
					if (playerId !== id) {
						player.reset()
					}
				})

				await audio.play()
				currentPlayingAudio = { element: audio, id }
				setIsPlaying(true)
				onPlay?.()
			}
		} catch (err) {
			console.error('Playback error:', err)
			setError('Ошибка воспроизведения')
			handleReset()
		}
	}

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const audio = audioRef.current
		if (!audio) return

		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const percentage = (x / rect.width) * 100
		const newTime = (percentage / 100) * audio.duration
		audio.currentTime = newTime
		setProgress(percentage)
	}

	// Очищаем все при размонтировании
	useEffect(() => {
		return () => {
			handleReset()
			players.delete(id)
		}
	}, [])

	return (
		<div className='flex items-center gap-4 bg-black/10 backdrop-blur-sm p-3 rounded-2xl'>
			<button
				onClick={togglePlay}
				className='w-10 h-10 flex items-center justify-center bg-[#fc90c4]/20 text-[#fc90c4] rounded-full hover:bg-[#fc90c4]/30 transition-all'
				disabled={!!error}
			>
				<span className='material-icons'>
					{isPlaying ? 'pause' : 'play_arrow'}
				</span>
			</button>

			<div className='flex-1 relative h-10'>
				{error ? (
					<div className='text-red-500 text-sm'>{error}</div>
				) : (
					<div
						className='absolute inset-0 flex items-center cursor-pointer'
						onClick={handleProgressClick}
					>
						<div className='h-2 w-full bg-black/20 rounded-full overflow-hidden'>
							<div
								className='h-full bg-[#fc90c4]/50 rounded-full transition-all'
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				)}
			</div>

			<audio
				ref={audioRef}
				src={src}
				preload='metadata'
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleEnded}
			/>
		</div>
	)
}
