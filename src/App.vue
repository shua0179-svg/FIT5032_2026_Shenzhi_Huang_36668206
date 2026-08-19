<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from './stores/auth'

const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/FirebaseSignin')
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
      <router-link v-if="isAuthenticated" class="nav-link" to="/addbook">Add Book</router-link>
      <router-link v-if="isAuthenticated" class="nav-link" to="/library">My Library</router-link>
      <router-link v-if="isAuthenticated" class="nav-link" to="/reading-records">
        Reading Records
      </router-link>
      <router-link class="nav-link" to="/book-counter">Book Counter</router-link>
      <router-link class="nav-link" to="/CountBookAPI">Count Book API</router-link>
      <router-link class="nav-link" to="/GetAllBookAPI">Get All Book API</router-link>
      <router-link class="nav-link" to="/weather">Weather API</router-link>
    </div>
    <!-- Conditional rendering: show Login when logged out, Logout when logged in -->
    <router-link v-if="!isAuthenticated" to="/FirebaseSignin" class="btn btn-light">
      Sign in
    </router-link>
    <button v-else class="btn btn-outline-light" @click="handleLogout">
      Logout
    </button>
  </nav>

  <!-- Router outlet: the component matching the current route renders here -->
  <router-view />
</template>
