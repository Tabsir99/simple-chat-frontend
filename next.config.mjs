/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: 'example.com',
            protocol: "https",
            pathname: "/**"
        }]
    },
    reactStrictMode: true,

};

export default nextConfig;
