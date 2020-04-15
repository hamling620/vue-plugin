import home from '../views/home.vue'
import about from '../views/about.vue'

export default [
  {
    path: '/home',
    component: home
  },
  {
    path: '/about',
    component: about
  },
  {
    path: '/store',
    component: () => import('../views/store.vue')
  }
]
