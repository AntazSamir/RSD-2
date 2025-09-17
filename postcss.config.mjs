/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      // Enable optimizations
      optimize: true,
      cache: true,
    },
  },
}

export default config