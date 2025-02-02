'use client'

import { VoicePreview } from './VoicePreview'

export const AVAILABLE_VOICES = [
	{ id: 'Nec_24000', name: 'Наталья (24 кГц)', gender: 'female' },
	{ id: 'Bys_24000', name: 'Борис (24 кГц)', gender: 'male' },
	{ id: 'May_24000', name: 'Марфа (24 кГц)', gender: 'female' },
	{ id: 'Tur_24000', name: 'Тарас (24 кГц)', gender: 'male' },
	{ id: 'Ost_24000', name: 'Александра (24 кГц)', gender: 'female' },
	{ id: 'Pon_24000', name: 'Сергей (24 кГц)', gender: 'male' },
]

interface VoiceCardProps {
	id: string
	name: string
	preview: string
	gender: 'male' | 'female'
	onSelect: () => void
	isOtherPlaying?: boolean
	isSelected?: boolean
}

export function VoiceCard({
	id,
	name,
	preview,
	gender,
	onSelect,
	isOtherPlaying,
	isSelected,
}: VoiceCardProps) {
	return (
		<div
			className={`p-4 bg-black/20 backdrop-blur-sm rounded-3xl hover:bg-black/30 transition-all border relative ${
				isSelected ? 'border-[#fc90c4]' : 'border-white/5'
			}`}
		>
			{/* Кнопка выбора */}
			<button
				onClick={onSelect}
				className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full transition-all md:static md:px-6 md:w-auto ${
					isSelected
						? 'bg-[#fc90c4] text-white'
						: 'bg-[#fc90c4]/20 text-[#fc90c4]'
				}`}
			>
				<span className='material-icons block md:hidden'>
					{isSelected ? 'check' : 'add'}
				</span>
				<span className='hidden md:block'>Выбрать</span>
			</button>

			{/* Информация о голосе */}
			<div className='mb-4 md:flex md:items-center md:justify-between'>
				<div>
					<h3 className='font-medium text-white/90'>{name}</h3>
					<p className='text-sm text-[#fc90c4]/70'>
						{gender === 'male' ? 'Мужской' : 'Женский'} голос
					</p>
				</div>
			</div>

			{/* Плеер */}
			<VoicePreview src={preview} isOtherPlaying={isOtherPlaying} id={id} />
		</div>
	)
}
