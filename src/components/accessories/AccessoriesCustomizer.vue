<template>
  <div class="accessories-customizer">
    <div class="panel-header">
      <h3 class="panel-title">配饰定制</h3>
      <button class="game-btn secondary-btn" @click="resetAccessories">重置</button>
    </div>
    
    <!-- 材质选择 -->
    <div class="materials-section">
      <h4 class="section-subtitle">选择材质</h4>
      <div class="materials-grid">
        <div
          v-for="(material, key) in materials"
          :key="key"
          class="material-swatch"
          :class="{ active: currentMaterial === key }"
          :style="{ backgroundColor: material.color }"
          @click="changeMaterial(key)"
        >
          <span class="material-label">{{ material.label }}</span>
        </div>
      </div>
    </div>
    
    <!-- 标签页导航 -->
    <div class="accessories-tabs">
      <button 
        v-for="(tab, index) in tabs" 
        :key="index"
        :class="['tab-btn', { active: activeTabIndex === index }]"
        @click="activeTabIndex = index"
      >
        {{ tab }}
      </button>
    </div>
    
    <!-- 耳环选择 -->
    <div v-if="activeTabIndex === 0" class="accessory-section">
      <div class="accessories-grid">
        <div
          v-for="(earring, key) in earrings"
          :key="key"
          class="accessory-card"
          :class="{ active: currentEarrings === key }"
          @click="changeEarrings(key)"
        >
          <div class="accessory-preview" :style="earring.style"></div>
          <span>{{ earring.label }}</span>
        </div>
      </div>
      
      <!-- 耳环尺寸调整 -->
      <div class="slider-container" v-if="currentEarrings !== 'none'">
        <div class="slider-header">
          <div class="slider-label">耳环大小</div>
          <div class="slider-value">{{ earringScale }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="earringScale"
          @input="adjustScale('earrings', earringScale)"
        />
      </div>
      
      <!-- 耳环位置调整 -->
      <div class="slider-container" v-if="currentEarrings !== 'none'">
        <div class="slider-header">
          <div class="slider-label">耳环位置 (上下)</div>
          <div class="slider-value">{{ earringPositionY }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="earringPositionY"
          @input="adjustPosition('earrings', 'y', earringPositionY)"
        />
      </div>
    </div>
    
    <!-- 发饰选择 -->
    <div v-if="activeTabIndex === 1" class="accessory-section">
      <div class="accessories-grid">
        <div
          v-for="(hairAcc, key) in hairAccessories"
          :key="key"
          class="accessory-card"
          :class="{ active: currentHairAccessory === key }"
          @click="changeHairAccessory(key)"
        >
          <div class="accessory-preview" :style="hairAcc.style"></div>
          <span>{{ hairAcc.label }}</span>
        </div>
      </div>
      
      <!-- 发饰尺寸调整 -->
      <div class="slider-container" v-if="currentHairAccessory !== 'none'">
        <div class="slider-header">
          <div class="slider-label">发饰大小</div>
          <div class="slider-value">{{ hairAccessoryScale }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="hairAccessoryScale"
          @input="adjustScale('hairAccessory', hairAccessoryScale)"
        />
      </div>
      
      <!-- 发饰位置调整 -->
      <div class="slider-container" v-if="currentHairAccessory !== 'none'">
        <div class="slider-header">
          <div class="slider-label">发饰位置 (前后)</div>
          <div class="slider-value">{{ hairAccessoryPositionZ }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="hairAccessoryPositionZ"
          @input="adjustPosition('hairAccessory', 'z', hairAccessoryPositionZ)"
        />
      </div>
    </div>
    
    <!-- 项链选择 -->
    <div v-if="activeTabIndex === 2" class="accessory-section">
      <div class="accessories-grid">
        <div
          v-for="(necklace, key) in necklaces"
          :key="key"
          class="accessory-card"
          :class="{ active: currentNecklace === key }"
          @click="changeNecklace(key)"
        >
          <div class="accessory-preview" :style="necklace.style"></div>
          <span>{{ necklace.label }}</span>
        </div>
      </div>
      
      <!-- 项链尺寸调整 -->
      <div class="slider-container" v-if="currentNecklace !== 'none'">
        <div class="slider-header">
          <div class="slider-label">项链大小</div>
          <div class="slider-value">{{ necklaceScale }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="necklaceScale"
          @input="adjustScale('necklace', necklaceScale)"
        />
      </div>
      
      <!-- 项链位置调整 -->
      <div class="slider-container" v-if="currentNecklace !== 'none'">
        <div class="slider-header">
          <div class="slider-label">项链位置 (上下)</div>
          <div class="slider-value">{{ necklacePositionY }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="necklacePositionY"
          @input="adjustPosition('necklace', 'y', necklacePositionY)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessoriesCustomizer',
  props: {
    modelViewer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTabIndex: 0,
      tabs: ['耳环', '发饰', '项链'],
      currentEarrings: 'none',
      currentHairAccessory: 'none',
      currentNecklace: 'none',
      currentMaterial: 'silver',
      
      // 尺寸和位置参数
      earringScale: 50,
      earringPositionY: 50,
      hairAccessoryScale: 50,
      hairAccessoryPositionZ: 50,
      necklaceScale: 50,
      necklacePositionY: 50,
      
      // 耳环选项
      earrings: {
        none: { 
          label: '无', 
          style: 'background-color: var(--background-light);' 
        },
        stud: { 
          label: '圆珠', 
          style: 'background-image: url(/images/accessories/earrings/stud.png); background-size: cover;' 
        },
        hoop: { 
          label: '圆环', 
          style: 'background-image: url(/images/accessories/earrings/hoop.png); background-size: cover;' 
        },
        dangle: { 
          label: '垂坠', 
          style: 'background-image: url(/images/accessories/earrings/dangle.png); background-size: cover;' 
        }
      },
      
      // 发饰选项
      hairAccessories: {
        none: { 
          label: '无', 
          style: 'background-color: var(--background-light);' 
        },
        hairpin: { 
          label: '发夹', 
          style: 'background-image: url(/images/accessories/hair/hairpin.png); background-size: cover;' 
        },
        hairband: { 
          label: '发带', 
          style: 'background-image: url(/images/accessories/hair/hairband.png); background-size: cover;' 
        },
        tiara: { 
          label: '王冠', 
          style: 'background-image: url(/images/accessories/hair/tiara.png); background-size: cover;' 
        }
      },
      
      // 项链选项
      necklaces: {
        none: { 
          label: '无', 
          style: 'background-color: var(--background-light);' 
        },
        pendant: { 
          label: '吊坠', 
          style: 'background-image: url(/images/accessories/necklaces/pendant.png); background-size: cover;' 
        },
        choker: { 
          label: '颈链', 
          style: 'background-image: url(/images/accessories/necklaces/choker.png); background-size: cover;' 
        },
        chain: { 
          label: '链条', 
          style: 'background-image: url(/images/accessories/necklaces/chain.png); background-size: cover;' 
        }
      },
      
      // 材质选项
      materials: {
        silver: { 
          label: '银', 
          color: '#c0c0c0' 
        },
        gold: { 
          label: '金', 
          color: '#ffd700' 
        },
        rose_gold: { 
          label: '玫瑰金', 
          color: '#b76e79' 
        },
        platinum: { 
          label: '铂金', 
          color: '#e5e4e2' 
        }
      }
    }
  },
  methods: {
    changeEarrings(type) {
      this.currentEarrings = type;
      this.modelViewer.changeEarrings(type);
      this.$emit('change:earrings', type);
    },
    
    changeHairAccessory(type) {
      this.currentHairAccessory = type;
      this.modelViewer.changeHairAccessory(type);
      this.$emit('change:hairAccessory', type);
    },
    
    changeNecklace(type) {
      this.currentNecklace = type;
      this.modelViewer.changeNecklace(type);
      this.$emit('change:necklace', type);
    },
    
    changeMaterial(material) {
      this.currentMaterial = material;
      this.modelViewer.changeMaterial(material);
      this.$emit('change:material', material);
    },
    
    adjustScale(accessoryType, scale) {
      this.modelViewer.adjustScale(accessoryType, scale);
      this.$emit('change:scale', { type: accessoryType, value: scale });
    },
    
    adjustPosition(accessoryType, axis, value) {
      this.modelViewer.adjustPosition(accessoryType, axis, value);
      this.$emit('change:position', { type: accessoryType, axis, value });
    },
    
    resetAccessories() {
      // 重置所有配饰到默认状态
      this.currentEarrings = 'none';
      this.currentHairAccessory = 'none';
      this.currentNecklace = 'none';
      this.currentMaterial = 'silver';
      
      this.earringScale = 50;
      this.earringPositionY = 50;
      this.hairAccessoryScale = 50;
      this.hairAccessoryPositionZ = 50;
      this.necklaceScale = 50;
      this.necklacePositionY = 50;
      
      // 更新模型
      this.modelViewer.changeEarrings('none');
      this.modelViewer.changeHairAccessory('none');
      this.modelViewer.changeNecklace('none');
      this.modelViewer.changeMaterial('silver');
      
      this.$emit('reset');
    }
  }
}
</script>

<style scoped>
.accessories-customizer {
  padding: 10px 0;
}

.section-subtitle {
  color: var(--text-secondary); 
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
}

.accessories-tabs {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  margin-bottom: 15px;
}

.tab-btn {
  flex: 1;
  padding: 8px 0;
  background-color: var(--background-light);
  border: 1px solid rgba(0, 168, 255, 0.2);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background-color: rgba(0, 168, 255, 0.2);
  color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
}

.accessories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.accessory-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(26, 42, 53, 0.7);
  border: 1px solid rgba(0, 168, 255, 0.2);
  border-radius: 6px;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.accessory-card:hover {
  border-color: var(--primary-color);
}

.accessory-card.active {
  border-color: var(--highlight);
  background-color: rgba(255, 180, 0, 0.1);
}

.accessory-preview {
  width: 70px;
  height: 70px;
  border-radius: 6px;
  margin-bottom: 8px;
  background-color: var(--background-light);
  border: 2px solid rgba(0, 168, 255, 0.3);
}

.materials-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
}

.material-swatch {
  width: 60px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid rgba(0, 168, 255, 0.3);
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.material-swatch:hover {
  transform: translateY(-2px);
}

.material-swatch.active {
  border: 2px solid var(--highlight);
  box-shadow: 0 0 10px rgba(255, 180, 0, 0.5);
}

.material-label {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .accessories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .accessory-preview {
    width: 60px;
    height: 60px;
  }
  
  .material-swatch {
    width: 50px;
    height: 25px;
  }
}
</style> 