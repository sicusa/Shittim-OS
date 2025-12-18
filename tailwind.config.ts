import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // MomoTalk 粉色主题
        primary: {
          DEFAULT: '#FF8FAB',      // 主粉色
          light: '#FFB3C6',        // 浅粉
          dark: '#E8729A',         // 深粉
          darker: '#D25A85',       // 更深粉
        },
        secondary: {
          DEFAULT: '#FFF5F7',      // 淡粉背景
          dark: '#FFE4EC',         // 稍深背景
        },
        accent: {
          DEFAULT: '#FFD93D',      // 金黄点缀
          light: '#FFE566',
        },
        ba: {
          // Blue Archive 专属色
          blue: '#4A9EFF',         // BA 蓝
          pink: '#FF8FAB',         // MomoTalk 粉
          lightPink: '#FFB6C8',    // 浅粉
          yellow: '#FFD93D',       // 金黄
          cream: '#FFF8F0',        // 奶油白
        },
        momo: {
          // MomoTalk 专属色
          bg: '#FFF5F7',           // 背景色
          bubble: '#FFFFFF',       // 气泡白
          online: '#4ADE80',       // 在线绿
          unread: '#FF6B8A',       // 未读红粉
        },
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'typing': 'typing 1s steps(20) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        typing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
