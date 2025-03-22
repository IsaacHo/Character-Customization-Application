<template>
  <slot :active-index="activeIndex" :set-active-index="setActiveIndex"></slot>
</template>

<script>
export default {
  name: 'NavContext',
  props: {
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeIndex: this.initialIndex
    };
  },
  methods: {
    setActiveIndex(index) {
      this.activeIndex = index;
    }
  }
}
</script> 