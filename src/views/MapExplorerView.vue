<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const DEFAULT_LOCATION = { lat: -37.9105, lng: 145.1362, label: 'Monash University, Clayton' }
const POI_TYPES = {
  bookstore: { label: 'Bookstores', filter: '["shop"="books"]' },
  library: { label: 'Libraries', filter: '["amenity"="library"]' },
  cafe: { label: 'Cafes', filter: '["amenity"="cafe"]' },
}
const mapElement = ref(null)
const searchQuery = ref('library')
const placeQuery = ref('Clayton, Victoria, Australia')
const places = ref([])
const selectedPlace = ref(null)
const loading = ref(false)
const errorMsg = ref('')
const routeSummary = ref('')

let map
let markerLayer
let routeLayer
let originLayer
let origin = { ...DEFAULT_LOCATION }

const renderOrigin = () => {
  originLayer?.clearLayers()
  L.circleMarker([origin.lat, origin.lng], {
    radius: 9,
    color: '#0d6efd',
    fillColor: '#0d6efd',
    fillOpacity: 0.9,
  }).bindTooltip(`Start: ${origin.label}`).addTo(originLayer)
}

const clearRoute = () => {
  routeLayer?.clearLayers()
  routeSummary.value = ''
}

const showPlace = (place) => {
  selectedPlace.value = place
  clearRoute()
  map.flyTo([place.lat, place.lng], 15)
}

const searchPlaces = async () => {
  const location = placeQuery.value.trim()
  const poiType = POI_TYPES[searchQuery.value]
  if (!poiType || !location) {
    errorMsg.value = 'Choose a place type and enter a search location.'
    return
  }

  loading.value = true
  errorMsg.value = ''
  selectedPlace.value = null
  clearRoute()
  try {
    const locationResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { format: 'jsonv2', q: location, limit: 1 },
    })
    const searchCentre = locationResponse.data?.[0]
    if (!searchCentre) throw new Error('Search location not found')

    const lat = Number(searchCentre.lat)
    const lng = Number(searchCentre.lon)
    const overpassQuery = `[out:json][timeout:25];nwr${poiType.filter}(around:5000,${lat},${lng});out center;`
    const response = await axios.get('https://overpass-api.de/api/interpreter', {
      params: { data: overpassQuery },
    })
    places.value = response.data.elements
      .map((place) => ({
        id: `${place.type}-${place.id}`,
        name: place.tags?.name || `${poiType.label.slice(0, -1)} (${place.type})`,
        lat: Number(place.lat ?? place.center?.lat),
        lng: Number(place.lon ?? place.center?.lon),
        type: poiType.label,
      }))
      .filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng))
    markerLayer.clearLayers()
    places.value.forEach((place) => {
      L.circleMarker([place.lat, place.lng], {
        radius: 8,
        color: '#198754',
        fillColor: '#198754',
        fillOpacity: 0.85,
      }).bindTooltip(place.name).on('click', () => showPlace(place)).addTo(markerLayer)
    })
    if (places.value.length) map.fitBounds(L.featureGroup(markerLayer.getLayers()).getBounds().pad(0.2))
  } catch (error) {
    console.error('POI search failed:', error)
    errorMsg.value = 'Unable to search OpenStreetMap places. Please try again shortly.'
  } finally {
    loading.value = false
  }
}

const findRoute = async (place) => {
  selectedPlace.value = place
  loading.value = true
  errorMsg.value = ''
  clearRoute()
  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${place.lng},${place.lat}`,
      { params: { overview: 'full', geometries: 'geojson' } },
    )
    const route = response.data.routes?.[0]
    if (!route) throw new Error('No route returned')
    routeLayer = L.geoJSON(route.geometry, { style: { color: '#dc3545', weight: 5 } }).addTo(map)
    map.fitBounds(routeLayer.getBounds().pad(0.2))
    routeSummary.value = `${(route.distance / 1000).toFixed(1)} km estimated driving route, about ${Math.round(route.duration / 60)} minutes.`
  } catch (error) {
    console.error('Route request failed:', error)
    errorMsg.value = 'A route could not be calculated for this place.'
  } finally {
    loading.value = false
  }
}

const useCurrentLocation = () => {
  if (!navigator.geolocation) {
    errorMsg.value = 'Geolocation is not supported by this browser.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      origin = { lat: position.coords.latitude, lng: position.coords.longitude, label: 'Your current location' }
      renderOrigin()
      map.flyTo([origin.lat, origin.lng], 14)
      errorMsg.value = ''
    },
    () => { errorMsg.value = 'Location access was not granted. Using Monash University, Clayton as the route start.' },
    { enableHighAccuracy: false, timeout: 10000 },
  )
}

onMounted(async () => {
  await nextTick()
  map = L.map(mapElement.value).setView([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  originLayer = L.layerGroup().addTo(map)
  renderOrigin()
  searchPlaces()
})

onBeforeUnmount(() => map?.remove())
</script>

<template>
  <main class="container mt-4 mb-5">
    <h1>Library Map Explorer</h1>
    <p class="text-muted">Search nearby book-related places and calculate a route from your current location or Monash University, Clayton.</p>

    <form class="row g-3 align-items-end mb-3" @submit.prevent="searchPlaces">
      <div class="col-md-4">
        <label for="poi-query" class="form-label">Place type</label>
        <select id="poi-query" v-model="searchQuery" class="form-select">
          <option v-for="(poiType, key) in POI_TYPES" :key="key" :value="key">{{ poiType.label }}</option>
        </select>
      </div>
      <div class="col-md-5">
        <label for="poi-location" class="form-label">Search around</label>
        <input id="poi-location" v-model="placeQuery" class="form-control" placeholder="Clayton, Victoria, Australia" />
      </div>
      <div class="col-md-3 d-flex gap-2">
        <button class="btn btn-primary" :disabled="loading" type="submit">Search POIs</button>
        <button class="btn btn-outline-secondary" type="button" @click="useCurrentLocation">Use my location</button>
      </div>
    </form>

    <p v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</p>
    <p v-if="routeSummary" class="alert alert-info">{{ routeSummary }}</p>

    <div ref="mapElement" class="border rounded mb-3" style="height: 460px" aria-label="Interactive map showing library places"></div>

    <section aria-labelledby="poi-results-heading">
      <h2 id="poi-results-heading" class="h4">Search results</h2>
      <p v-if="loading" class="text-muted">Loading map data...</p>
      <p v-else-if="places.length === 0" class="text-muted">No places found. Try a broader search.</p>
      <ul v-else class="list-group">
        <li v-for="place in places" :key="place.id" class="list-group-item d-flex flex-wrap justify-content-between gap-2">
          <div><strong>{{ place.name }}</strong><span class="text-muted ms-2">{{ place.type }}</span></div>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-primary" @click="showPlace(place)">Show on map</button>
            <button class="btn btn-sm btn-success" @click="findRoute(place)">Get route</button>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>
