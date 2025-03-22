<template>
  <div class="value-badge">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GameBadge'
}
</script>

<style scoped>
.value-badge {
  background-color: rgba(0, 168, 255, 0.1);
  color: #00a8ff;
  border: 1px solid rgba(0, 168, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 0 5px rgba(0, 168, 255, 0.2);
}
</style> 