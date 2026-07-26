import { ref } from 'vue'

// Shared authentication state: all components and the router guard read this
// same ref, so the navigation bar updates automatically after login/logout.
// The initial value is read from localStorage so the login state survives a refresh.
export const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

export function login() {
  isAuthenticated.value = true
  localStorage.setItem('isAuthenticated', 'true')
}

export function logout() {
  isAuthenticated.value = false
  localStorage.setItem('isAuthenticated', 'false')
}
