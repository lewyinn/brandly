/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'placehold.co'
            },
            {
                hostname: 'ggjesjoxccqodrueggnb.supabase.co'
            },
        ]
    }
};

export default nextConfig;
