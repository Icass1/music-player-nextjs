/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.music.rockhosting.org',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

// module.exports = {
//   }

export default nextConfig;
