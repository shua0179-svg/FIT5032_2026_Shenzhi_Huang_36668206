<script setup>
import { ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton', // 用来演示 v-bind 单向绑定
})

// 3.2 存放每个字段的错误信息，初始都是 null（没有错误）
const errors = ref({
  username: null,
  email: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null,
})

const submittedCards = ref([])

// 3.3 验证用户名：至少 3 个字符
const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

// 3.7 验证密码：至少 8 位，且含大写、小写、数字、特殊字符
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

// 额外验证 1：Email 格式（用正则检查是否是合法邮箱）
const validateEmail = (blur) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    if (blur) errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = null
  }
}

// 额外验证 2：确认密码（两次输入必须一致）
const validateConfirmPassword = (blur) => {
  if (formData.value.confirmPassword !== formData.value.password) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

// 3.11 自己练习：验证 Gender（必须选一个）
const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select a gender.'
  } else {
    errors.value.gender = null
  }
}

// 3.11 自己练习：验证 Reason（至少 10 个字符）
const validateReason = (blur) => {
  if (formData.value.reason.length < 10) {
    if (blur) errors.value.reason = 'Reason must be at least 10 characters.'
  } else {
    errors.value.reason = null
  }
}

// 5.3.2 若 Reason 里包含 'friend'，实时显示一条绿色欢迎信息
// computed 是响应式的：formData.reason 一变，hasFriend 自动重新计算
const hasFriend = computed(() =>
  formData.value.reason.toLowerCase().includes('friend'),
)

// 3.5 & 3.9 提交时先跑所有验证，全部通过才添加 card
const submitForm = () => {
  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateGender(true)
  validateReason(true)

  if (
    !errors.value.username &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.gender &&
    !errors.value.reason
  ) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

// Clear 按钮：清空输入内容，但保留已经提交的 Card
const clearForm = () => {
  formData.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
              @blur="() => validateName(true)"
              @input="() => validateName(false)"
            />
            <div v-if="errors.username" class="text-danger">
              {{ errors.username }}
            </div>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-control"
              @blur="() => validateEmail(true)"
              @input="() => validateEmail(false)"
            />
            <div v-if="errors.email" class="text-danger">
              {{ errors.email }}
            </div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="form-control"
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)"
            />
            <div v-if="errors.password" class="text-danger">
              {{ errors.password }}
            </div>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password:</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              class="form-control"
              @blur="() => validateConfirmPassword(true)"
              @input="() => validateConfirmPassword(false)"
            />
            <div v-if="errors.confirmPassword" class="text-danger">
              {{ errors.confirmPassword }}
            </div>
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
              @blur="() => validateReason(true)"
              @input="() => validateReason(false)"
            ></textarea>
            <div v-if="errors.reason" class="text-danger">
              {{ errors.reason }}
            </div>
            <!-- 5.3.2 reason 里含 'friend' 时显示绿色提示 -->
            <div v-if="hasFriend" class="text-success">
              Great to have a friend
            </div>
          </div>

          <div class="mb-3">
            <label for="gender" class="form-label">Gender:</label>
            <select
              id="gender"
              v-model="formData.gender"
              class="form-select"
              @blur="() => validateGender(true)"
              @change="() => validateGender(false)"
            >
              <option value="" disabled>Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            <div v-if="errors.gender" class="text-danger">
              {{ errors.gender }}
            </div>
          </div>

          <!-- Activity 5.4：用 v-bind（单向绑定）演示，对比 v-model 的双向绑定 -->
          <div class="mb-3">
            <label for="suburb" class="form-label">Suburb</label>
            <input
              type="text"
              class="form-control"
              id="suburb"
              v-bind:value="formData.suburb"
            />
          </div>

          <button type="submit" class="btn btn-primary me-2">Submit</button>
          <button type="button" class="btn btn-secondary" @click="clearForm">
            Clear
          </button>
        </form>

        <!-- 4.3 用 PrimeVue DataTable 显示已提交的用户信息 -->
        <div class="mt-5" v-if="submittedCards.length">
          <h2 class="text-center mb-3">Submitted Users</h2>
          <DataTable :value="submittedCards" paginator :rows="5" tableStyle="min-width: 50rem">
            <Column field="username" header="Username" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="password" header="Password"></Column>
            <Column field="isAustralian" header="Australian Resident">
              <template #body="slotProps">
                {{ slotProps.data.isAustralian ? 'Yes' : 'No' }}
              </template>
            </Column>
            <Column field="gender" header="Gender" sortable></Column>
            <Column field="reason" header="Reason"></Column>
          </DataTable>
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
