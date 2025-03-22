<template>
  <div 
    class="rounded-lg border border-cs-light bg-cs-medium shadow-game overflow-hidden"
    :class="className"
  >
    <div v-if="$slots.header" class="border-b border-cs-light px-6 py-4 flex items-center justify-between">
      <slot name="header"></slot>
    </div>
    <div class="p-6">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="border-t border-cs-light bg-cs-light/50 px-6 py-4">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnCard',
  props: {
    className: {
      type: String,
      default: ''
    }
  }
}
</script> 