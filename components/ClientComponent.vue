//// components/ClientComponent.vue
<template>
  <div class="client-component">
    <h2>Client-Side Rendered Component</h2>
    <p>Current time: {{ currentTime }}</p>
    <button @click="updateTime">Update Time</button>
    <p>Times button clicked: {{ clickCount }}</p>
  </div>
</template>

<script setup>
const currentTime = ref(new Date().toLocaleTimeString())
const clickCount = ref(0)

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString()
  clickCount.value++
}
</script>