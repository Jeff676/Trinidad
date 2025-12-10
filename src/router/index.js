import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/servicios',
      name: 'servicios',
      component: () => import('../views/ServicesView.vue'),
    },
    {
      path: '/planes',
      name: 'planes',
      component: () => import('../views/PlansView.vue'),
    },
    {
      path: '/directorio',
      name: 'directorio',
      component: () => import('../views/DirectoryView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/acerca',
      name: 'acerca',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/formulario',
      name: 'formulario',
      component: () => import('../views/DoctorsRegisterView.vue'),
    },
    {
      path: '/panel',
      name: 'panel',
      component: () => import('../views/PanelView.vue'),
      children: [
        {
          path: '/agenda',
          name: 'agenda',
          component: () => import('../views/panel/Schedule.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/pacientes',
          name: 'pacientes',
          component: () => import('../views/panel/Patients.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/paciente',
          name: 'paciente',
          component: () => import('../views/panel/Patient.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/doctores',
          name: 'doctores',
          component: () => import('../views/panel/Doctors.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/usuarios',
          name: 'usuarios',
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
