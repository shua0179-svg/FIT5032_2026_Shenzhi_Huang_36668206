<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/init'
import { firebaseUser } from '../stores/auth'
import { downloadCsv, downloadJson } from '../utils/export'

const PAGE_SIZE = 10
const records = ref([])
const loading = ref(true)
const errorMsg = ref('')
const exportStatus = ref('')
const page = ref(1)
const sortKey = ref('updatedAt')
const sortDirection = ref('desc')
const filters = reactive({ bookName: '', genre: '', status: '', rating: '', activity: '' })

const dateValue = (value) => value?.toDate?.().getTime?.() || 0
const displayDate = (value) => (value?.toDate ? value.toDate().toLocaleDateString() : 'New')
const exportDate = () => new Date().toISOString().slice(0, 10)
const filteredRecords = computed(() => {
  const search = (value) => String(value || '').toLowerCase()
  return records.value.filter((record) =>
    search(record.bookName).includes(filters.bookName.toLowerCase()) &&
    search(record.genre).includes(filters.genre.toLowerCase()) &&
    search(record.status).includes(filters.status.toLowerCase()) &&
    search(record.rating).includes(filters.rating.toLowerCase()) &&
    search(record.activity).includes(filters.activity.toLowerCase()),
  )
})
const sortedRecords = computed(() => [...filteredRecords.value].sort((a, b) => {
  const value = (record) => sortKey.value === 'updatedAt'
    ? dateValue(record.updatedAt)
    : record[sortKey.value] ?? ''
  const aValue = value(a)
  const bValue = value(b)
  const result = typeof aValue === 'number' && typeof bValue === 'number'
    ? aValue - bValue
    : String(aValue).localeCompare(String(bValue))
  return sortDirection.value === 'asc' ? result : -result
}))
const pageCount = computed(() => Math.max(1, Math.ceil(sortedRecords.value.length / PAGE_SIZE)))
const paginatedRecords = computed(() => sortedRecords.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

const sortBy = (key) => {
  if (sortKey.value === key) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDirection.value = 'asc' }
}

const exportRows = () => sortedRecords.value.map((record) => [
  record.bookName,
  record.genre,
  record.status,
  record.rating,
  record.activity,
  displayDate(record.updatedAt),
])

const exportCsv = () => {
  downloadCsv(
    `reading-records-${exportDate()}.csv`,
    ['Book', 'Genre', 'Status', 'Rating', 'Activity', 'Updated'],
    exportRows(),
  )
  exportStatus.value = `Downloaded ${sortedRecords.value.length} filtered reading record(s) as CSV.`
}

const exportJson = () => {
  downloadJson(`reading-records-${exportDate()}.json`, {
    exportedAt: new Date().toISOString(),
    recordCount: sortedRecords.value.length,
    readingRecords: sortedRecords.value.map((record) => ({
      book: record.bookName,
      genre: record.genre,
      status: record.status,
      rating: record.rating,
      activity: record.activity,
      updated: displayDate(record.updatedAt),
    })),
  })
  exportStatus.value = `Downloaded ${sortedRecords.value.length} filtered reading record(s) as JSON.`
}
const fetchRecords = async () => {
  if (!firebaseUser.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    const snapshot = await getDocs(query(collection(db, 'readingRecords'), where('userId', '==', firebaseUser.value.uid)))
    records.value = snapshot.docs.map((record) => ({ id: record.id, ...record.data() }))
  } catch (error) {
    console.error('Unable to load reading records:', error)
    errorMsg.value = error.message
  } finally { loading.value = false }
}

watch(filters, () => { page.value = 1 }, { deep: true })
watch(pageCount, (count) => { if (page.value > count) page.value = count })
onMounted(fetchRecords)
</script>

<template>
  <main class="container mt-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h1 class="mb-1">Reading Records</h1>
        <p class="text-muted mb-0">A second personal interactive table with independent column search, sorting, and pagination.</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-outline-secondary" type="button" @click="exportCsv">Export CSV</button>
        <button class="btn btn-outline-secondary" type="button" @click="exportJson">Export JSON</button>
        <button class="btn btn-outline-primary" type="button" @click="fetchRecords">Refresh</button>
      </div>
    </div>
    <p class="visually-hidden" aria-live="polite">{{ exportStatus }}</p>
    <p v-if="exportStatus" class="text-success mb-3" role="status">{{ exportStatus }}</p>
    <p class="text-muted small">Exports include the records currently shown by your filters and sorting.</p>
    <p v-if="loading" class="text-muted">Loading your reading records...</p>
    <p v-else-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</p>
    <template v-else>
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('bookName')">Book</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('genre')">Genre</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('status')">Status</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('rating')">Rating</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('activity')">Activity</button></th>
              <th><button class="btn btn-link p-0 text-decoration-none" @click="sortBy('updatedAt')">Updated</button></th>
            </tr>
            <tr>
              <th><input v-model="filters.bookName" class="form-control form-control-sm" aria-label="Search book name" placeholder="Search book" /></th>
              <th><input v-model="filters.genre" class="form-control form-control-sm" aria-label="Search genre" placeholder="Search genre" /></th>
              <th><input v-model="filters.status" class="form-control form-control-sm" aria-label="Search status" placeholder="Search status" /></th>
              <th><input v-model="filters.rating" class="form-control form-control-sm" aria-label="Search rating" placeholder="1-5" /></th>
              <th><input v-model="filters.activity" class="form-control form-control-sm" aria-label="Search activity" placeholder="Search activity" /></th>
              <th aria-label="No filter for update date"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in paginatedRecords" :key="record.id">
              <td>{{ record.bookName }}</td><td>{{ record.genre }}</td><td>{{ record.status }}</td><td>{{ record.rating }}/5</td><td>{{ record.activity }}</td><td>{{ displayDate(record.updatedAt) }}</td>
            </tr>
            <tr v-if="paginatedRecords.length === 0"><td colspan="6" class="text-center text-muted py-4">No reading records yet. Add a book to create your first record.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-muted small">{{ sortedRecords.length }} result(s), page {{ page }} of {{ pageCount }}</span>
        <div class="btn-group" role="group" aria-label="Reading record table pages">
          <button class="btn btn-outline-secondary btn-sm" :disabled="page === 1" @click="page--">Previous</button>
          <button class="btn btn-outline-secondary btn-sm" :disabled="page === pageCount" @click="page++">Next</button>
        </div>
      </div>
    </template>
  </main>
</template>
