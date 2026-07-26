<script setup>
import { isAuthenticated } from '../stores/auth'
</script>

<template>
  <div class="container mt-5 text-center">
    <h1 class="text-danger">Access Denied</h1>
    <!-- v-if / v-else: show different content based on the login state -->
    <div v-if="!isAuthenticated">
      <p class="lead">
        You must be logged in to view that page, or the credentials you entered
        were incorrect.
      </p>
      <router-link to="/login" class="btn btn-primary">Go to Login</router-link>
    </div>
    <div v-else>
      <p class="lead">
        You are logged in, but you don't have permission to view that page.
      </p>
      <router-link to="/" class="btn btn-secondary">Back to Home</router-link>
    </div>
  </div>
</template>
