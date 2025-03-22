<template>
  <div v-show="isActive" class="tab-panel">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabPanel',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.tab-panel {
  width: 100%;
}
</style> 