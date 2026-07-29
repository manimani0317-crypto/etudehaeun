/**
 * PostCSS Configuration
 *
 * Tailwind CSS v4 는 Next.js 에서 `@tailwindcss/postcss` 플러그인으로 동작합니다.
 * (Vite 전용이던 `@tailwindcss/vite` 를 대체)
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
