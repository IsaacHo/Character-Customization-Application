<template>
  <div ref="container" :style="{ width, height }"></div>
</template>

<script>
import lottie from 'lottie-web';

export default {
  name: 'LottieAnimation',
  props: {
    path: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    loop: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      animation: null
    };
  },
  mounted() {
    this.loadAnimation();
  },
  watch: {
    path() {
      this.loadAnimation();
    }
  },
  methods: {
    loadAnimation() {
      if (this.animation) {
        this.animation.destroy();
      }
      
      this.animation = lottie.loadAnimation({
        container: this.$refs.container,
        renderer: 'svg',
        loop: this.loop,
        autoplay: this.autoplay,
        path: this.path,
      });
      
      this.animation.setSpeed(this.speed);
    },
    play() {
      if (this.animation) {
        this.animation.play();
      }
    },
    pause() {
      if (this.animation) {
        this.animation.pause();
      }
    },
    stop() {
      if (this.animation) {
        this.animation.stop();
      }
    }
  },
  beforeUnmount() {
    if (this.animation) {
      this.animation.destroy();
    }
  }
}
</script> 