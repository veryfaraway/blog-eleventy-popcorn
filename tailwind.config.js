/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{njk,md,html,js}",
    "./.eleventy.js",
  ],
  theme: {
    extend: {
      colors: {
        // 팔레트 10: Tech Startup (기본)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // 메인 블루
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b', // 메인 옐로우
          500: '#d97706',
          600: '#b45309',
        },
        tech: {
          purple: '#8B5CF6', // 보라
          green: '#10B981',  // 초록
          orange: '#F97316', // 오렌지
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.dark.700'),
            maxWidth: 'none',
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.primary.700'),
                textDecoration: 'underline',
              },
            },
            h1: {
              color: theme('colors.dark.900'),
              fontWeight: '800',
            },
            h2: {
              color: theme('colors.dark.900'),
              fontWeight: '700',
            },
            h3: {
              color: theme('colors.dark.900'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.dark.800'),
            },
            code: {
              color: theme('colors.primary.700'),
              backgroundColor: theme('colors.primary.50'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.dark.900'),
              color: theme('colors.dark.50'),
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.500'),
              color: theme('colors.dark.700'),
              fontStyle: 'italic',
            },
            strong: {
              color: theme('colors.dark.900'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
