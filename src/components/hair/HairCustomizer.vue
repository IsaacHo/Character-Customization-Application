<template>
  <div class="hair-customizer">
    <div class="panel-header">
      <h3 class="panel-title">发型定制</h3>
      <button class="game-btn secondary-btn" @click="resetHairStyle">重置</button>
    </div>
    
    <!-- 发型选择 -->
    <div class="hair-styles-section">
      <h4 class="section-subtitle">选择发型</h4>
      <div class="hair-styles-grid">
        <div
          v-for="(hairstyle, key) in hairStyles"
          :key="key"
          class="hair-style-card"
          :class="{ active: currentHairStyle === key }"
          @click="changeHairStyle(key)"
        >
          <div class="hair-style-preview" :style="hairstyle.style"></div>
          <span>{{ hairstyle.label }}</span>
        </div>
      </div>
    </div>
    
    <!-- 发型参数调整 -->
    <div class="hair-parameters">
      <h4 class="section-subtitle">调整参数</h4>
      
      <!-- 发型体积 -->
      <div class="slider-container">
        <div class="slider-header">
          <div class="slider-label">发型体积</div>
          <div class="slider-value">{{ hairParameters.volume }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="hairParameters.volume"
          @input="adjustHairParameter('volume', hairParameters.volume)"
        />
      </div>
      
      <!-- 发型长度 - 对长发和卷发有效 -->
      <div class="slider-container" v-if="currentHairStyle !== 'short'">
        <div class="slider-header">
          <div class="slider-label">发型长度</div>
          <div class="slider-value">{{ hairParameters.length }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="hairParameters.length"
          @input="adjustHairParameter('length', hairParameters.length)"
        />
      </div>
      
      <!-- 卷曲度 - 主要对卷发有效 -->
      <div class="slider-container" v-if="currentHairStyle === 'curly'">
        <div class="slider-header">
          <div class="slider-label">卷曲度</div>
          <div class="slider-value">{{ hairParameters.curl }}</div>
        </div>
        <input
          type="range"
          class="game-slider"
          min="0"
          max="100"
          v-model.number="hairParameters.curl"
          @input="adjustHairParameter('curl', hairParameters.curl)"
        />
      </div>
    </div>
    
    <!-- 发色选择 -->
    <div class="hair-colors-section">
      <h4 class="section-subtitle">选择发色</h4>
      <div class="hair-colors-grid">
        <div
          v-for="(color, key) in hairColors"
          :key="key"
          class="hair-color-swatch"
          :class="{ active: currentHairColor === key }"
          :style="{ backgroundColor: color.hex }"
          @click="changeHairColor(key)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HairCustomizer',
  props: {
    modelViewer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentHairStyle: 'short',
      currentHairColor: 'black',
      hairStyles: {
        short: { 
          label: '短发', 
          style: 'background-image: url(/images/hair/short_hair.png); background-size: cover;' 
        },
        long: { 
          label: '长发', 
          style: 'background-image: url(/images/hair/long_hair.png); background-size: cover;' 
        },
        curly: { 
          label: '卷发', 
          style: 'background-image: url(/images/hair/curly_hair.png); background-size: cover;' 
        }
      },
      hairColors: {
        black: { name: '黑色', hex: '#0a0a0a' },
        brown: { name: '棕色', hex: '#3b2417' },
        blonde: { name: '金色', hex: '#c6a664' },
        red: { name: '红色', hex: '#8c3c2d' },
        blue: { name: '蓝色', hex: '#2a4b7c' },
        purple: { name: '紫色', hex: '#6a3675' }
      },
      hairParameters: {
        volume: 50,
        length: 50,
        curl: 50
      }
    }
  },
  methods: {
    changeHairStyle(style) {
      this.currentHairStyle = style;
      this.modelViewer.changeHairStyle(style);
      this.$emit('change:style', style);
    },
    
    changeHairColor(color) {
      this.currentHairColor = color;
      this.modelViewer.changeHairColor(color);
      this.$emit('change:color', color);
    },
    
    adjustHairParameter(param, value) {
      this.modelViewer.adjustHairParameter(param, value);
      this.$emit('change:parameter', { param, value });
    },
    
    resetHairStyle() {
      this.currentHairStyle = 'short';
      this.currentHairColor = 'black';
      this.hairParameters = {
        volume: 50,
        length: 50,
        curl: 50
      };
      
      this.modelViewer.changeHairStyle('short');
      this.modelViewer.changeHairColor('black');
      this.modelViewer.adjustHairParameter('volume', 50);
      this.modelViewer.adjustHairParameter('length', 50);
      this.modelViewer.adjustHairParameter('curl', 50);
      
      this.$emit('reset');
    }
  }
}
</script>

<style scoped>
.hair-customizer {
  padding: 10px 0;
}

.section-subtitle {
  color: var(--text-secondary); 
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
}

.hair-styles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.hair-style-card {
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

.hair-style-card:hover {
  border-color: var(--primary-color);
}

.hair-style-card.active {
  border-color: var(--highlight);
  background-color: rgba(255, 180, 0, 0.1);
}

.hair-style-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 8px;
  background-color: var(--background-light);
  border: 2px solid rgba(0, 168, 255, 0.3);
}

.hair-colors-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
}

.hair-color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid rgba(0, 168, 255, 0.3);
}

.hair-color-swatch:hover {
  transform: scale(1.1);
}

.hair-color-swatch.active {
  transform: scale(1.15);
  border: 2px solid var(--highlight);
  box-shadow: 0 0 10px rgba(255, 180, 0, 0.5);
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .hair-styles-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .hair-style-preview {
    width: 50px;
    height: 50px;
  }
  
  .hair-color-swatch {
    width: 30px;
    height: 30px;
  }
}
</style> 