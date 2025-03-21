<!-- pages/index.vue -->
<template>
    <div class="home">
      <header class="home__header">
        <h1 class="home__title">Nuxt + Cloudflare Demo</h1>
        
        <div class="home__auth">
          <template v-if="user">
            <!-- Show dashboard link and logout if user is logged in -->
            <NuxtLink to="/dashboard" class="home__button home__button--primary">
              Dashboard
            </NuxtLink>
            <button @click="handleSignOut" class="home__button home__button--secondary">
              Sign Out
            </button>
          </template>
          <template v-else>
            <!-- Show login and signup links if user is not logged in -->
            <NuxtLink to="/login" class="home__button home__button--primary">
              Sign In
            </NuxtLink>
            <NuxtLink to="/signup" class="home__button home__button--secondary">
              Sign Up
            </NuxtLink>
          </template>
        </div>
      </header>
      
      <main class="home__main">
        <section class="home__hero">
          <h2 class="home__subtitle">Welcome to our application</h2>
          <p class="home__description">
            This is a demo project showcasing Nuxt.js deployed on Cloudflare Pages
            with Supabase authentication.
          </p>
          
          <div class="home__cta">
            <NuxtLink 
              :to="user ? '/dashboard' : '/signup'" 
              class="home__button home__button--large"
            >
              {{ user ? 'Go to Dashboard' : 'Get Started' }}
            </NuxtLink>
          </div>
        </section>
        
        <section class="home__features">
          <div class="home__feature">
            <h3>Nuxt 3</h3>
            <p>Built with the latest version of Nuxt, offering improved performance and features.</p>
          </div>
          
          <div class="home__feature">
            <h3>Cloudflare Pages</h3>
            <p>Deployed on Cloudflare's global network for blazing fast performance.</p>
          </div>
          
          <div class="home__feature">
            <h3>Supabase Auth</h3>
            <p>Complete authentication system with multiple login methods.</p>
          </div>
        </section>
      </main>
      
      <footer class="home__footer">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { createClient } from '@supabase/supabase-js'
  
  // Get Supabase config from runtime configuration
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabase.url
  const supabaseKey = config.public.supabase.key
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // User state
  const user = ref(null)
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Redirect to home page after sign out
      navigateTo('/')
    } catch (err) {
      console.error('Error signing out:', err.message)
    }
  }
  
  // Get user on component mount
  onMounted(async () => {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user || null
    
    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
    })
  })
  </script>
  
  <style lang="scss" scoped>
  :root {
    --color-primary: #3b82f6;
    --color-primary-dark: #2563eb;
    --color-border: #e5e7eb;
    --color-text: #333;
    --color-background: #fff;
    --color-background-light: #f9fafb;
  }
  
  .home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    
    &__button {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      margin-left: 10px;
      
      &--primary {
        background-color: var(--color-primary);
        color: white;
        border: none;
        
        &:hover {
          background-color: var(--color-primary-dark);
        }
      }
      
      &--secondary {
        background-color: var(--color-background-light);
        border: 1px solid var(--color-border);
        color: var(--color-text);
      }
      
      &--large {
        padding: 12px 24px;
        font-size: 1.1rem;
      }
    }
    
    &__hero {
      text-align: center;
      margin-bottom: 60px;
    }
    
    &__features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    &__feature {
      padding: 20px;
      border-radius: 8px;
      background-color: var(--color-background-light);
      border: 1px solid var(--color-border);
    }
    
    &__footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--color-border);
    }
  }
  </style>