<template>
  <div>
    <div class="sidebar-header">
      <h2>面部参数调整</h2>
      <button class="reset-button" @click="resetControls">重置</button>
    </div>
    
    <div class="control-section">
      <game-slider 
        label="鼻子大小" 
        v-model="noseModel" 
        @update:modelValue="updateNose"
      />
      
      <game-slider 
        label="眼睛大小" 
        v-model="eyesModel" 
        @update:modelValue="updateEyes"
      />
      
      <game-slider 
        label="嘴巴宽度" 
        v-model="mouthModel" 
        @update:modelValue="updateMouth"
      />
    </div>
  </div>
</template>

<script>
import GameSlider from '../ui/GameSlider.vue';

export default {
  name: 'FaceControls',
  components: {
    GameSlider
  },
  props: {
    noseSize: {
      type: Number,
      default: 50
    },
    eyeSize: {
      type: Number,
      default: 50
    },
    mouthWidth: {
      type: Number,
      default: 50
    }
  },
  emits: ['update:noseSize', 'update:eyeSize', 'update:mouthWidth', 'reset'],
  computed: {
    noseModel: {
      get() {
        return this.noseSize;
      },
      set(value) {
        this.$emit('update:noseSize', value);
      }
    },
    eyesModel: {
      get() {
        return this.eyeSize;
      },
      set(value) {
        this.$emit('update:eyeSize', value);
      }
    },
    mouthModel: {
      get() {
        return this.mouthWidth;
      },
      set(value) {
        this.$emit('update:mouthWidth', value);
      }
    }
  },
  methods: {
    updateNose(value) {
      this.$emit('update:noseSize', value);
    },
    updateEyes(value) {
      this.$emit('update:eyeSize', value);
    },
    updateMouth(value) {
      this.$emit('update:mouthWidth', value);
    },
    resetControls() {
      this.$emit('reset');
    }
  }
}
</script>

<style scoped>
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 168, 255, 0.2);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #00a8ff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reset-button {
  background: none;
  border: 1px solid rgba(255, 159, 67, 0.4);
  color: #ff9f43;
  padding: 5px 12px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.reset-button:hover {
  background-color: rgba(255, 159, 67, 0.1);
  box-shadow: 0 0 10px rgba(255, 159, 67, 0.2);
}

.control-section {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
</style> 