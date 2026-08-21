<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/init'
import { firebaseUser } from '../stores/auth'
import { downloadCsv, downloadJson } from '../utils/export'

const PAGE_SIZE = 10
const books = ref([])
const loading = ref(true)
const errorMsg = ref('')
const exportStatus = ref('')
const page = ref(1)
const sortKey = ref('createdAt')
const sortDirection = ref('desc')
const filters = reactive({ name: '', isbn: '', genre: '', status: '', rating: '' })

const dateValue = (value) => value?.toDate?.().getTime?.() || 0
const displayDate = (value) => (value?.toDate ? value.toDate().toLocaleDateString() : 'New')
const exportDate = () => new Date().toISOString().slice(0, 10)

const filteredBooks = computed(() => {
  const search = (value) => String(value || '').toLowerCase()
  return books.value.filter((book) =>
    search(book.name).includes(filters.name.toLowerCase()) &&
    search(book.isbn).includes(filters.isbn.toLowerCase()) &&
    search(book.genre).includes(filters.genre.toLowerCase()) &&
    search(book.status).includes(filters.status.toLowerCase()) &&
    search(book.rating).includes(filters.rating.toLowerCase()),
  )
})

const sortedBooks = computed(() => [...filteredBooks.value].sort((a, b) => {
  const value = (book) => sortKey.value === 'createdAt'
    ? dateValue(book.createdAt)
    : book[sortKey.value] ?? ''
  const aValue = value(a)
  const bValue = value(b)
  const result = typeof aValue === 'number' && typeof bValue === 'number'
    ? aValue - bValue
    : String(aValue).localeCompare(String(bValue))
  return sortDirection.value === 'asc' ? result : -result
}))

const pageCount = computed(() => Math.max(1, Math.ceil(sortedBooks.value.length / PAGE_SIZE)))
const paginatedBooks = computed(() => sortedBooks.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

const sortBy = (key) => {
  if (sortKey.value === key) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const exportRows = () => sortedBooks.value.map((book) => [
  book.name,
  book.isbn,
  book.genre,
  book.status,
  book.rating,
  displayDate(book.createdAt),
])

const exportCsv = () => {
  downloadCsv(
    `my-library-${exportDate()}.csv`,
    ['Title', 'ISBN', 'Genre', 'Status', 'Rating', 'Added'],
    exportRows(),
  )
  exportStatus.value = `Downloaded ${sortedBooks.value.length} filtered book record(s) as CSV.`
}

const exportJson = () => {
  downloadJson(`my-library-${exportDate()}.json`, {
    exportedAt: new Date().toISOString(),
    recordCount: sortedBooks.value.length,
    books: sortedBooks.value.map((book) => ({
      title: book.name,
      isbn: book.isbn,
      genre: book.genre,
      status: book.status,
      rating: book.rating,
      added: displayDate(book.createdAt),
    })),
  })
  exportStatus.value = `Downloaded ${sortedBooks.value.length} filtered book record(s) as JSON.`
}

const fetchBooks = async () => {
  if (!firebaseUser.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    const snapshot = await getDocs(query(collection(db, 'books'), where('userId', '==', firebaseUser.value.uid)))
    books.value = snapshot.docs.map((book) => ({ id: book.id, ...book.data() }))
  } catch (error) {
    console.error('Unable to load personal library:', error)
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}

watch(filters, () => { page.value = 1 }, { deep: true })
watch(pageCount, (count) => { if (page.value > count) page.value = count })
onMounted(fetchBooks)
</script>

<template>
  <main class="container mt-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h1 class="mb-1">My Library</h1>
        <p class="text-muted mb-0">Your private books: search every column, sort headers, and browse 10 records per page.</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-outline-secondary" type="button" @click="exportCsv">Export CSV</button>
        <button class="btn btn-outline-secondary" type="button" @click="exportJson">Export JSON</button>
        <button class="btn btn-outline-primary" type="button" @click="fetchBooks">Refresh</button>
      </div>
    </div>

    <p class="visually-hidden" aria-live="polite">{{ exportStatus }}</p>
    <p v-if="exportStatus" class="text-success mb-3" role="status">{{ exportStatus }}</p>
    <p class="text-muted small">Exports include the records currently shown by your filters and sorting.</p>

    <p v-if="loading" class="text-muted">Loading your books...</p>
    <p v-else-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</p>
    <template v-else>
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('name')">Title</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('isbn')">ISBN</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('genre')">Genre</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('status')">Status</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('rating')">Rating</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('createdAt')">Added</button></th>
            </tr>
            <tr>
              <th><input v-model="filters.name" class="form-control form-control-sm" aria-label="Search title" placeholder="Search title" /></th>
              <th><input v-model="filters.isbn" class="form-control form-control-sm" aria-label="Search ISBN" placeholder="Search ISBN" /></th>
              <th><input v-model="filters.genre" class="form-control form-control-sm" aria-label="Search genre" placeholder="Search genre" /></th>
              <th><input v-model="filters.status" class="form-control form-control-sm" aria-label="Search status" placeholder="Search status" /></th>
              <th><input v-model="filters.rating" class="form-control form-control-sm" aria-label="Search rating" placeholder="1-5" /></th>
              <th aria-label="No filter for added date"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in paginatedBooks" :key="book.id">
              <td>{{ book.name }}</td><td>{{ book.isbn }}</td><td>{{ book.genre }}</td><td>{{ book.status }}</td><td>{{ book.rating }}/5</td><td>{{ displayDate(book.createdAt) }}</td>
            </tr>
            <tr v-if="paginatedBooks.length === 0"><td colspan="6" class="text-center text-muted py-4">No books match your filters. Add your first book to create a private record.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-muted small">{{ sortedBooks.length }} result(s), page {{ page }} of {{ pageCount }}</span>
        <div class="btn-group" role="group" aria-label="Book table pages">
          <button class="btn btn-outline-secondary btn-sm" :disabled="page === 1" @click="page--">Previous</button>
          <button class="btn btn-outline-secondary btn-sm" :disabled="page === pageCount" @click="page++">Next</button>
        </div>
      </div>
    </template>
  </main>
</template>
