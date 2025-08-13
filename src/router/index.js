import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
      path: '/panel',
      name: 'panel',
      component: () => import('../views/PanelView.vue'),
      children: [
        {
          path: '/schedule',
          name: 'schedule',
          component: () => import('../views/panel/Schedule.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/patients',
          name: 'patients',
          component: () => import('../views/panel/Patients.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/doctors',
          name: 'doctors',
          component: () => import('../views/panel/Doctors.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../views/panel/Users.vue'),
          meta: {
            requiresAuth: true,
          },
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject,
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      alert('No tienes acceso')
      next('/')
    }
  } else {
    next()
  }
})

export default router
