<!-- app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>
<script setup>
useHead({
  script: [
    {
      src: "https://cdn.jsdelivr.net/gh/LABCAT/my-web-component@latest/dist/my-web-component.js",
      type: "module"
    }
  ]
});
</script>