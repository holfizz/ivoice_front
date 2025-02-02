export default {
	async fetch(request: Request) {
		try {
			const url = new URL(request.url)

			// Перенаправляем запросы на локальный Next.js сервер
			const response = await fetch(
				`http://localhost:3000${url.pathname}${url.search}`,
				{
					method: request.method,
					headers: request.headers,
					body: request.body,
				}
			)

			return response
		} catch (error) {
			return new Response('Error proxying request', { status: 500 })
		}
	},
}
