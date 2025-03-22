<template>
  <div class="coming-soon-panel">
    <h3>{{ title }}</h3>
    <p>{{ message || '功能即将推出，敬请期待！' }}</p>
    <div class="placeholder-controls">
      <div 
        v-for="index in numPlaceholders" 
        :key="index" 
        class="placeholder-slider"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComingSoonPanel',
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    numPlaceholders: {
      type: Number,
      default: 3
    }
  }
}
</script>

<style scoped>
.coming-soon-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  text-align: center;
  background: rgba(0, 168, 255, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(0, 168, 255, 0.3);
}

.coming-soon-panel h3 {
  color: var(--primary-color);
  font-size: 22px;
  margin-bottom: 10px;
}

.coming-soon-panel p {
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.placeholder-controls {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.placeholder-slider {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.placeholder-slider::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, rgba(0, 168, 255, 0.3), rgba(0, 168, 255, 0.1));
  border-radius: 3px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.5; transform: translateX(0); }
  50% { opacity: 1; }
  100% { opacity: 0.5; transform: translateX(300%); }
}
</style> 