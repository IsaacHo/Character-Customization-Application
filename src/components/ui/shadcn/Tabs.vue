<template>
  <div class="w-full">
    <div class="flex border-b border-cs-light">
      <button
        v-for="(tab, idx) in tabs"
        :key="idx"
        @click="select(idx)"
        class="px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2"
        :class="idx === modelValue 
          ? 'border-kol-blue text-kol-blue' 
          : 'border-transparent text-text-secondary hover:text-text-primary'"
      >
        {{ tab }}
      </button>
    </div>
    <div class="mt-2">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnTabs',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Number,
      default: 0
    }
  },
  methods: {
    select(index) {
      this.$emit('update:modelValue', index);
    }
  }
}
</script> 