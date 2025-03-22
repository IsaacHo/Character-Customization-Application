<template>
  <button 
    class="game-btn" 
    :class="[type]" 
    @click="$emit('click')"
  >
    <span class="btn-glow"></span>
    <span class="btn-text"><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'GameButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'nav'].includes(value)
    }
  }
}
</script>

<style scoped>
.game-btn {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  background: none;
  padding: 0 20px;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  transition: all 0.3s ease;
  z-index: 0;
}

.primary .btn-glow {
  background: linear-gradient(45deg, #00a8ff, #36d1dc);
  box-shadow: 0 0 20px rgba(0, 168, 255, 0.5);
}

.secondary .btn-glow {
  background: linear-gradient(45deg, #ff9f43, #fbc531);
  box-shadow: 0 0 20px rgba(255, 159, 67, 0.5);
  opacity: 0.2;
}

.secondary:hover .btn-glow {
  opacity: 1;
}

.nav {
  height: auto;
  background-color: #253540;
  color: #b3c3d3;
  border: 1px solid rgba(0, 168, 255, 0.2);
  padding: 8px 16px;
  border-radius: 4px;
}

.nav.active {
  background-color: rgba(0, 168, 255, 0.2);
  color: #00a8ff;
  border-color: #00a8ff;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
}

.btn-text {
  position: relative;
  z-index: 1;
  color: #ffffff;
  transition: all 0.3s ease;
}

.game-btn:hover {
  transform: translateY(-3px);
}

.game-btn:active {
  transform: translateY(0);
}

.primary:hover .btn-glow {
  filter: brightness(1.2);
}
</style> 