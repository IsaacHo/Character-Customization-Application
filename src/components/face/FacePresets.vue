<template>
  <div class="preset-section">
    <h3>预设面部</h3>
    <div class="preset-grid">
      <game-card 
        v-for="(preset, key) in presets" 
        :key="key"
        :label="getPresetLabel(key)"
        :icon-class="key + '-face'"
        @click="selectPreset(key)"
      />
    </div>
  </div>
</template>

<script>
import GameCard from '../ui/GameCard.vue';

export default {
  name: 'FacePresets',
  components: {
    GameCard
  },
  props: {
    presets: {
      type: Object,
      default: () => ({
        round: { nose: 60, eyes: 70, mouth: 60 },
        long: { nose: 40, eyes: 50, mouth: 40 },
        square: { nose: 50, eyes: 40, mouth: 70 }
      })
    }
  },
  methods: {
    selectPreset(presetName) {
      this.$emit('select-preset', presetName);
    },
    getPresetLabel(key) {
      const labels = {
        round: '圆脸',
        long: '长脸',
        square: '方脸'
      };
      return labels[key] || key;
    }
  }
}
</script>

<style scoped>
.preset-section {
  padding: 20px 0;
  border-top: 1px solid rgba(0, 168, 255, 0.2);
}

.preset-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

@media (max-width: 768px) {
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 