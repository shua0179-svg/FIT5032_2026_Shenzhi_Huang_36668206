<script setup>
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: '',
})

const submittedCards = ref([])

const submitForm = () => {
  submittedCards.value.push({
    ...formData.value,
  })
}

// Clear 按钮：清空输入内容，但保留已经提交的 Card
const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: '',
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-sm-8 offset-sm-2">
        <h1 class="text-center mb-3">User Information Form / Credentials</h1>

        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="username" class="form-label">Username:</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="form-control"
            />
          </div>

          <div class="mb-3 form-check">
            <input
              id="isAustralian"
              v-model="formData.isAustralian"
              type="checkbox"
              class="form-check-input"
            />
            <label for="isAustralian" class="form-check-label">
              Australian Resident?
            </label>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Reason For Joining:</label>
            <textarea
              id="reason"
              v-model="formData.reason"
              rows="3"
              class="form-control"
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="gender" class="form-label">Gender:</label>
            <select id="gender" v-model="formData.gender" class="form-select">
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary me-2">Submit</button>
          <button type="button" class="btn btn-secondary" @click="clearForm">
            Clear
          </button>
        </form>
        <div class="row mt-5" v-if="submittedCards.length">
  <div class="d-flex flex-wrap justify-content-start">
    <div
      v-for="(card, index) in submittedCards"
      :key="index"
      class="card m-2"
      style="width: 18rem"
    >
      <div class="card-header">
        User Information
      </div>

      <ul class="list-group list-group-flush">
        <li class="list-group-item">Username: {{ card.username }}</li>
        <li class="list-group-item">Password: {{ card.password }}</li>
        <li class="list-group-item">
          Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
        </li>
        <li class="list-group-item">Gender: {{ card.gender }}</li>
        <li class="list-group-item">Reason: {{ card.reason }}</li>
      </ul>
    </div>
  </div>
</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>