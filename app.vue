//// app.vue
<template>
  <div>
    <h1>Nuxt + Cloudflare Pages Demo</h1>
    
    <!-- Server-side rendered component -->
    <div>
      <ServerComponent />
    </div>
    
    <!-- Client-side rendered component -->
    <ClientOnly>
      <ClientComponent />
    </ClientOnly>
  </div>
</template>