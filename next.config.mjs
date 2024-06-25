/** @type {import('next').NextConfig} */
const nextConfig = {
	// disable strict mode for now
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.discordapp.com',
				port: '',
				pathname: '/avatars/**',
			},
		],
	},
	reactStrictMode: false,
	webpack: config => {
		config.externals.push('pino-pretty', 'lokijs', 'encoding')
		return config
	}
};

export default nextConfig;
