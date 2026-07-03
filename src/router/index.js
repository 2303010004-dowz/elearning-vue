import { createRouter, createWebHistory } from 'vue-router'

// Lazy Loading Views
const LoginView = () => import('../views/auth/LoginView.vue')
const RegisterView = () => import('../views/auth/RegisterView.vue')
const ForgotPasswordView = () => import('../views/auth/ForgotPasswordView.vue')

const DashboardView = () => import('../views/dashboard/DashboardView.vue')
const DashboardGuruView = () => import('../views/dashboard/DashboardGuruView.vue')

const TeacherClassView = () => import('../views/classes/TeacherClassView.vue')
const StudentClassView = () => import('../views/classes/StudentClassView.vue')
const CreateClassView = () => import('../views/classes/CreateClassView.vue')
const ClassDetailView = () => import('../views/classes/ClassDetailView.vue')

const TeacherTugasView = () => import('../views/tugas/TeacherTugasView.vue')
const StudentTugasView = () => import('../views/tugas/StudentTugasView.vue')
const CreateTugasView = () => import('../views/tugas/CreateTugasView.vue')
const EditTugasView = () => import('../views/tugas/EditTugasView.vue')
const NilaiTugasView = () => import('../views/tugas/NilaiTugasView.vue')

// View untuk Materi Guru
const MateriGuruView = () => import('../views/materi/MateriGuruView.vue') 
const MateriSiswaView = () => import('../views/materi/MateriSiswaView.vue')

const DiscussionForumView = () => import('../views/forum/DiscussionForumView.vue')
const ProfileView = () => import('../views/profile/ProfileView.vue')

const routes = [
  // --- ROOT REDIRECT ---
  { path: '/', redirect: '/login' },

  // --- AUTH ROUTES ---
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },

  // --- PROTECTED ROUTES (SISWA) ---
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true, role: 'siswa' } },
  { path: '/student-class', name: 'student-class', component: StudentClassView, meta: { requiresAuth: true, role: 'siswa' } },
  { path: '/student-tugas', name: 'student-tugas', component: StudentTugasView, meta: { requiresAuth: true, role: 'siswa' } },
  { path: '/class-detail/:classId', name: 'class-detail', component: ClassDetailView, meta: { requiresAuth: true, role: 'siswa' } },
  
  // --- PROTECTED ROUTES (GURU) ---
  { path: '/dashboard-guru', name: 'dashboard-guru', component: DashboardGuruView, meta: { requiresAuth: true, role: 'guru' } },
  { path: '/teacher-class', name: 'teacher-class', component: TeacherClassView, meta: { requiresAuth: true, role: 'guru' } },
  { path: '/teacher-class/create', name: 'create-class', component: CreateClassView, meta: { requiresAuth: true, role: 'guru' } },
  
  // Route Materi Guru
  { path: '/materi-guru', name: 'materi-guru', component: MateriGuruView, meta: { requiresAuth: true, role: 'guru' } },
  { path: '/student-materi', name: 'student-materi', component: MateriSiswaView, meta: { requiresAuth: true, role: 'siswa' } },
  // Tugas Guru
  { path: '/grading', name: 'grading', component: TeacherTugasView, meta: { requiresAuth: true, role: 'guru' } },
  { path: '/create-tugas', name: 'create-tugas', component: CreateTugasView, meta: { requiresAuth: true, role: 'guru' } },
  { path: '/tugas/:id/edit', name: 'edit-tugas', component: EditTugasView, meta: { requiresAuth: true, role: 'guru' } },
  { path: '/tugas/:id/nilai', name: 'nilai-tugas', component: NilaiTugasView, meta: { requiresAuth: true, role: 'guru' } },
  
  // --- SHARED ROUTES ---
  { path: '/discussion-forum', name: 'discussion-forum', component: DiscussionForumView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } }
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

  if (to.meta.requiresAuth && !isAuth) {
    return next({ name: 'login' })
  }

  if (isAuth && isAuthPage) {
    return next({ name: userRole === 'guru' ? 'dashboard-guru' : 'dashboard' })
  }

  if (to.meta.role && userRole !== to.meta.role) {
    return next({ name: userRole === 'guru' ? 'dashboard-guru' : 'dashboard' })
  }

  next()
})

export default router