import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/init'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
    },
    {
      path: '/plans',
      name: 'plans',
      component: () => import('../views/PlansView.vue'),
    },
    {
      path: '/directory',
      name: 'directory',
      component: () => import('../views/DirectoryView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: () => import('../views/DoctorsView.vue'),
      meta: {
        authenticated: true,
      }
    },
  ],
})

router.beforeEach(( to, from, next) => {
  console.log('<<',auth.AuthImp)
  if (to.path === '/login' && auth.currentUser ){
    next('/doctors')
  }else if (to.matched.some((record) => record.meta.authenticated) && !auth.currentUser){
    next('/login')
  }else{
    next()
  }
});

export default router
