'use client'

export function Wave({ isPlaying }: { isPlaying: boolean }) {
	return (
		<div className='flex gap-0.5 h-8 items-center'>
			{[...Array(30)].map((_, i) => (
				<div
					key={i}
					className={`w-1 bg-blue-500/80 rounded-full transition-all duration-100 ${
						isPlaying ? 'animate-wave' : 'h-1'
					}`}
					style={{
						animationDelay: `${i * 0.05}s`,
						height: isPlaying ? `${Math.random() * 24 + 4}px` : '4px',
					}}
				/>
			))}
		</div>
	)
}
