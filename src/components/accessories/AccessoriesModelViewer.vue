<template>
  <div class="accessories-model-container">
    <div ref="accessoriesContainer" class="model-container"></div>
    
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
        @click="resetView" 
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
import { AccessoriesEditor } from '../../three/AccessoriesEditor';

export default {
  name: 'AccessoriesModelViewer',
  props: {
    initialEarrings: {
      type: String,
      default: 'none'
    },
    initialHairAccessory: {
      type: String,
      default: 'none'
    },
    initialNecklace: {
      type: String,
      default: 'none'
    },
    initialMaterial: {
      type: String,
      default: 'silver'
    }
  },
  data() {
    return {
      accessoriesEditor: null,
      isRotating: false,
      isMobile: false
    };
  },
  mounted() {
    this.checkDeviceType();
    this.$nextTick(() => {
      this.initAccessoriesEditor();
    });
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.accessoriesEditor) {
      this.accessoriesEditor.dispose();
      this.accessoriesEditor = null;
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    checkDeviceType() {
      this.isMobile = window.innerWidth <= 768;
    },
    initAccessoriesEditor() {
      if (this.$refs.accessoriesContainer) {
        // 设置容器高度
        if (this.isMobile) {
          this.$refs.accessoriesContainer.style.height = '350px';
        }
        this.accessoriesEditor = new AccessoriesEditor(
          this.$refs.accessoriesContainer, 
          {
            earrings: this.initialEarrings,
            hairAccessory: this.initialHairAccessory,
            necklace: this.initialNecklace,
            material: this.initialMaterial
          }, 
          this.isMobile
        );
      }
    },
    handleResize() {
      const wasMobile = this.isMobile;
      this.checkDeviceType();
      
      // 如果设备类型改变，需要重新初始化
      if (wasMobile !== this.isMobile) {
        if (this.accessoriesEditor) {
          this.accessoriesEditor.dispose();
          this.accessoriesEditor = null;
        }
        this.initAccessoriesEditor();
      } else if (this.accessoriesEditor) {
        this.accessoriesEditor.handleResize();
      }
    },
    toggleRotation() {
      this.isRotating = !this.isRotating;
      if (this.accessoriesEditor) {
        this.accessoriesEditor.toggleRotation(this.isRotating);
      }
    },
    resetView() {
      if (this.accessoriesEditor) {
        this.accessoriesEditor.resetView();
      }
    },
    changeEarrings(type) {
      if (this.accessoriesEditor) {
        return this.accessoriesEditor.changeAccessory('earrings', type);
      }
      return false;
    },
    changeHairAccessory(type) {
      if (this.accessoriesEditor) {
        return this.accessoriesEditor.changeAccessory('hairAccessory', type);
      }
      return false;
    },
    changeNecklace(type) {
      if (this.accessoriesEditor) {
        return this.accessoriesEditor.changeAccessory('necklace', type);
      }
      return false;
    },
    changeMaterial(material) {
      if (this.accessoriesEditor) {
        return this.accessoriesEditor.changeMaterial(material);
      }
      return false;
    },
    adjustScale(accessoryType, scale) {
      if (this.accessoriesEditor) {
        return this.accessoriesEditor.adjustScale(accessoryType, scale);
      }
      return false;
    },
    adjustPosition(accessoryType, axis, value) {
      if (this.accessoriesEditor) {
        return this.accessoriesEditor.adjustPosition(accessoryType, axis, value);
      }
      return false;
    }
  }
}
</script>

<style scoped>
.accessories-model-container {
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
  .accessories-model-container {
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