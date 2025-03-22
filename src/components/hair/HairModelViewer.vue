<template>
  <div class="hair-model-container">
    <div ref="hairContainer" class="model-container"></div>
    
    <!-- 控制按钮 -->
    <div class="model-controls">
      <button 
        @click="toggleRotation" 
        class="control-btn"
        :class="{ active: isRotating }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.5 2v6h-6M2.5 12.5v-6h6M21.5 15.5a9 9 0 01-15 5M2.5 8.5a9 9 0 0115-5"></path>
        </svg>
      </button>
      
      <button 
        @click="resetHairView" 
        class="control-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="8 12 12 16 16 12"></polyline>
          <line x1="12" y1="8" x2="12" y2="16"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { HairEditor } from '../../three/HairEditor';

export default {
  name: 'HairModelViewer',
  props: {
    initialHairStyle: {
      type: String,
      default: 'short'
    },
    initialHairColor: {
      type: String,
      default: 'black'
    },
    initialParameters: {
      type: Object,
      default: () => ({
        volume: 50,
        length: 50,
        curl: 50
      })
    }
  },
  data() {
    return {
      hairEditor: null,
      isRotating: false,
      isMobile: false
    };
  },
  mounted() {
    this.checkDeviceType();
    this.$nextTick(() => {
      this.initHairEditor();
    });
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.hairEditor) {
      this.hairEditor.dispose();
      this.hairEditor = null;
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    checkDeviceType() {
      this.isMobile = window.innerWidth <= 768;
    },
    initHairEditor() {
      if (this.$refs.hairContainer) {
        // 设置容器高度
        if (this.isMobile) {
          this.$refs.hairContainer.style.height = '350px';
        }
        this.hairEditor = new HairEditor(
          this.$refs.hairContainer, 
          this.initialHairStyle, 
          this.initialHairColor, 
          this.initialParameters, 
          this.isMobile
        );
      }
    },
    handleResize() {
      const wasMobile = this.isMobile;
      this.checkDeviceType();
      
      // 如果设备类型改变，需要重新初始化
      if (wasMobile !== this.isMobile) {
        if (this.hairEditor) {
          this.hairEditor.dispose();
          this.hairEditor = null;
        }
        this.initHairEditor();
      } else if (this.hairEditor) {
        this.hairEditor.handleResize();
      }
    },
    toggleRotation() {
      this.isRotating = !this.isRotating;
      if (this.hairEditor) {
        this.hairEditor.toggleRotation(this.isRotating);
      }
    },
    resetHairView() {
      if (this.hairEditor) {
        this.hairEditor.resetView();
      }
    },
    changeHairStyle(hairType) {
      if (this.hairEditor) {
        return this.hairEditor.changeHairStyle(hairType);
      }
      return false;
    },
    changeHairColor(colorName) {
      if (this.hairEditor) {
        return this.hairEditor.changeHairColor(colorName);
      }
      return false;
    },
    adjustHairParameter(param, value) {
      if (this.hairEditor) {
        return this.hairEditor.adjustHairParameter(param, value);
      }
      return false;
    }
  }
}
</script>

<style scoped>
.hair-model-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--background-medium), var(--background-dark));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 
              inset 0 0 10px rgba(0, 168, 255, 0.1);
}

.model-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.model-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.control-btn {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(15, 25, 35, 0.8);
  border: 1px solid rgba(0, 168, 255, 0.5);
  color: #00a8ff;
  cursor: pointer;
}

.control-btn.active {
  border-color: #ffb400;
  color: #ffb400;
}

/* 移动设备专用样式 */
@media (max-width: 768px) {
  .hair-model-container {
    min-height: 350px;
  }
  
  .model-container {
    min-height: 350px;
  }
  
  .control-btn {
    width: 36px;
    height: 36px;
  }
}
</style> 