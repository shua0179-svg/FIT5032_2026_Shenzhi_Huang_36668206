<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

const cityQuery = ref('Clayton, AU')
const weather = ref(null)
const loading = ref(false)
const error = ref('')
const source = ref('')

const iconUrl = computed(() => {
  const icon = weather.value?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})

const weatherDescription = computed(() => weather.value?.weather?.[0]?.description ?? '')

const requestWeather = async (params, requestSource) => {
  if (!apiKey) {
    error.value = 'Missing API key. Add VITE_OPENWEATHER_API_KEY to .env.local, then restart npm run dev.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await axios.get(API_URL, {
      params: {
        ...params,
        appid: apiKey,
        units: 'metric',
      },
    })

    weather.value = response.data
    source.value = requestSource
  } catch (requestError) {
    weather.value = null
    error.value = requestError.response?.data?.message || 'Unable to retrieve weather data.'
  } finally {
    loading.value = false
  }
}

const searchByCity = () => {
  const query = cityQuery.value.trim()
  if (!query) {
    error.value = 'Enter a city, for example Clayton, AU.'
    return
  }

  requestWeather({ q: query }, 'City search')
}

const loadCurrentLocationWeather = () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by this browser. Search by city instead.'
    return
  }

  loading.value = true
  error.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      requestWeather(
        {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        'Current location',
      )
    },
    () => {
      loading.value = false
      error.value = 'Location access was not granted. Search by city instead.'
    },
    { enableHighAccuracy: false, timeout: 10000 },
  )
}

onMounted(loadCurrentLocationWeather)
</script>

<template>
  <main class="container mt-4" style="max-width: 760px">
    <h1>Weather API</h1>
    <p class="text-muted">Current weather from OpenWeather</p>

    <form class="row g-2 mb-3" @submit.prevent="searchByCity">
      <div class="col-sm">
        <label class="form-label" for="city">Search weather by city</label>
        <input
          id="city"
          v-model="cityQuery"
          class="form-control"
          placeholder="Clayton, AU"
          :disabled="loading"
        />
      </div>
      <div class="col-sm-auto d-flex align-items-end gap-2">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          Search
        </button>
        <button class="btn btn-outline-secondary" type="button" :disabled="loading" @click="loadCurrentLocationWeather">
          Use Current Location
        </button>
      </div>
    </form>

    <div v-if="loading" class="alert alert-info">Loading weather...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <section v-else-if="weather" class="card shadow-sm">
      <div class="card-body d-flex align-items-center gap-4">
        <img v-if="iconUrl" :src="iconUrl" :alt="weatherDescription" width="100" height="100" />
        <div>
          <h2 class="h3 mb-1">{{ weather.name }}, {{ weather.sys.country }}</h2>
          <p class="text-capitalize mb-2">{{ weatherDescription }}</p>
          <p class="display-6 mb-0">{{ Math.round(weather.main.temp) }}°C</p>
          <small class="text-muted">Source: {{ source }}</small>
        </div>
      </div>
    </section>
  </main>
</template>
