import { ref } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase/init'

// Shared authentication state: all components and the router guard read this
// same ref, so the navigation bar updates automatically after login/logout.
// The initial value is read from localStorage so the login state survives a refresh.
export const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
export const firebaseUser = ref(null)

let markAuthReady
export const firebaseAuthReady = new Promise((resolve) => {
  markAuthReady = resolve
})

onAuthStateChanged(auth, (user) => {
  firebaseUser.value = user
  isAuthenticated.value = Boolean(user) || localStorage.getItem('isAuthenticated') === 'true'
  markAuthReady()
})

export function login() {
  isAuthenticated.value = true
  localStorage.setItem('isAuthenticated', 'true')
}

export async function logout() {
  localStorage.removeItem('isAuthenticated')
  await signOut(auth)
  isAuthenticated.value = false
}
