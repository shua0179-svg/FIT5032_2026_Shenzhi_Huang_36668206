import type { User } from 'firebase/auth'
import type { Ref } from 'vue'

export const isAuthenticated: Ref<boolean>
export const firebaseUser: Ref<User | null>
export const firebaseAuthReady: Promise<void>

export function login(): void
export function logout(): Promise<void>
