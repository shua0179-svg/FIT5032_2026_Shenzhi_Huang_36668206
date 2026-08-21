<script setup>
import { computed, onMounted, ref } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/init'
import { firebaseUser } from '../stores/auth'

const books = ref([])
const records = ref([])
const loading = ref(false)
const error = ref('')
const activeFilter = ref('All')
const savedGoal = Number(localStorage.getItem('fit5032-reading-goal'))
const readingGoal = ref(Number.isFinite(savedGoal) && savedGoal > 0 ? savedGoal : 6)
const goalInput = ref(readingGoal.value)
const goalFeedback = ref('')

const statusOrder = ['Want to read', 'Reading', 'Finished']

const timestampToDate = (value) => {
  if (value?.toDate) return value.toDate()
  if (value instanceof Date) return value
  return value ? new Date(value) : null
}

const formatDate = (value) => {
  const date = timestampToDate(value)
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString()
    : 'Date unavailable'
}

const numericRating = (book) => Number(book.rating) || 0

const statusCounts = computed(() => {
  const counts = Object.fromEntries(statusOrder.map((status) => [status, 0]))
  books.value.forEach((book) => {
    const status = statusOrder.includes(book.status) ? book.status : 'Want to read'
    counts[status] += 1
  })
  return statusOrder.map((status) => ({ status, count: counts[status] }))
})

const totalBooks = computed(() => books.value.length)
const finishedBooks = computed(() => statusCounts.value.find((item) => item.status === 'Finished')?.count || 0)
const readingBooks = computed(() => statusCounts.value.find((item) => item.status === 'Reading')?.count || 0)

const goalPercent = computed(() => {
  if (!readingGoal.value) return 0
  return Math.min(100, Math.round((finishedBooks.value / readingGoal.value) * 100))
})

const visibleBooks = computed(() => {
  if (activeFilter.value === 'All') return books.value
  return books.value.filter((book) => book.status === activeFilter.value)
})

const genreBreakdown = computed(() => {
  const counts = new Map()
  visibleBooks.value.forEach((book) => {
    const genre = book.genre?.trim() || 'Uncategorised'
    counts.set(genre, (counts.get(genre) || 0) + 1)
  })
  return [...counts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    .sort((first, second) => second.count - first.count || first.genre.localeCompare(second.genre))
})

const recommendation = computed(() => {
  const wanted = books.value
    .filter((book) => book.status === 'Want to read')
    .sort((first, second) => numericRating(second) - numericRating(first))
  const inProgress = books.value
    .filter((book) => book.status === 'Reading')
    .sort((first, second) => numericRating(second) - numericRating(first))
  return wanted[0] || inProgress[0] || null
})

const recentRecords = computed(() => [...records.value]
  .sort((first, second) => {
    const firstTime = timestampToDate(first.updatedAt)?.getTime() || 0
    const secondTime = timestampToDate(second.updatedAt)?.getTime() || 0
    return secondTime - firstTime
  })
  .slice(0, 8))

const fetchInsights = async () => {
  if (!firebaseUser.value) return

  loading.value = true
  error.value = ''

  try {
    const userId = firebaseUser.value.uid
    const [bookSnapshot, recordSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'books'), where('userId', '==', userId))),
      getDocs(query(collection(db, 'readingRecords'), where('userId', '==', userId))),
    ])

    books.value = bookSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    records.value = recordSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
  } catch (requestError) {
    console.error('Unable to load reading insights:', requestError)
    error.value = 'Unable to load your reading insights. Please refresh and try again.'
  } finally {
    loading.value = false
  }
}

const saveGoal = () => {
  const nextGoal = Number(goalInput.value)
  if (!Number.isInteger(nextGoal) || nextGoal < 1 || nextGoal > 1000) {
    goalFeedback.value = 'Enter a whole-number reading goal between 1 and 1000.'
    return
  }

  readingGoal.value = nextGoal
  localStorage.setItem('fit5032-reading-goal', String(nextGoal))
  goalFeedback.value = `Reading goal updated to ${nextGoal} completed book${nextGoal === 1 ? '' : 's'}.`
}

onMounted(fetchInsights)
</script>

