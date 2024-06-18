/** @type {import('next').NextConfig} */
const nextConfig = {
	// disable strict mode for now
	reactStrictMode: false,
	webpack: config => {
		config.externals.push('pino-pretty', 'lokijs', 'encoding')
		return config
	}
};

export default nextConfig;
