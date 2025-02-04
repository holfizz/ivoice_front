'use client'

import { useParams } from 'next/navigation'
import Home from '../page'

export default function UserPage() {
	const params = useParams()
	console.log('User ID from path:', params.userId)

	return <Home />
}
