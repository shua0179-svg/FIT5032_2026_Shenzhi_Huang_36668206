<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from './stores/auth'

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login') // Go back to the login page after logging out
}
</script>

<template>
  <!-- Navigation bar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-4">
    <span class="navbar-brand mb-0 h1">FIT5032 Library</span>
    <div class="navbar-nav me-auto flex-row gap-3">
      <router-link class="nav-link" to="/">Home</router-link>
      <!-- Conditional routing: the About link only shows once logged in -->
      <router-link v-if="isAuthenticated" class="nav-link" to="/about">
        About
      </router-link>
      <!-- Firebase Authentication links -->
      <router-link class="nav-link" to="/FireRegister">Fire Register</router-link>
      <router-link class="nav-link" to="/FirebaseSignin">Firebase Sign In</router-link>
      <router-link class="nav-link" to="/FirebaseLogout">Firebase Logout</router-link>
      <router-link class="nav-link" to="/addbook">Add Book</router-link>
    </div>
    <!-- Conditional rendering: show Login when logged out, Logout when logged in -->
    <router-link v-if="!isAuthenticated" to="/login" class="btn btn-light">
      Login
    </router-link>
    <button v-else class="btn btn-outline-light" @click="handleLogout">
      Logout
    </button>
  </nav>

  <!-- Router outlet: the component matching the current route renders here -->
  <router-view />
</template>
