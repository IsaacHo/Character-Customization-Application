<template>
  <div class="action-container">
    <game-button 
      type="primary" 
      @click="$emit('save')"
    >
      保存
    </game-button>
    <game-button 
      type="secondary" 
      @click="$emit('share')"
    >
      分享
    </game-button>
  </div>
</template>

<script>
import GameButton from '../ui/GameButton.vue';

export default {
  name: 'FaceActions',
  components: {
    GameButton
  },
  emits: ['save', 'share']
}
</script>

<style scoped>
.action-container {
  display: flex;
  gap: 15px;
  margin-top: auto;
}

@media (max-width: 480px) {
  .action-container {
    flex-direction: column;
  }
}
</style> 