<template>
  <main class="container mt-4 mb-5" style="max-width: 1080px">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h1>Reading Insights</h1>
        <p class="text-muted mb-0">
          Explore your private library, set a reading goal, and decide what to read next.
        </p>
      </div>
      <button type="button" class="btn btn-outline-primary" :disabled="loading" @click="fetchInsights">
        {{ loading ? 'Refreshing…' : 'Refresh insights' }}
      </button>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <p v-if="loading" class="visually-hidden" aria-live="polite">Loading reading insights.</p>

    <section aria-labelledby="summary-heading" class="mb-4">
      <h2 id="summary-heading" class="h4">Library summary</h2>
      <div class="row g-3">
        <div class="col-sm-6 col-lg-3">
          <article class="card h-100 shadow-sm">
            <div class="card-body">
              <p class="text-muted mb-1">Books saved</p>
              <p class="display-6 mb-0">{{ totalBooks }}</p>
            </div>
          </article>
        </div>
        <div class="col-sm-6 col-lg-3">
          <article class="card h-100 shadow-sm">
            <div class="card-body">
              <p class="text-muted mb-1">Currently reading</p>
              <p class="display-6 mb-0">{{ readingBooks }}</p>
            </div>
          </article>
        </div>
        <div class="col-sm-6 col-lg-3">
          <article class="card h-100 shadow-sm">
            <div class="card-body">
              <p class="text-muted mb-1">Finished</p>
              <p class="display-6 mb-0">{{ finishedBooks }}</p>
            </div>
          </article>
        </div>
        <div class="col-sm-6 col-lg-3">
          <article class="card h-100 shadow-sm">
            <div class="card-body">
              <p class="text-muted mb-1">Reading records</p>
              <p class="display-6 mb-0">{{ records.length }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section aria-labelledby="goal-heading" class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 id="goal-heading" class="h4">Personal reading goal</h2>
            <p class="mb-0">{{ finishedBooks }} of {{ readingGoal }} books completed ({{ goalPercent }}%).</p>
          </div>
          <form class="d-flex align-items-end gap-2" @submit.prevent="saveGoal">
            <div>
              <label for="reading-goal" class="form-label mb-1">Completed books target</label>
              <input id="reading-goal" v-model.number="goalInput" type="number" min="1" max="1000" class="form-control" />
            </div>
            <button type="submit" class="btn btn-primary">Save goal</button>
          </form>
        </div>
        <div class="progress mt-3" role="progressbar" :aria-valuenow="goalPercent" aria-valuemin="0" aria-valuemax="100" :aria-label="`${goalPercent}% of reading goal completed`">
          <div class="progress-bar" :style="{ width: `${goalPercent}%` }">{{ goalPercent }}%</div>
        </div>
        <p v-if="goalFeedback" class="text-success mb-0 mt-2" aria-live="polite">{{ goalFeedback }}</p>
      </div>
    </section>

    <div class="row g-4 mb-4">
      <section class="col-lg-7" aria-labelledby="analysis-heading">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h2 id="analysis-heading" class="h4">Interactive library analysis</h2>
            <p class="text-muted">Filter the analysis by reading status.</p>
            <div class="btn-group flex-wrap mb-3" role="group" aria-label="Filter books by reading status">
              <button
                v-for="filter in ['All', ...statusOrder]"
                :key="filter"
                type="button"
                class="btn"
                :class="activeFilter === filter ? 'btn-primary' : 'btn-outline-primary'"
                :aria-pressed="activeFilter === filter"
                @click="activeFilter = filter"
              >
                {{ filter }}
              </button>
            </div>

            <div v-for="item in statusCounts" :key="item.status" class="mb-2">
              <div class="d-flex justify-content-between">
                <span>{{ item.status }}</span>
                <span>{{ item.count }}</span>
              </div>
              <div class="progress" role="progressbar" :aria-valuenow="item.count" aria-valuemin="0" :aria-valuemax="Math.max(totalBooks, 1)" :aria-label="`${item.status}: ${item.count} books`">
                <div class="progress-bar bg-info" :style="{ width: `${(item.count / Math.max(totalBooks, 1)) * 100}%` }"></div>
              </div>
            </div>

            <h3 class="h5 mt-4">Genres in this view</h3>
            <p v-if="genreBreakdown.length === 0" class="text-muted mb-0">Add books to see your genre breakdown.</p>
            <ul v-else class="list-group list-group-flush">
              <li v-for="item in genreBreakdown" :key="item.genre" class="list-group-item d-flex justify-content-between px-0">
                <span>{{ item.genre }}</span>
                <span class="badge text-bg-secondary rounded-pill">{{ item.count }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="col-lg-5" aria-labelledby="recommendation-heading">
        <div class="card h-100 shadow-sm border-primary">
          <div class="card-body">
            <h2 id="recommendation-heading" class="h4">What should I read next?</h2>
            <template v-if="recommendation">
              <p class="lead mb-1">{{ recommendation.name }}</p>
              <p class="mb-1">{{ recommendation.genre || 'Uncategorised' }}</p>
              <p class="text-muted">Status: {{ recommendation.status }} · Rating: {{ numericRating(recommendation) || 'Not rated' }}/5</p>
              <p class="small mb-0">
                This suggestion prioritises your highest-rated <strong>Want to read</strong> book, then your highest-rated in-progress book.
              </p>
            </template>
            <p v-else class="text-muted mb-0">Add a book to your library to receive a personalised suggestion.</p>
          </div>
        </div>
      </section>
    </div>

    <section aria-labelledby="timeline-heading" class="card shadow-sm">
      <div class="card-body">
        <h2 id="timeline-heading" class="h4">Recent reading activity</h2>
        <p v-if="recentRecords.length === 0" class="text-muted mb-0">Your reading activity will appear here after you add books.</p>
        <ol v-else class="list-group list-group-numbered">
          <li v-for="record in recentRecords" :key="record.id" class="list-group-item d-flex justify-content-between align-items-start gap-3">
            <div>
              <strong>{{ record.bookName || 'Untitled book' }}</strong>
              <div>{{ record.activity || 'Reading record updated' }} · {{ record.status || 'No status' }} · {{ record.rating || 'Not rated' }}/5</div>
            </div>
            <time class="text-muted text-nowrap" :datetime="timestampToDate(record.updatedAt)?.toISOString?.()">{{ formatDate(record.updatedAt) }}</time>
          </li>
        </ol>
      </div>
    </section>
  </main>
</template>
