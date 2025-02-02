/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*',
					},
				],
			},
		]
	},
	webpack: config => {
		config.module.rules.push({
			test: /\.(wav|mp3)$/,
			type: 'asset/resource',
		})
		config.externals = [...(config.externals || []), 'canvas', 'jsdom']
		return config
	},
}

module.exports = nextConfig
