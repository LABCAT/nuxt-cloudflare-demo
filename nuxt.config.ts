// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Configure for Cloudflare Pages
  nitro: {
    preset: 'cloudflare-pages'
  }
})