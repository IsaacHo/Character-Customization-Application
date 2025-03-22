module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 王者荣耀风格的主色调
        'kol-blue': '#00a8ff',
        'kol-gold': '#ffb400',
        'kol-red': '#ff4757',
        
        // CS:GO风格的暗色调
        'cs-dark': '#0f1923',
        'cs-medium': '#1a2a35',
        'cs-light': '#253540',
        
        // 文本颜色
        'text-primary': '#ffffff',
        'text-secondary': '#b3c3d3',
        
        // 渐变色起始点
        'gradient-start': '#00a8ff',
        'gradient-end': '#36d1dc',
        
        // 按钮和高亮色
        'highlight': '#ff9f43',
      },
      fontFamily: {
        game: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'game': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 15px rgba(0, 168, 255, 0.5)',
        'button': '0 5px 15px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 168, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 168, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}; 