<template>
  <button class="preset-card" @click="$emit('click')">
    <div :class="['preset-icon', iconClass]"></div>
    <span>{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'GameCard',
  props: {
    label: {
      type: String,
      required: true
    },
    iconClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.preset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(26, 42, 53, 0.7);
  border: 1px solid rgba(0, 168, 255, 0.2);
  border-radius: 6px;
  padding: 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.preset-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, rgba(0, 168, 255, 0.1), transparent);
  opacity: 0;
  transition: all 0.3s ease;
}

.preset-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-color: #00a8ff;
}

.preset-card:hover::after {
  opacity: 1;
}

.preset-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 8px;
  background-color: #253540;
  border: 2px solid rgba(0, 168, 255, 0.3);
  position: relative;
}

.round-face {
  border-radius: 50%;
  background-image: radial-gradient(circle, rgba(0, 168, 255, 0.2), transparent);
}

.long-face {
  border-radius: 40% / 50%;
  background-image: radial-gradient(ellipse, rgba(0, 168, 255, 0.2), transparent);
}

.square-face {
  border-radius: 10px;
  background-image: radial-gradient(ellipse, rgba(0, 168, 255, 0.2), transparent);
}

.preset-card span {
  font-size: 14px;
  font-weight: 500;
  color: #b3c3d3;
  transition: all 0.3s ease;
}

.preset-card:hover span {
  color: #00a8ff;
}
</style> 