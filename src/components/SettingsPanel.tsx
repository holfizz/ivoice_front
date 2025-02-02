'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

declare global {
	interface Window {
		Telegram: {
			WebApp: {
				close: () => void
				sendData: (data: string) => void
				MainButton: {
					text: string
					show: () => void
					hide: () => void
					onClick: (callback: () => void) => void
					offClick: (callback: () => void) => void
					enable: () => void
					disable: () => void
					setParams: (params: {
						text: string
						color: string
						text_color: string
						is_active: boolean
						is_visible: boolean
					}) => void
				}
			}
		}
	}
}

interface VoiceOption {
	id: string
	name: string
	gender: 'male' | 'female'
}

interface SettingsProps {
	speed: number
	selectedVoice: string
	pitch: number
	onSpeedChange: (speed: number) => void
	onPitchChange: (pitch: number) => void
	onVoiceChange: (voiceId: string) => void
	onApply: () => void
}

// Обновляем маппинг голосов с правильными ID для API Сбера
const VOICE_MAP = {
	natalya: 'Nec_24000', // Наталья (24 кГц)
	boris: 'Bys_24000', // Борис (24 кГц)
	marfa: 'May_24000', // Марфа (24 кГц)
	alexandra: 'Ost_24000', // Александра (24 кГц)
	taras: 'Tur_24000', // Тарас (24 кГц)
	sergey: 'Pon_24000', // Сергей (24 кГц)
	kira_eng: 'Kin_24000', // Kira (24 кГц) - English
}

const VOICE_OPTIONS: VoiceOption[] = [
	{ id: 'natalya', name: 'Наталья', gender: 'female' },
	{ id: 'boris', name: 'Борис', gender: 'male' },
	{ id: 'marfa', name: 'Марфа', gender: 'female' },
	{ id: 'alexandra', name: 'Александра', gender: 'female' },
	{ id: 'taras', name: 'Тарас', gender: 'male' },
	{ id: 'sergey', name: 'Сергей', gender: 'male' },
	{ id: 'kira_eng', name: 'Kira (English)', gender: 'female' },
]

// Используем локальный URL для бэкенда
const API_BASE_URL = 'http://localhost:6060'

export function SettingsPanel({
	speed,
	selectedVoice,
	pitch,
	onSpeedChange,
	onPitchChange,
	onVoiceChange,
	onApply,
}: SettingsProps) {
	const [userId, setUserId] = useState<string | null>(null)

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const userIdFromUrl = urlParams.get('userId')
		console.log('Frontend: Got userId from URL:', userIdFromUrl)
		setUserId(userIdFromUrl)
	}, [])

	const handleApply = async () => {
		console.log('Frontend: handleApply called')
		console.log('Frontend: Current selectedVoice:', selectedVoice)
		onApply()

		if (!userId) {
			console.error('Frontend: No userId found in URL')
			return
		}

		try {
			const backendVoiceId =
				VOICE_MAP[selectedVoice as keyof typeof VOICE_MAP] || selectedVoice
			console.log('Frontend: Voice mapping:', {
				originalVoice: selectedVoice,
				mappedVoice: backendVoiceId,
				allMappings: VOICE_MAP,
			})

			console.log('Frontend: Sending settings to API', {
				userId,
				settings: { voiceId: backendVoiceId, speed, pitch },
			})

			const response = await axios.post(
				`${API_BASE_URL}/api/voice/settings?userId=${userId}`,
				{
					settings: {
						voiceId: backendVoiceId,
						speed: speed,
						pitch: pitch,
					},
				}
			)

			console.log('Frontend: API Response:', response.data)
			window.Telegram.WebApp.close()
		} catch (error) {
			console.error('Frontend: Error updating settings:', error)
			if (axios.isAxiosError(error)) {
				console.error('Response data:', error.response?.data)
				console.error('Response status:', error.response?.status)
			}
		}
	}

	return (
		<div className='space-y-6 text-white/80'>
			<div>
				<label className='block text-sm font-medium mb-2'>Скорость речи</label>
				<input
					type='range'
					min='0.5'
					max='2'
					step='0.1'
					value={speed}
					onChange={e => onSpeedChange(parseFloat(e.target.value))}
					className='w-full accent-[#fc90c4]'
				/>
				<div className='flex justify-between text-sm text-white/60'>
					<span>Медленно</span>
					<span>{speed}x</span>
					<span>Быстро</span>
				</div>
			</div>

			<div className='text-sm text-white/60 p-3 bg-white/5 rounded-lg'>
				ℹ️ Настройка высоты голоса появится в следующем обновлении!
			</div>

			<button
				onClick={handleApply}
				className='w-full py-3 bg-[#fc90c4] text-white rounded-full hover:bg-[#fc90c4]/90 transition-all text-lg font-medium'
			>
				Применить
			</button>
		</div>
	)
}
