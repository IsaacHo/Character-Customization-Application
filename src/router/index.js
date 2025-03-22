import { createRouter, createWebHistory } from 'vue-router'
import FaceCustomizer from '../components/FaceCustomizer.vue'

const routes = [
  {
    path: '/',
    name: 'FaceCustomizer',
    component: FaceCustomizer
  },
  // 其他路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 