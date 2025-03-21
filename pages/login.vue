<!-- pages/login.vue -->
<template>
    <div class="login">
      <h1 class="login__title">Sign In</h1>
      
      <!-- Email/Password Login Form -->
      <form @submit.prevent="handleEmailLogin" class="login__form">
        <div class="login__form-group">
          <label for="email" class="login__label">Email</label>
          <input 
            id="email"
            type="email" 
            v-model="email" 
            placeholder="your@email.com" 
            required
            class="login__input"
          />
        </div>
        
        <div class="login__form-group" v-if="!magicLink">
          <label for="password" class="login__label">Password</label>
          <input 
            id="password"
            type="password" 
            v-model="password" 
            placeholder="Password" 
            required
            class="login__input"
          />
        </div>
        
        <div class="login__form-actions">
          <button type="submit" class="login__button login__button--primary">
            {{ magicLink ? 'Send Magic Link' : 'Sign In' }}
          </button>
          <a @click.prevent="toggleMagicLink" class="login__link">
            {{ magicLink ? 'Use Password' : 'Use Magic Link' }}
          </a>
        </div>
      </form>
      
      <div class="login__divider">or continue with</div>
      
      <!-- Social Login Options -->
      <div class="login__social">
        <button @click="handleGoogleLogin" class="login__button login__button--social">
          Google
        </button>
        
        <button @click="handleMicrosoftLogin" class="login__button login__button--social">
          Microsoft
        </button>
      </div>
      
      <div class="login__signup">
        <p>Don't have an account? <a href="/signup" class="login__link">Sign Up</a></p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useSupabaseClient, useRouter } from '#imports'
  
  // Form state
  const email = ref('')
  const password = ref('')
  const magicLink = ref(false)
  const error = ref(null)
  
  // Get Supabase client and router
  const supabase = useSupabaseClient()
  const router = useRouter()
  
  // Toggle between password and magic link
  const toggleMagicLink = () => {
    magicLink.value = !magicLink.value
  }
  
  // Email/password login
  const handleEmailLogin = async () => {
    try {
      error.value = null
      
      if (magicLink.value) {
        // Send magic link
        const { error: err } = await supabase.auth.signInWithOtp({
          email: email.value,
          options: {
            emailRedirectTo: `${window.location.origin}/confirm`,
          },
        })
        
        if (err) throw err
        
        alert('Check your email for the login link!')
      } else {
        // Regular email/password login
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        })
        
        if (err) throw err
        
        // Redirect to dashboard on success
        router.push('/dashboard')
      }
    } catch (err) {
      error.value = err.message
      alert(error.value)
    }
  }
  
  // Google login
  const handleGoogleLogin = async () => {
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/confirm`,
        },
      })
      
      if (err) throw err
    } catch (err) {
      error.value = err.message
      alert(error.value)
    }
  }
  
  // Microsoft login
  const handleMicrosoftLogin = async () => {
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/confirm`,
        },
      })
      
      if (err) throw err
    } catch (err) {
      error.value = err.message
      alert(error.value)
    }
  }
  </script>
  
  <style lang="scss" scoped>
  :root {
    // CSS Custom Properties (Variables)
    --color-primary: #3b82f6;
    --color-primary-dark: #2563eb;
    --color-border: #ddd;
    --color-text: #333;
    --color-background: #fff;
    --color-background-light: #f9fafb;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --border-radius: 4px;
    --spacing-small: 8px;
    --spacing-medium: 16px;
    --spacing-large: 24px;
  }
  
  // BEM with SCSS and CSS Variables
  .login {
    max-width: 400px;
    margin: 50px auto;
    padding: var(--spacing-large);
    border-radius: 8px;
    box-shadow: var(--shadow);
    background-color: var(--color-background);
    
    &__title {
      text-align: center;
      margin-bottom: var(--spacing-large);
      color: var(--color-text);
    }
    
    &__form {
      margin-bottom: var(--spacing-large);
    }
    
    &__form-group {
      margin-bottom: var(--spacing-medium);
    }
    
    &__label {
      display: block;
      margin-bottom: var(--spacing-small);
      font-weight: 500;
      color: var(--color-text);
    }
    
    &__input {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      
      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }
    
    &__form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--spacing-large);
    }
    
    &__button {
      padding: 10px 16px;
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s ease;
      
      &--primary {
        background-color: var(--color-primary);
        color: white;
        
        &:hover {
          background-color: var(--color-primary-dark);
        }
      }
      
      &--social {
        width: 100%;
        padding: 10px;
        background-color: var(--color-background-light);
        border: 1px solid var(--color-border);
        margin-bottom: 12px;
        
        &:hover {
          background-color: var(--color-border);
        }
      }
    }
    
    &__link {
      color: var(--color-primary);
      cursor: pointer;
      text-decoration: underline;
      
      &:hover {
        color: var(--color-primary-dark);
      }
    }
    
    &__divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: var(--spacing-large) 0;
      color: #6b7280;
      
      &::before,
      &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--color-border);
      }
      
      &::before {
        margin-right: 10px;
      }
      
      &::after {
        margin-left: 10px;
      }
    }
    
    &__social {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: var(--spacing-large);
    }
    
    &__signup {
      text-align: center;
      margin-top: var(--spacing-medium);
    }
  }
  
  // Media query example with CSS variables
  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: #1e293b;
      --color-background-light: #334155;
      --color-text: #f8fafc;
      --color-border: #475569;
      --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    .login {
      &__button--social {
        color: var(--color-text);
      }
    }
  }
  </style>