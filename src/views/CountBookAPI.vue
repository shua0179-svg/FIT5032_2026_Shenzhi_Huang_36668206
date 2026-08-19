<script setup>
import { computed, ref } from 'vue'
import authorsData from '../assets/json/authors.json'

// 将本地 JSON 数据保存到 Vue 状态中
const authors = ref(authorsData)

// 计算作者数量
const authorsCount = computed(() => authors.value.length)

// 计算所有作者的 famousWorks 总数
const totalBooks = computed(() => {
  return authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
})

// 组织为 API 常见的 JSON response 格式
const apiResponse = computed(() => {
  return {
    success: true,
    data: {
      authorsCount: authorsCount.value,
      totalBooks: totalBooks.value,
      authors: authors.value.map((author) => ({
        name: author.name,
        bookCount: author.famousWorks.length,
      })),
    },
    timestamp: new Date().toISOString(),
  }
})
</script>

<template>
  <main class="container mt-4" style="max-width: 850px">
    <h1>Count Book API</h1>
    <p class="text-muted">Local JSON API response</p>

    <pre class="bg-dark text-light p-4 rounded">{{
      JSON.stringify(apiResponse, null, 2)
    }}</pre>
  </main>
</template>