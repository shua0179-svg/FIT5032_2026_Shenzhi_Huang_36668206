<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../stores/auth'

const router = useRouter()

// 硬编码的凭据（本练习用；真实项目会查后端数据库）
const HARDCODED_USERNAME = 'admin'
const HARDCODED_PASSWORD = 'password123'

// v-model 双向绑定的输入
const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (
    username.value === HARDCODED_USERNAME &&
    password.value === HARDCODED_PASSWORD
  ) {
    login() // 更新全局登录状态
    router.push('/about') // 登录成功 → 进入受保护的 About 页
  } else {
    router.push('/access-denied') // 凭据错误 → 访问被拒页
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
