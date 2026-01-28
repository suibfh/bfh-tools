/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {remotePatterns: [{protocol: 'https',hostname: 'rsc.bravefrontierheroes.com'},{protocol: 'https',hostname: 'core.bravefrontierheroes.com'}]}
};
module.exports = nextConfig;
