'use client'

import { Drawer } from '@/components/Drawer'
import { SettingsPanel } from '@/components/SettingsPanel'
import { useTelegram } from '@/components/TelegramProvider'
import { VoiceCard } from '@/components/VoiceCard'
import { useRef, useState } from 'react'

interface Voice {
	id: string
	name: string
	preview: string
	gender: 'male' | 'female'
}

interface VoiceGroup {
	title: string
	voices: Voice[]
}

const voiceGroups: VoiceGroup[] = [
	{
		title: 'Русский язык',
		voices: [
			{
				id: 'natalya',
				name: 'Наталья',
				preview: '/assets/natalya.wav',
				gender: 'female',
			},
			{
				id: 'boris',
				name: 'Борис',
				preview: '/assets/boris.wav',
				gender: 'male',
			},
			{
				id: 'alexandra',
				name: 'Александра',
				preview: '/assets/alexandra.wav',
				gender: 'female',
			},
			{
				id: 'sergey',
				name: 'Сергей',
				preview: '/assets/sergey.wav',
				gender: 'male',
			},
			{
				id: 'marfa',
				name: 'Марфа',
				preview: '/assets/marfa.wav',
				gender: 'female',
			},
			{
				id: 'taras',
				name: 'Тарас',
				preview: '/assets/taras.wav',
				gender: 'male',
			},
		],
	},
	{
		title: 'English',
		voices: [
			{
				id: 'kira_eng',
				name: 'Kira',
				preview: '/assets/kira_eng.wav',
				gender: 'female',
			},
		],
	},
]

export default function Home() {
	const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const [startY, setStartY] = useState(0)
	const [currentY, setCurrentY] = useState(0)
	const drawerRef = useRef<HTMLDivElement>(null)
	const [speed, setSpeed] = useState(1.0)
	const [pitch, setPitch] = useState(1.0)
	const [volume, setVolume] = useState(1.0)
	const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

	const webApp = useTelegram()

	const handleTouchStart = (e: React.TouchEvent) => {
		setStartY(e.touches[0].clientY)
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		setCurrentY(e.touches[0].clientY)
	}

	const handleTouchEnd = () => {
		const diff = currentY - startY
		if (diff > 50) {
			// Свайп вниз - закрываем
			setIsDrawerOpen(false)
			setTimeout(() => setSelectedVoice(null), 300)
		} else if (diff < -50) {
			// Свайп вверх - открываем полностью
			setIsDrawerOpen(true)
		}
		setStartY(0)
		setCurrentY(0)
	}

	const handleVoiceSelect = (voiceId: string) => {
		setSelectedVoice(voiceId)
		setIsDrawerOpen(true)
	}

	const handleDrawerClose = () => {
		setIsDrawerOpen(false)
		setTimeout(() => {
			setSelectedVoice(null)
		}, 300)
	}

	const translateY = currentY && startY ? currentY - startY : 0
	const drawerHeight = drawerRef.current?.offsetHeight || 0

	const handleApply = () => {
		if (webApp) {
			webApp.sendData(
				JSON.stringify({
					voiceId: selectedVoice,
					speed,
					pitch,
					volume,
				})
			)
			webApp.close()
		}
	}

	return (
		<main className='min-h-screen bg-[#040404] bg-gradient-to-b from-zinc-900/50 to-[#040404] p-4'>
			<div className='max-w-2xl mx-auto'>
				<h1 className='text-2xl font-semibold mb-6 text-white/90'>
					Выберите голос
				</h1>

				<div className='space-y-8 pb-24'>
					{voiceGroups.map(group => (
						<div key={group.title}>
							<h2 className='text-[#fc90c4] text-lg font-medium mb-4'>
								{group.title}
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{group.voices.map(voice => (
									<VoiceCard
										key={voice.id}
										{...voice}
										isSelected={selectedVoice === voice.id}
										onSelect={() => handleVoiceSelect(voice.id)}
										isOtherPlaying={
											currentlyPlaying !== null && currentlyPlaying !== voice.id
										}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			<Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
				<SettingsPanel
					speed={speed}
					selectedVoice={selectedVoice || ''}
					pitch={pitch}
					onSpeedChange={setSpeed}
					onPitchChange={setPitch}
					onVoiceChange={setSelectedVoice}
					onApply={handleApply}
				/>
			</Drawer>
		</main>
	)
}
