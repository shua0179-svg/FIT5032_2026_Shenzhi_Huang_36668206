<script setup>
import { computed, ref } from 'vue'
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '../firebase/init'
import { firebaseUser } from '../stores/auth'

const isbn = ref(null)
const name = ref('')
const genre = ref('Fiction')
const status = ref('Want to read')
const rating = ref(3)
const errorMsg = ref('')
const successMsg = ref('')
const ownerEmail = computed(() => firebaseUser.value?.email || 'Unknown user')

const addBook = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (!firebaseUser.value) {
    errorMsg.value = 'Please sign in with Firebase before adding a book.'
    return
  }

  try {
    const batch = writeBatch(db)
    const bookRef = doc(collection(db, 'books'))
    const recordRef = doc(collection(db, 'readingRecords'))
    const book = {
      userId: firebaseUser.value.uid,
      ownerEmail: ownerEmail.value,
      isbn: Number(isbn.value),
      name: name.value,
      genre: genre.value,
      status: status.value,
      rating: Number(rating.value),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    batch.set(bookRef, book)
    batch.set(recordRef, {
      userId: firebaseUser.value.uid,
      ownerEmail: ownerEmail.value,
      bookId: bookRef.id,
      bookName: name.value,
      isbn: Number(isbn.value),
      genre: genre.value,
      status: status.value,
      rating: Number(rating.value),
      activity: 'Book added to library',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    await batch.commit()

    isbn.value = null
    name.value = ''
    genre.value = 'Fiction'
    status.value = 'Want to read'
    rating.value = 3
    successMsg.value = 'Book and reading record added to your personal library.'
  } catch (error) {
    console.error('Error adding book:', error)
    errorMsg.value = error.message
  }
}
</script>

<template>
  <div class="container mt-4" style="max-width: 680px">
    <h1 class="mb-2">Add Book</h1>
    <p class="text-muted">This book will only be visible to {{ ownerEmail }}.</p>

    <form @submit.prevent="addBook">
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN</label>
        <input id="isbn" v-model.number="isbn" type="number" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Book title</label>
        <input id="name" v-model="name" type="text" class="form-control" required />
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="genre" class="form-label">Genre</label>
          <input id="genre" v-model="genre" type="text" class="form-control" required />
        </div>
        <div class="col-md-6 mb-3">
          <label for="status" class="form-label">Reading status</label>
          <select id="status" v-model="status" class="form-select">
            <option>Want to read</option>
            <option>Reading</option>
            <option>Finished</option>
          </select>
        </div>
      </div>
      <div class="mb-3">
        <label for="rating" class="form-label">Rating (1 to 5)</label>
        <input id="rating" v-model.number="rating" type="number" min="1" max="5" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Add Book</button>
    </form>

    <p v-if="successMsg" class="alert alert-success mt-3">{{ successMsg }}</p>
    <p v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</p>
    <router-link class="btn btn-outline-primary mt-2" to="/library">Open My Library</router-link>
  </div>
</template>
