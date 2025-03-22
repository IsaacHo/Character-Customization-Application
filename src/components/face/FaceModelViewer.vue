<template>
  <div class="mobile-model-container">
    <div ref="container" class="model-container"></div>
    
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
        @click="toggleZoom" 
        class="control-btn"
        :class="{ active: isZooming }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { FaceEditor } from '../../three/FaceEditor';

export default {
  name: 'FaceModelViewer',
  props: {
    initialSettings: {
      type: Object,
      default: () => ({
        nose: 50,
        eyes: 50,
        mouth: 50
      })
    }
  },
  data() {
    return {
      faceEditor: null,
      isRotating: false,
      isZooming: false,
      isMobile: false
    };
  },
  mounted() {
    this.checkDeviceType();
    this.$nextTick(() => {
      this.initFaceEditor();
    });
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.faceEditor) {
      this.faceEditor.dispose();
      this.faceEditor = null;
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    checkDeviceType() {
      this.isMobile = window.innerWidth <= 768;
    },
    initFaceEditor() {
      if (this.$refs.container) {
        // 设置容器高度
        if (this.isMobile) {
          this.$refs.container.style.height = '350px';
        }
        this.faceEditor = new FaceEditor(this.$refs.container, this.initialSettings, this.isMobile);
      }
    },
    updateFeature(feature, value) {
      if (this.faceEditor) {
        this.faceEditor.deform(feature, value);
      }
    },
    handleResize() {
      const wasMobile = this.isMobile;
      this.checkDeviceType();
      
      // 如果设备类型改变，需要重新初始化
      if (wasMobile !== this.isMobile) {
        if (this.faceEditor) {
          this.faceEditor.dispose();
          this.faceEditor = null;
        }
        this.initFaceEditor();
      } else if (this.faceEditor) {
        this.faceEditor.handleResize();
      }
    },
    toggleRotation() {
      this.isRotating = !this.isRotating;
      if (this.faceEditor) {
        this.faceEditor.toggleRotation(this.isRotating);
      }
    },
    toggleZoom() {
      this.isZooming = !this.isZooming;
      if (this.faceEditor) {
        this.faceEditor.toggleZoom(this.isZooming);
      }
    },
    changeHairStyle(hairType) {
      if (this.faceEditor) {
        return this.faceEditor.changeHairStyle(hairType);
      }
      return false;
    },
    changeHairColor(colorName) {
      if (this.faceEditor) {
        return this.faceEditor.changeHairColor(colorName);
      }
      return false;
    },
    adjustHairParameter(param, value) {
      if (this.faceEditor) {
        return this.faceEditor.adjustHairParameter(param, value);
      }
      return false;
    }
  }
}
</script>

<style scoped>
.mobile-model-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
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
  .mobile-model-container {
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