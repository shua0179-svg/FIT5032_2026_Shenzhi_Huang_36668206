<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()

// Inputs bound with v-model (two-way binding)
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const register = () => {
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log('Firebase Register Successful!')
      console.log('Registered user:', auth.currentUser)
      console.log('User credential:', data.user)
      router.push('/FirebaseSignin') // After registering, go to the sign-in page
    })
    .catch((error) => {
      console.log(error.code)
      errorMsg.value = error.message
    })
}
</script>

<template>
  <div class="container mt-5" style="max-width: 420px">
    <h1 class="text-center mb-4">Sign up</h1>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label for="reg-email" class="form-label">Email</label>
        <input
          id="reg-email"
          v-model="email"
          type="text"
          class="form-control"
          placeholder="Email"
        />
      </div>
      <div class="mb-3">
        <label for="reg-password" class="form-label">Password</label>
        <input
          id="reg-password"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Password (at least 6 characters)"
        />
      </div>
      <button type="submit" class="btn btn-primary w-100">Save to Firebase</button>
    </form>
    <p v-if="errorMsg" class="text-danger mt-3 text-center">{{ errorMsg }}</p>
  </div>
</template>
