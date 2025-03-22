<template>
  <div class="relative w-full touch-none select-none pt-5 pb-3">
    <div class="h-2 w-full rounded-full bg-cs-light overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-gradient-start to-gradient-end" 
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="updateValue"
      class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
    />
    <div 
      class="absolute h-5 w-5 rounded-full border-2 border-white bg-gradient-start shadow-glow" 
      :style="{ left: `calc(${percentage}% - 10px)`, top: '2px' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnSlider',
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    }
  },
  computed: {
    percentage() {
      return ((this.modelValue - this.min) / (this.max - this.min)) * 100;
    }
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', Number(event.target.value));
    }
  }
}
</script> 