//// components/ServerComponent.vue
<template>
  <div class="server-component">
    <h2>Server-Side Rendered Component</h2>
    <p>This component was rendered at: {{ timestamp }}</p>
    <p>Server-side components are great for:</p>
    <ul>
      <li>SEO optimization</li>
      <li>Faster initial page load</li>
      <li>Better performance on low-end devices</li>
    </ul>
  </div>
</template>

<script setup>
const timestamp = new Date().toISOString()
</script>