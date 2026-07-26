<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'
import { getRole } from '../firebase/roles'

const router = useRouter()
const statusMsg = ref('')

// Show who is currently signed in (before logging out) — for the console screenshot
const checkCurrentUser = () => {
  const auth = getAuth()
  console.log('Before logout, current user:', auth.currentUser)
  if (auth.currentUser) {
    console.log('Current role:', getRole(auth.currentUser.email))
    statusMsg.value = `Currently signed in as ${auth.currentUser.email}`
  } else {
    statusMsg.value = 'No user is currently signed in.'
  }
}

const logout = () => {
  const auth = getAuth()
  console.log('Before logout, current user:', auth.currentUser)
  signOut(auth)
    .then(() => {
      console.log('Signed out successfully!')
      // After signing out this is null — capture it for the screenshot
      console.log('After logout, current user:', auth.currentUser)
      statusMsg.value = 'Signed out. Current user is now null (see console).'
      router.push('/FirebaseSignin')
    })
    .catch((error) => {
      console.log(error.code)
      statusMsg.value = error.message
    })
}
</script>

<template>
  <div class="container mt-5" style="max-width: 480px">
    <h1 class="text-center mb-4">Logout</h1>
    <div class="d-grid gap-2">
      <button class="btn btn-outline-secondary" @click="checkCurrentUser">
        Check current user (console)
      </button>
      <button class="btn btn-danger" @click="logout">Sign out</button>
    </div>
    <p v-if="statusMsg" class="text-center mt-3">{{ statusMsg }}</p>
    <p class="text-muted mt-2 text-center small">
      Open the browser Console (F12) to see the current user before logout and
      <strong>null</strong> after.
    </p>
  </div>
</template>
