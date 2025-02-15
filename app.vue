//// app.vue
<template>
  <div>
    <h1>Nuxt + Cloudflare Pages Demo</h1>

    <!-- Server-side rendered component -->
    <div>
      <ServerComponent />
      <my-component message="Hello from My Web Component!"></my-component>
    </div>

    <!-- Client-side rendered component -->
    <ClientOnly>
      <ClientComponent />
    </ClientOnly>


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