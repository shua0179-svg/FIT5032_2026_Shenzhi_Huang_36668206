<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getRole } from '../firebase/roles'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const currentRole = ref('')

const signin = () => {
  const auth = getAuth()
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log('Firebase Sign in Successful!')
      // Capture who is the current signed-in user (used for the screenshot)
      console.log('Current user:', auth.currentUser)
      console.log('Signed-in email:', data.user.email)
      // 7.2 (HD): resolve and log the role of the signed-in user
      const role = getRole(data.user.email)
      currentRole.value = role
      console.log('Logged in as role:', role)
      router.push(router.currentRoute.value.query.redirect || '/')
    })
    .catch((error) => {
      console.log(error.code)
      errorMsg.value = error.message
    })
}
</script>

<template>
  <div class="container mt-5" style="max-width: 420px">
    <h1 class="text-center mb-4">Sign in</h1>
    <form @submit.prevent="signin">
      <div class="mb-3">
        <label for="signin-email" class="form-label">Email</label>
        <input
          id="signin-email"
          v-model="email"
          type="text"
          class="form-control"
          placeholder="Email"
        />
      </div>
      <div class="mb-3">
        <label for="signin-password" class="form-label">Password</label>
        <input
          id="signin-password"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Password"
        />
      </div>
      <button type="submit" class="btn btn-primary w-100">Sign in via Firebase</button>
    </form>
    <p v-if="currentRole" class="text-success mt-3 text-center">
      Signed in as role: <strong>{{ currentRole }}</strong>
    </p>
    <p v-if="errorMsg" class="text-danger mt-3 text-center">{{ errorMsg }}</p>
    <p class="text-muted mt-2 text-center small">
      Try <strong>admin@test.com</strong> and <strong>user@test.com</strong> to see different roles.
    </p>
  </div>
</template>
