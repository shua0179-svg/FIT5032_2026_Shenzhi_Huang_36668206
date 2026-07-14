import { ref } from 'vue'

// 共享的登录状态：所有组件和路由守卫都读同一个 ref，
// 所以登录/登出后，导航栏等界面会自动更新。
// 初始值从 localStorage 读取，刷新页面后仍保留登录状态。
export const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

export function login() {
  isAuthenticated.value = true
  localStorage.setItem('isAuthenticated', 'true')
}

export function logout() {
  isAuthenticated.value = false
  localStorage.setItem('isAuthenticated', 'false')
}
