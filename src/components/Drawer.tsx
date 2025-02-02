'use client'

import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import { useState } from 'react'

interface DrawerProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
}

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [dragY, setDragY] = useState(0)

	const handleDragStart = () => {
		setIsDragging(true)
	}

	const handleDrag = (_: any, info: PanInfo) => {
		setDragY(Math.max(0, info.offset.y))
	}

	const handleDragEnd = (_: any, info: PanInfo) => {
		setIsDragging(false)
		setDragY(0)
		if (info.offset.y > 50) {
			onClose()
		}
	}

	return (
		<AnimatePresence>
			{(isOpen || dragY > 0) && (
				<>
					{/* Затемнение фона */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.5 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 bg-black'
						onClick={onClose}
					/>

					{/* Drawer */}
					<motion.div
						drag='y'
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={0.2}
						onDragStart={handleDragStart}
						onDrag={handleDrag}
						onDragEnd={handleDragEnd}
						initial={{ y: '100%' }}
						animate={{ y: isDragging ? dragY : 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', damping: 20 }}
						className='fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/5 rounded-t-3xl'
					>
						{/* Полоска для перетаскивания */}
						<div className='w-12 h-1 bg-white/20 rounded-full mx-auto my-3 cursor-grab active:cursor-grabbing' />

						{/* Содержимое */}
						<div className='max-w-2xl mx-auto px-6 pb-6'>{children}</div>
					</motion.div>

					{/* Мини-версия drawer'а */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: isOpen ? 0 : 1 }}
						exit={{ opacity: 0 }}
						className='fixed bottom-0 left-0 right-0 p-2 cursor-pointer'
						onClick={() => !isOpen && onClose()}
					>
						<div className='max-w-2xl mx-auto'>
							<div className='bg-black/90 backdrop-blur-lg rounded-2xl p-2 border border-white/5'>
								<div className='w-12 h-1 bg-white/20 rounded-full mx-auto' />
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
