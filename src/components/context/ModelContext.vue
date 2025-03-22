<template>
  <slot 
    :model-state="modelState" 
    :update-feature="updateFeature"
    :apply-preset="applyPreset"
    :reset-controls="resetControls"
  ></slot>
</template>

<script>
export default {
  name: 'ModelContext',
  props: {
    initialState: {
      type: Object,
      default: () => ({
        noseSize: 50,
        eyeSize: 50,
        mouthWidth: 50
      })
    },
    presets: {
      type: Object,
      default: () => ({
        round: { noseSize: 60, eyeSize: 70, mouthWidth: 60 },
        long: { noseSize: 40, eyeSize: 50, mouthWidth: 40 },
        square: { noseSize: 50, eyeSize: 40, mouthWidth: 70 }
      })
    }
  },
  data() {
    return {
      modelState: { ...this.initialState }
    };
  },
  methods: {
    updateFeature(feature, value) {
      const featureMap = {
        nose: 'noseSize',
        eyes: 'eyeSize',
        mouth: 'mouthWidth'
      };
      
      const stateKey = featureMap[feature] || feature;
      this.modelState[stateKey] = value;
      
      this.$emit('update:feature', feature, value);
    },
    applyPreset(presetName) {
      const preset = this.presets[presetName];
      if (!preset) return;
      
      Object.entries(preset).forEach(([key, value]) => {
        this.modelState[key] = value;
        
        // 向上发送更新，映射回Three.js使用的特征名
        const featureMap = {
          noseSize: 'nose',
          eyeSize: 'eyes',
          mouthWidth: 'mouth'
        };
        
        this.$emit('update:feature', featureMap[key] || key, value);
      });
      
      this.$emit('apply-preset', presetName, preset);
    },
    resetControls() {
      // 重置为默认值
      this.modelState.noseSize = 50;
      this.modelState.eyeSize = 50;
      this.modelState.mouthWidth = 50;
      
      // 通知父组件
      this.$emit('update:feature', 'nose', 50);
      this.$emit('update:feature', 'eyes', 50);
      this.$emit('update:feature', 'mouth', 50);
      this.$emit('reset');
    }
  }
}
</script> 