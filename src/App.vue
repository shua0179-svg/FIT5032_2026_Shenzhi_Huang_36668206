<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from './stores/auth'

const router = useRouter()
const menuOpen = ref(false)

const closeMenu = () => {
  menuOpen.value = false
}

watch(() => router.currentRoute.value.fullPath, closeMenu)

const handleLogout = async () => {
  await logout()
  closeMenu()
  router.push('/FirebaseSignin')
}
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <nav class="navbar navbar-expand-xxl navbar-dark bg-primary px-4 app-navigation" aria-label="Primary navigation">
    <span class="navbar-brand mb-0 h1">FIT5032 Library</span>
    <button
      class="navbar-toggler"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="primary-navigation"
      aria-label="Toggle navigation menu"
      @click="menuOpen = !menuOpen"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div id="primary-navigation" class="navbar-collapse collapse" :class="{ show: menuOpen }">
      <div class="navbar-nav me-auto gap-1">
        <router-link class="nav-link" to="/" @click="closeMenu">Home</router-link>
        <router-link v-if="isAuthenticated" class="nav-link" to="/about" @click="closeMenu">About</router-link>
        <router-link class="nav-link" to="/FireRegister" @click="closeMenu">Fire Register</router-link>
        <router-link class="nav-link" to="/FirebaseSignin" @click="closeMenu">Firebase Sign In</router-link>
        <router-link class="nav-link" to="/FirebaseLogout" @click="closeMenu">Firebase Logout</router-link>
        <router-link v-if="isAuthenticated" class="nav-link" to="/addbook" @click="closeMenu">Add Book</router-link>
        <router-link v-if="isAuthenticated" class="nav-link" to="/library" @click="closeMenu">My Library</router-link>
        <router-link v-if="isAuthenticated" class="nav-link" to="/reading-records" @click="closeMenu">Reading Records</router-link>
        <router-link v-if="isAuthenticated" class="nav-link" to="/reading-insights" @click="closeMenu">Reading Insights</router-link>
        <router-link class="nav-link" to="/map-explorer" @click="closeMenu">Map Explorer</router-link>
        <router-link v-if="isAuthenticated" class="nav-link" to="/share-library" @click="closeMenu">Share Library</router-link>
        <router-link class="nav-link" to="/book-counter" @click="closeMenu">Book Counter</router-link>
        <router-link class="nav-link" to="/CountBookAPI" @click="closeMenu">Count Book API</router-link>
        <router-link class="nav-link" to="/GetAllBookAPI" @click="closeMenu">Get All Book API</router-link>
        <router-link class="nav-link" to="/weather" @click="closeMenu">Weather API</router-link>
      </div>
      <router-link v-if="!isAuthenticated" to="/FirebaseSignin" class="btn btn-light mt-2 mt-xxl-0" @click="closeMenu">
        Sign in
      </router-link>
      <button v-else class="btn btn-outline-light mt-2 mt-xxl-0" @click="handleLogout">
        Logout
      </button>
    </div>
  </nav>

  <div id="main-content" tabindex="-1">
    <router-view />
  </div>
</template>
