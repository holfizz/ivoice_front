declare global {
	interface Window {
		Telegram: TelegramWebApp
	}
}

interface TelegramWebApp {
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
				text?: string
				color?: string
				text_color?: string
				is_active?: boolean
				is_visible?: boolean
			}) => void
		}
	}
}

export {}
