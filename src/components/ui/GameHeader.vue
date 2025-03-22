<template>
  <div class="header-bar">
    <div class="logo">{{ title }}</div>
    <div class="nav-buttons">
      <game-button 
        v-for="(item, index) in navItems" 
        :key="index"
        type="nav"
        :class="{ active: activeIndex === index }"
        @click="$emit('nav-change', index)"
      >
        {{ item }}
      </game-button>
    </div>
  </div>
</template>

<script>
import GameButton from './GameButton.vue';

export default {
  name: 'GameHeader',
  components: {
    GameButton
  },
  props: {
    title: {
      type: String,
      default: '游戏菜单'
    },
    navItems: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: rgba(15, 25, 35, 0.9);
  border-bottom: 1px solid rgba(0, 168, 255, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #00a8ff;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
  position: relative;
}

.logo::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 60%;
  height: 2px;
  background: linear-gradient(to right, #00a8ff, transparent);
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .header-bar {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-buttons {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 