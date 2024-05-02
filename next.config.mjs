/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'music.rockhosting.org',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

// module.exports = {
//   }

export default nextConfig;
