<template>
  <div class="control-group">
    <div class="control-label">
      <span>{{ label }}</span>
      <game-badge>{{ modelValue }}</game-badge>
    </div>
    <div class="slider-container">
      <input 
        type="range" 
        :min="min" 
        :max="max" 
        :value="modelValue" 
        @input="$emit('update:modelValue', parseInt($event.target.value))"
        class="game-slider"
      >
      <div class="slider-track">
        <div class="slider-fill" :style="{ width: percentage + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GameBadge from './GameBadge.vue';

export default {
  name: 'GameSlider',
  components: {
    GameBadge
  },
  props: {
    label: {
      type: String,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    modelValue: {
      type: Number,
      required: true
    }
  },
  computed: {
    percentage() {
      return ((this.modelValue - this.min) / (this.max - this.min)) * 100;
    }
  }
}
</script>

<style scoped>
.control-group {
  position: relative;
  margin-bottom: 20px;
}

.control-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.control-label span {
  font-size: 16px;
  font-weight: 500;
  color: #b3c3d3;
  letter-spacing: 0.5px;
}

.slider-container {
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
}

.slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  height: 6px;
  background-color: rgba(0, 168, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(to right, #00a8ff, #36d1dc);
  border-radius: 3px;
}

.game-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: transparent;
  outline: none;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
}

.game-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00a8ff;
  border: 2px solid #ffffff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
  transition: all 0.2s ease;
}

.game-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 15px rgba(0, 168, 255, 0.7);
}
</style> 