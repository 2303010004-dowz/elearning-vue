import { createRouter, createWebHistory } from 'vue-router'

// Lazy Loading Views
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const DashboardView = () => import('../views/DashboardView.vue')

const routes = [
  // --- AUTH ROUTES ---
  { path: '/', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { 
    path: '/forgot-password', 
    name: 'forgot-password', 
    component: () => import('../views/ForgotPasswordView.vue') 
  },

  // --- PROTECTED ROUTES ---
  { 
    path: '/dashboard', 
    name: 'dashboard', 
    component: DashboardView, 
    meta: { requiresAuth: true, role: 'siswa' } 
  },
  { 
    path: '/student-class', 
    name: 'student-class', 
    component: () => import('../views/StudentClassView.vue'), 
    meta: { requiresAuth: true, role: 'siswa' } 
  },
  { 
    path: '/student-tasks', 
    name: 'student-tasks', 
    component: () => import('../views/StudentTaskView.vue'), 
    meta: { requiresAuth: true, role: 'siswa' } 
  },
  { 
    path: '/discussion-forum', 
    name: 'discussion-forum', 
    component: () => import('../views/DiscussionForumView.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/profile', 
    name: 'profile', 
    component: () => import('../views/ProfileView.vue'), 
    meta: { requiresAuth: true } 
  },
  {
    path: '/class/bahasa-indonesia',
    name: 'bahasa-indonesia',
    component: () => import('../views/ClassDetailView.vue'),
    meta: { requiresAuth: true, role: 'siswa' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token_jwt')
  const userRole = localStorage.getItem('user_role')
  
  const isAuth = !!token
  const isAuthPage = ['login', 'register', 'forgot-password'].includes(to.name)

  // 1. Proteksi akses halaman privat
  if (to.meta.requiresAuth && !isAuth) {
    return next({ name: 'login' })
  }

  // 2. Cegah akses halaman auth jika sudah login
  if (isAuth && isAuthPage) {
    return next({ name: 'dashboard' })
  }

  // 3. Proteksi Role (Optional: Jika Anda ingin membatasi akses guru/siswa)
  if (to.meta.role && userRole !== to.meta.role) {
    return next({ name: 'dashboard' }) // Redirect jika role tidak sesuai
  }

  next()
})

export default router