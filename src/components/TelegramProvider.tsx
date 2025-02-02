'use client'

import Script from 'next/script'
import { createContext, useContext, useEffect, useState } from 'react'

interface TelegramWebApp {
	WebApp: any
}

declare global {
	interface Window {
		Telegram: TelegramWebApp
	}
}

const TelegramContext = createContext<any>(null)

export function TelegramProvider({ children }: { children: React.ReactNode }) {
	const [webApp, setWebApp] = useState<any>(null)

	useEffect(() => {
		const app = window.Telegram?.WebApp
		if (app) {
			app.ready()
			app.expand()
			setWebApp(app)
		}
	}, [])

	return (
		<>
			<Script
				src='https://telegram.org/js/telegram-web-app.js'
				strategy='beforeInteractive'
			/>
			<TelegramContext.Provider value={webApp}>
				{children}
			</TelegramContext.Provider>
		</>
	)
}

export const useTelegram = () => {
	const webApp = useContext(TelegramContext)
	return webApp
}
