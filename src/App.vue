<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from './stores/auth'

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login') // 登出后回到登录页
}
</script>

<template>
  <!-- 导航栏 -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-4">
    <span class="navbar-brand mb-0 h1">FIT5032 Library</span>
    <div class="navbar-nav me-auto flex-row gap-3">
      <router-link class="nav-link" to="/">Home</router-link>
      <!-- 条件路由：About 链接只有登录后才显示 -->
      <router-link v-if="isAuthenticated" class="nav-link" to="/about">
        About
      </router-link>
    </div>
    <!-- 条件渲染：未登录显示 Login，已登录显示 Logout -->
    <router-link v-if="!isAuthenticated" to="/login" class="btn btn-light">
      Login
    </router-link>
    <button v-else class="btn btn-outline-light" @click="handleLogout">
      Logout
    </button>
  </nav>

  <!-- 路由出口：当前路由匹配的页面会渲染在这里 -->
  <router-view />
</template>
