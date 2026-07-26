<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/init'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

const books = ref([]) // books with isbn > 1000
const advancedBooks = ref([]) // where + orderBy + limit demo
const editingId = ref(null)
const editName = ref('')

// 8.5: retrieve books with isbn > 1000 using a "where" query
const fetchBooks = async () => {
  books.value = []
  const q = query(collection(db, 'books'), where('isbn', '>', 1000))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((docSnap) => {
    books.value.push({ id: docSnap.id, ...docSnap.data() })
  })
  console.log('Books with isbn > 1000:', books.value)
}

// 8.2 (HD): combined query using where + orderBy + limit
const fetchAdvanced = async () => {
  advancedBooks.value = []
  const q = query(
    collection(db, 'books'),
    where('isbn', '>', 1000),
    orderBy('isbn', 'desc'),
    limit(3),
  )
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((docSnap) => {
    advancedBooks.value.push({ id: docSnap.id, ...docSnap.data() })
  })
  console.log('Advanced query (where + orderBy + limit):', advancedBooks.value)
}

// 8.2 (HD): update a document
const startEdit = (book) => {
  editingId.value = book.id
  editName.value = book.name
}
const saveEdit = async (id) => {
  await updateDoc(doc(db, 'books', id), { name: editName.value })
  console.log('Updated book', id, 'new name:', editName.value)
  editingId.value = null
  await fetchBooks()
}

// 8.2 (HD): delete a document
const removeBook = async (id) => {
  await deleteDoc(doc(db, 'books', id))
  console.log('Deleted book', id)
  await fetchBooks()
}

// Load the list on mount
onMounted(() => {
  fetchBooks()
})

// Expose so the parent (AddBookView) can refresh after adding a book
defineExpose({ fetchBooks })
</script>

<template>
  <div>
    <h2 class="mb-3">Books with ISBN &gt; 1000</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ISBN</th>
          <th>Name</th>
          <th style="width: 180px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.isbn }}</td>
          <td>
            <span v-if="editingId !== book.id">{{ book.name }}</span>
            <input v-else v-model="editName" class="form-control form-control-sm" />
          </td>
          <td>
            <template v-if="editingId !== book.id">
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="startEdit(book)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="removeBook(book.id)"
              >
                Delete
              </button>
            </template>
            <template v-else>
              <button class="btn btn-sm btn-success me-2" @click="saveEdit(book.id)">
                Save
              </button>
              <button class="btn btn-sm btn-secondary" @click="editingId = null">
                Cancel
              </button>
            </template>
          </td>
        </tr>
        <tr v-if="books.length === 0">
          <td colspan="3" class="text-center text-muted">No books with ISBN &gt; 1000 yet.</td>
        </tr>
      </tbody>
    </table>

    <hr />
    <h2 class="mb-3">Advanced query: where + orderBy + limit</h2>
    <button class="btn btn-outline-secondary mb-3" @click="fetchAdvanced">
      Run query (top 3 by ISBN desc, where isbn &gt; 1000)
    </button>
    <ul class="list-group">
      <li
        v-for="book in advancedBooks"
        :key="book.id"
        class="list-group-item d-flex justify-content-between"
      >
        <span>{{ book.name }}</span>
        <span class="text-muted">ISBN: {{ book.isbn }}</span>
      </li>
    </ul>
  </div>
</template>
