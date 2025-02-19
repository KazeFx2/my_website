import { createRouter, createWebHashHistory } from 'vue-router'
import HomePageVue from '@/components/homPage/HomePage.vue'
import LoginPageVue from '@/components/loginPage/LoginPage.vue'
import CalcPageVue from '@/components/calcpage/CalcPage.vue'
import ReportUploadPage from '@/components/report_controls/ReportUploadPage.vue'
import ReportDownload from '@/components/report_controls/ReportDownload.vue'

const routes = [
  {
    path: '/',
    component: HomePageVue
  },
  {
    path: '/doc',
    component: HomePageVue
  },
  {
    path: '/about',
    component: HomePageVue
  },
  {
    path: '/login',
    component: LoginPageVue
  },
  {
    path: '/calc',
    component: CalcPageVue
  },
  {
    path: '/report_upload',
    component: ReportUploadPage
  }, 
  {
    path: '/report_download',
    component: ReportDownload
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
