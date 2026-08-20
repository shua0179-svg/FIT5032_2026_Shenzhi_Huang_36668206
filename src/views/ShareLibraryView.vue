<script setup>
import { computed, ref } from 'vue'
import emailjs from '@emailjs/browser'
import { firebaseUser } from '../stores/auth'

const formElement = ref(null)
const sending = ref(false)
const statusMsg = ref('')
const errorMsg = ref('')
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const isConfigured = computed(() => Boolean(serviceId && templateId && publicKey))

const sendLibraryEmail = async () => {
  statusMsg.value = ''
  errorMsg.value = ''
  if (!isConfigured.value) {
    errorMsg.value = 'EmailJS is not configured yet. Add the three VITE_EMAILJS values to .env.local and restart the development server.'
    return
  }

  sending.value = true
  try {
    await emailjs.sendForm(serviceId, templateId, formElement.value, { publicKey })
    statusMsg.value = 'Your library sharing email was sent successfully.'
    formElement.value.reset()
  } catch (error) {
    console.error('EmailJS send failed:', error)
    errorMsg.value = 'The email could not be sent. Check your EmailJS service, template, and attachment setting.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <main class="container mt-4" style="max-width: 760px">
    <h1>Share My Library</h1>
    <p class="text-muted">Send a library update by email and optionally attach a file. Your EmailJS template must define a Form File Attachment called <code>attachment</code>.</p>

    <form ref="formElement" enctype="multipart/form-data" @submit.prevent="sendLibraryEmail">
      <input type="hidden" name="from_email" :value="firebaseUser?.email || ''" />
      <div class="mb-3">
        <label for="to-email" class="form-label">Recipient email</label>
        <input id="to-email" name="to_email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="email-subject" class="form-label">Subject</label>
        <input id="email-subject" name="subject" type="text" class="form-control" value="My FIT5032 library update" required />
      </div>
      <div class="mb-3">
        <label for="email-message" class="form-label">Message</label>
        <textarea id="email-message" name="message" rows="6" class="form-control" required placeholder="Share the books you are currently reading..."></textarea>
      </div>
      <div class="mb-3">
        <label for="attachment" class="form-label">Optional attachment</label>
        <input id="attachment" name="attachment" type="file" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="sending">{{ sending ? 'Sending...' : 'Send email' }}</button>
    </form>

    <p v-if="statusMsg" class="alert alert-success mt-3">{{ statusMsg }}</p>
    <p v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</p>
  </main>
</template>
