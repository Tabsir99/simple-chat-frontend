/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: 'storage.googleapis.com',
            protocol: "https",
            pathname: "/simple-chat-cg.appspot.com/**"
        }]
    },
    reactStrictMode: true,
    
};

export default nextConfig;
