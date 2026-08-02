<script setup>
import { computed } from 'vue'
import authorsData from '../assets/json/authors.json'

// Convert the nested author data into one list containing every book.
const allBooks = computed(() => {
  return authorsData.flatMap((author) =>
    author.famousWorks.map((book) => ({
      title: book.title,
      year: book.year,
      author: author.name,
    })),
  )
})

// Present the local data in a typical API JSON response format.
const apiResponse = computed(() => ({
  success: true,
  data: {
    totalBooks: allBooks.value.length,
    books: allBooks.value,
  },
  timestamp: new Date().toISOString(),
}))
</script>

<template>
  <main class="container mt-4" style="max-width: 850px">
    <h1>Get All Book API</h1>
    <p class="text-muted">All books displayed as a local JSON API response</p>

    <pre class="bg-dark text-light p-4 rounded">{{
      JSON.stringify(apiResponse, null, 2)
    }}</pre>
  </main>
</template>
