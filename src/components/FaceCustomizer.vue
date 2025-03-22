<template>
  <div class="game-container">
    <!-- 头部导航 -->
    <div class="game-header">
      <div class="game-title">角色定制</div>
      <div class="game-tabs">
        <button
          v-for="(tab, index) in navItems"
          :key="index"
          class="game-tab"
          :class="{ active: activeNavIndex === index }"
          @click="activeNavIndex = index"
        >
          {{ tab }}
        </button>
      </div>
      <div class="save-load-container">
        <input v-model="characterName" placeholder="角色名称" />
        <button @click="saveCharacter">保存</button>
        <button @click="loadCharacters">加载</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="game-content">
      <!-- 3D模型预览 -->
      <div class="model-viewer">
        <face-model-viewer
          ref="modelViewer"
          :initialSettings="{
            nose: modelStateProxy.noseSize,
            eyes: modelStateProxy.eyeSize,
            mouth: modelStateProxy.mouthWidth
          }"
        />
        <!-- 添加移动设备提示 -->
        <div class="mobile-tip">
          <span v-if="isMobileDevice">点击并拖动可旋转模型</span>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <model-context
          :initial-state="initialModelState"
          :presets="presets"
          @update:feature="handleFeatureUpdate"
          @apply-preset="handlePresetApplied"
        >
          <template v-slot="{ modelState, updateFeature, applyPreset, resetControls }">
            <!-- 将modelState赋值给代理对象，用于初始化3D模型 -->
            <span style="display: none">{{ updateModelProxy(modelState) }}</span>

            <!-- 脸部调整面板 -->
            <div v-if="activeNavIndex === 0">
              <div class="panel-header">
                <h3 class="panel-title">面部调整</h3>
                <button class="game-btn secondary-btn" @click="resetControls">重置</button>
              </div>

              <!-- 滑块控制 -->
              <div>
                <div class="slider-container" v-for="(item, key) in sliderConfig" :key="key">
                  <div class="slider-header">
                    <div class="slider-label">{{ item.label }}</div>
                    <div class="slider-value">{{ modelState[key] }}</div>
                  </div>
                  <input
                    type="range"
                    class="game-slider"
                    min="0"
                    max="100"
                    v-model.number="modelState[key]"
                    @input="updateFeature(item.feature, modelState[key])"
                  />
                </div>
              </div>

              <!-- 预设选项 -->
              <div>
                <h4 style="color: var(--text-secondary); margin-top: 20px;">预设面部</h4>
                <div class="preset-grid">
                  <div
                    v-for="(preset, key) in presetLabels"
                    :key="key"
                    class="preset-card"
                    @click="applyPreset(key)"
                  >
                    <div class="preset-icon" :style="preset.style"></div>
                    <span style="color: var(--text-secondary); font-size: 14px;">{{ preset.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 发型面板 -->
            <div v-if="activeNavIndex === 1">
              <div class="hair-editor-container">
                <!-- 头发3D模型预览 -->
                <hair-model-viewer
                  ref="hairModelViewer"
                  :initialHairStyle="currentHairStyle"
                  :initialHairColor="currentHairColor"
                  :initialParameters="hairParameters"
                />
                
                <!-- 头发调整控制面板 -->
                <hair-customizer
                  :modelViewer="$refs.hairModelViewer"
                  @change:style="handleHairStyleChange"
                  @change:color="handleHairColorChange"
                  @change:parameter="handleHairParameterChange"
                  @reset="handleHairReset"
                />
              </div>
            </div>

            <!-- 配饰面板 -->
            <div v-if="activeNavIndex === 2">
              <div class="accessories-editor-container">
                <!-- 配饰3D模型预览 -->
                <accessories-model-viewer
                  ref="accessoriesModelViewer"
                  :initialEarrings="currentEarrings"
                  :initialHairAccessory="currentHairAccessory"
                  :initialNecklace="currentNecklace"
                  :initialMaterial="currentMaterial"
                />
                
                <!-- 配饰调整控制面板 -->
                <accessories-customizer
                  :modelViewer="$refs.accessoriesModelViewer || {}"
                  @change:earrings="handleEarringsChange"
                  @change:hairAccessory="handleHairAccessoryChange"
                  @change:necklace="handleNecklaceChange"
                  @change:material="handleMaterialChange"
                  @change:scale="handleAccessoryScaleChange"
                  @change:position="handleAccessoryPositionChange"
                  @reset="handleAccessoriesReset"
                />
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="action-buttons">
              <button class="game-btn primary-btn" style="flex: 1" @click="saveCurrentFace(modelState)">
                保存
              </button>
              <button class="game-btn secondary-btn" style="flex: 1" @click="shareCurrentFace(modelState)">
                分享
              </button>
            </div>
          </template>
        </model-context>
      </div>
    </div>
  </div>
</template>

<script>
import FaceModelViewer from './face/FaceModelViewer.vue';
import ModelContext from './context/ModelContext.vue';
import StorageService from '../services/StorageService';
import NotificationService from '../services/NotificationService';
import HairModelViewer from './hair/HairModelViewer.vue';
import HairCustomizer from './hair/HairCustomizer.vue';
import AccessoriesModelViewer from './accessories/AccessoriesModelViewer.vue';
import AccessoriesCustomizer from './accessories/AccessoriesCustomizer.vue';

export default {
  name: 'FaceCustomizer',
  components: {
    FaceModelViewer,
    ModelContext,
    HairModelViewer,
    HairCustomizer,
    AccessoriesModelViewer,
    AccessoriesCustomizer
  },
  data() {
    return {
      activeNavIndex: 0,
      navItems: ['脸部', '发型', '配饰'],
      initialModelState: {
        noseSize: 50,
        eyeSize: 50,
        mouthWidth: 50
      },
      // 代理对象，用于将modelState映射到3D模型
      modelStateProxy: {
        noseSize: 50,
        eyeSize: 50,
        mouthWidth: 50
      },
      presets: {
        round: { noseSize: 60, eyeSize: 70, mouthWidth: 60 },
        long: { noseSize: 40, eyeSize: 50, mouthWidth: 40 },
        square: { noseSize: 50, eyeSize: 40, mouthWidth: 70 }
      },
      sliderConfig: {
        noseSize: { label: '鼻子大小', feature: 'nose' },
        eyeSize: { label: '眼睛大小', feature: 'eyes' },
        mouthWidth: { label: '嘴巴宽度', feature: 'mouth' }
      },
      presetLabels: {
        round: { 
          label: '圆脸', 
          style: 'border-radius: 50%; background-color: var(--background-light);'
        },
        long: { 
          label: '长脸', 
          style: 'border-radius: 40% / 50%; background-color: var(--background-light);'
        },
        square: { 
          label: '方脸', 
          style: 'border-radius: 10px; background-color: var(--background-light);'
        }
      },
      isMobileDevice: false,
      // 发型相关数据
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
      },
      // 配饰状态
      currentEarrings: 'none',
      currentHairAccessory: 'none',
      currentNecklace: 'none',
      currentMaterial: 'silver',
      characterName: ''
    }
  },
  mounted() {
    this.checkDeviceType();
    window.addEventListener('resize', this.checkDeviceType);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDeviceType);
  },
  methods: {
    updateModelProxy(modelState) {
      this.modelStateProxy = { ...modelState };
      return '';
    },
    handleFeatureUpdate(feature, value) {
      if (this.$refs.modelViewer) {
        this.$refs.modelViewer.updateFeature(feature, value);
      }
    },
    handlePresetApplied(presetName, preset) {
      console.log('应用预设:', presetName);
    },
    saveCurrentFace(modelState) {
      if (!this.characterName) {
        alert('请输入角色名称');
        return;
      }

      StorageService.isCharacterNameUnique(this.characterName)
        .then((isUnique) => {
          if (!isUnique) {
            alert('角色名称已存在，请使用其他名称');
            return;
          }

          const characterData = {
            name: this.characterName,
            data: {
              modelState: modelState,
              hairStyle: this.currentHairStyle,
              hairColor: this.currentHairColor,
              earrings: this.currentEarrings,
              hairAccessory: this.currentHairAccessory,
              necklace: this.currentNecklace,
              material: this.currentMaterial,
              hairParameters: this.hairParameters
            }
          };

          StorageService.saveCharacter(characterData)
            .then(() => {
              alert('角色已保存');
            })
            .catch((error) => {
              console.error('保存失败:', error);
              alert('保存失败，请重试');
            });
        })
        .catch((error) => {
          console.error('检查角色名称唯一性失败:', error);
        });
    },
    loadCharacters() {
      StorageService.loadCharacters()
        .then((characters) => {
          console.log('已保存的角色:', characters);
          // 这里可以展示角色列表
        })
        .catch((error) => {
          console.error('加载失败:', error);
        });
    },
    checkDeviceType() {
      this.isMobileDevice = window.innerWidth <= 768;
    },
    // 新增头发调整事件处理方法
    handleHairStyleChange(style) {
      this.currentHairStyle = style;
      // 同步到主3D模型(可选)
      if (this.$refs.modelViewer) {
        this.$refs.modelViewer.changeHairStyle(style);
      }
    },
    handleHairColorChange(color) {
      this.currentHairColor = color;
      // 同步到主3D模型(可选)
      if (this.$refs.modelViewer) {
        this.$refs.modelViewer.changeHairColor(color);
      }
    },
    handleHairParameterChange({ param, value }) {
      this.hairParameters[param] = value;
      // 同步到主3D模型(可选)
      if (this.$refs.modelViewer) {
        this.$refs.modelViewer.adjustHairParameter(param, value);
      }
    },
    handleHairReset() {
      this.currentHairStyle = 'short';
      this.currentHairColor = 'black';
      this.hairParameters = {
        volume: 50,
        length: 50,
        curl: 50
      };
      // 同步到主3D模型(可选)
      if (this.$refs.modelViewer) {
        this.$refs.modelViewer.changeHairStyle('short');
        this.$refs.modelViewer.changeHairColor('black');
        this.$refs.modelViewer.adjustHairParameter('volume', 50);
        this.$refs.modelViewer.adjustHairParameter('length', 50);
        this.$refs.modelViewer.adjustHairParameter('curl', 50);
      }
    },
    // 配饰调整事件处理方法
    handleEarringsChange(type) {
      this.currentEarrings = type;
      // 同步到主3D模型(可选)
      if (this.$refs.modelViewer) {
        // 如果主模型也需要显示配饰，可以添加相应方法
      }
    },
    handleHairAccessoryChange(type) {
      this.currentHairAccessory = type;
      // 与发型视图协同
      if (this.$refs.hairModelViewer) {
        // 如果需要在发型上添加发饰，可以添加相应方法
      }
    },
    handleNecklaceChange(type) {
      this.currentNecklace = type;
    },
    handleMaterialChange(material) {
      this.currentMaterial = material;
    },
    handleAccessoryScaleChange({ type, value }) {
      // 可以在这里存储配饰的比例信息
      console.log(`配饰 ${type} 的比例已更改为 ${value}`);
    },
    handleAccessoryPositionChange({ type, axis, value }) {
      // 可以在这里存储配饰的位置信息
      console.log(`配饰 ${type} 的${axis}轴位置已更改为 ${value}`);
    },
    handleAccessoriesReset() {
      this.currentEarrings = 'none';
      this.currentHairAccessory = 'none';
      this.currentNecklace = 'none';
      this.currentMaterial = 'silver';
    },
    shareCurrentFace(modelState) {
      alert('分享功能开发中');
    }
  }
}
</script>

<style>
@import '../assets/main.css';
</style>

<style scoped>
.mobile-tip {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  opacity: 0.8;
  pointer-events: none;
  display: none;
}

@media (max-width: 768px) {
  .mobile-tip {
    display: block;
  }
}

/* 添加发型相关样式 */
.hair-editor-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 1024px) {
  .hair-editor-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

/* 添加配饰相关样式 */
.accessories-editor-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 1024px) {
  .accessories-editor-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

.save-load-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.save-load-container input {
  padding: 5px;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
}

.save-load-container button {
  padding: 5px 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-load-container button:hover {
  background-color: var(--highlight);
}
</style> 