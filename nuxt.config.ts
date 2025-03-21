export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
 
  // Configure for Cloudflare Pages
  nitro: {
    preset: 'cloudflare-pages'
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('my-')
    }
  },
 
  // Add Supabase module
  modules: [
    '@nuxtjs/supabase'
  ],
 
  // Let Nuxt magic handle the configuration
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/']
    }
  }
})