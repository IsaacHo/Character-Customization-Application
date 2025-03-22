<template>
  <button
    :class="[
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
      variantClasses,
      sizeClasses,
      className
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ShadcnButton',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'primary', 'accent'].includes(val)
    },
    size: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'sm', 'lg', 'icon'].includes(val)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    variantClasses() {
      const variantMap = {
        default: 'bg-cs-medium text-text-primary border border-cs-light hover:bg-cs-light',
        destructive: 'bg-kol-red text-white hover:bg-red-600',
        outline: 'border border-kol-blue bg-transparent text-text-primary hover:bg-cs-light',
        secondary: 'bg-cs-light text-text-primary hover:bg-cs-medium hover:text-kol-blue',
        ghost: 'bg-transparent text-text-primary hover:bg-cs-light',
        link: 'text-kol-blue underline-offset-4 hover:underline bg-transparent',
        primary: 'bg-gradient-to-r from-gradient-start to-gradient-end text-white shadow-glow hover:shadow-[0_0_20px_rgba(0,168,255,0.7)]',
        accent: 'bg-highlight text-white hover:brightness-110'
      };
      
      return variantMap[this.variant] || variantMap.default;
    },
    sizeClasses() {
      const sizeMap = {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10'
      };
      
      return sizeMap[this.size] || sizeMap.default;
    }
  }
}
</script> 