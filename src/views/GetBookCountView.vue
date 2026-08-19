<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const error = ref('')
const loading = ref(false)

const functionUrl = 'https://book-counter-urbifljfpk.cn-hangzhou.fcapp.run'

const getBookCount = async () => {
  loading.value = true
  count.value = null
  error.value = ''

  try {
    const response = await axios.get(functionUrl)
    count.value = response.data.count
  } catch (err) {
    console.error(err)
    error.value = 'Unable to retrieve the book count.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="container mt-4" style="max-width: 680px">
    <h1 class="mb-4">Book Counter</h1>

    <button class="btn btn-primary" :disabled="loading" @click="getBookCount">
      {{ loading ? 'Loading...' : 'Get Book Count' }}
    </button>

    <div v-if="count !== null" class="alert alert-success mt-4">
      Total number of books: {{ count }}
    </div>

    <div v-else-if="error" class="alert alert-danger mt-4">
      {{ error }}
    </div>
  </main>
</template>