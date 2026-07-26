<script setup>
import { ref } from 'vue'
import { db } from '../firebase/init'
import { collection, addDoc } from 'firebase/firestore'
import BookList from '../components/BookList.vue'

// isbn is bound with .number so it is stored as a Number, not a String
const isbn = ref(null)
const name = ref('')
const bookListRef = ref(null)

// 8.4: async task that adds a book document to the "books" collection
const addBook = async () => {
  try {
    const docRef = await addDoc(collection(db, 'books'), {
      isbn: Number(isbn.value),
      name: name.value,
    })
    console.log('Book added with ID:', docRef.id)
    isbn.value = null
    name.value = ''
    // refresh the list rendered below
    if (bookListRef.value) await bookListRef.value.fetchBooks()
  } catch (error) {
    console.error('Error adding book:', error)
  }
}
</script>

<template>
  <div class="container mt-4" style="max-width: 680px">
    <h1 class="text-center mb-4">Add Book</h1>
    <form @submit.prevent="addBook">
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN</label>
        <input
          id="isbn"
          v-model.number="isbn"
          type="number"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Add Book</button>
    </form>

    <!-- BookList component loaded directly under the AddBook page -->
    <BookList ref="bookListRef" class="mt-5" />
  </div>
</template>
