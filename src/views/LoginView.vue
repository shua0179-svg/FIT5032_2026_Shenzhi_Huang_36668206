<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../stores/auth'

const router = useRouter()

// Hardcoded credentials (for this exercise; a real app would query a backend)
const HARDCODED_USERNAME = 'admin'
const HARDCODED_PASSWORD = 'password123'

// Inputs bound with v-model (two-way binding)
const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (
    username.value === HARDCODED_USERNAME &&
    password.value === HARDCODED_PASSWORD
  ) {
    login() // Update the global authentication state
    router.push('/about') // On success, go to the protected About page
  } else {
    router.push('/access-denied') // Wrong credentials, go to Access Denied
  }
}
</script>

<template>
  <div class="container mt-5" style="max-width: 420px">
    <h1 class="text-center mb-4">Member Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="login-username" class="form-label">Username</label>
        <input
          id="login-username"
          v-model="username"
          type="text"
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="login-password" class="form-label">Password</label>
        <input
          id="login-password"
          v-model="password"
          type="password"
          class="form-control"
        />
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
    <p class="text-muted mt-3 text-center">
      Hint: use <strong>admin</strong> / <strong>password123</strong>
    </p>
  </div>
</template>
