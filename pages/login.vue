<!-- pages/auth.vue -->
<template>
  <div class="auth">
    <div class="auth__card">
      <!-- Tabs with proper styling -->
      <div class="auth__tabs-wrapper">
        <div class="auth__tabs">
          <button 
            @click="activeTab = 'login'" 
            :class="['auth__tab', { 'auth__tab--active': activeTab === 'login' }]"
            :disabled="isLoading"
          >
            Sign In
          </button>
          <button 
            @click="activeTab = 'signup'" 
            :class="['auth__tab', { 'auth__tab--active': activeTab === 'signup' }]"
            :disabled="isLoading"
          >
            Sign Up
          </button>
        </div>
      </div>
      
      <div class="auth__content">
        <h1 class="auth__title">{{ activeTab === 'login' ? 'Welcome Back' : 'Create Account' }}</h1>
        <p class="auth__subtitle">
          {{ activeTab === 'login' ? 'Sign in to continue to your account' : 'Join us today to get started' }}
        </p>
        
        <!-- Magic Link Form with properly bordered input -->
        <form @submit.prevent="handleMagicLink" class="auth__form">
          <div class="auth__form-group">
            <label for="email" class="auth__label">Email</label>
            <div class="auth__input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="auth__input-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input 
                id="email"
                type="email" 
                v-model="email" 
                placeholder="your@email.com" 
                required
                class="auth__input"
                :disabled="isLoading"
              />
            </div>
          </div>
          
          <div class="auth__form-actions">
            <button type="submit" class="auth__button auth__button--primary" :disabled="isLoading">
              <span v-if="isLoadingMagicLink" class="auth__button-loading">
                <svg class="auth__spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle class="auth__spinner-path" cx="12" cy="12" r="10" fill="none" stroke-width="4" />
                </svg>
              </span>
              <span v-else>
                {{ activeTab === 'login' ? 'Send Login Link' : 'Send Signup Link' }}
              </span>
            </button>
          </div>
        </form>
        
        <div class="auth__divider">or continue with</div>
        
        <!-- Social Login/Signup Options -->
        <div class="auth__social">
          <button @click="handleGoogleAuth" class="auth__button auth__button--social auth__button--google" :disabled="isLoading">
            <span v-if="isLoadingGoogle" class="auth__button-loading">
              <svg class="auth__spinner auth__spinner--dark" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle class="auth__spinner-path" cx="12" cy="12" r="10" fill="none" stroke-width="4" />
              </svg>
            </span>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="auth__icon">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </template>
          </button>
          
          <button @click="handleMicrosoftAuth" class="auth__button auth__button--social auth__button--microsoft" :disabled="isLoading">
            <span v-if="isLoadingMicrosoft" class="auth__button-loading">
              <svg class="auth__spinner auth__spinner--dark" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle class="auth__spinner-path" cx="12" cy="12" r="10" fill="none" stroke-width="4" />
              </svg>
            </span>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 23 23" width="20" class="auth__icon">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                <path fill="#7fba00" d="M12 1h10v10H12z"/>
                <path fill="#ffb900" d="M12 12h10v10H12z"/>
              </svg>
              Continue with Microsoft
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSupabaseClient, useRouter } from '#imports'

// Form state
const email = ref('')
const activeTab = ref('login')
const error = ref(null)

// Loading states
const isLoadingMagicLink = ref(false)
const isLoadingGoogle = ref(false)
const isLoadingMicrosoft = ref(false)

// Computed property to check if any loading state is active
const isLoading = computed(() => {
  return isLoadingMagicLink.value || isLoadingGoogle.value || isLoadingMicrosoft.value
})

// Get Supabase client and router
const supabase = useSupabaseClient()
const router = useRouter()

// Handle magic link auth
const handleMagicLink = async () => {
  try {
    error.value = null
    isLoadingMagicLink.value = true
    
    if (activeTab.value === 'login') {
      // Send magic link login
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.value,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
        },
      })
      
      if (err) throw err
      
      alert('Check your email for the login link!')
    } else {
      // Magic link signup
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.value,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
        },
      })
      
      if (err) throw err
      
      alert('Check your email for confirmation link!')
    }
  } catch (err) {
    error.value = err.message
    alert(error.value)
  } finally {
    isLoadingMagicLink.value = false
  }
}

// Google auth
const handleGoogleAuth = async () => {
  try {
    isLoadingGoogle.value = true
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
    isLoadingGoogle.value = false
  }
  // Note: We don't set isLoadingGoogle to false here because we're being redirected
}

// Microsoft auth
const handleMicrosoftAuth = async () => {
  try {
    isLoadingMicrosoft.value = true
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/confirm`,
        scopes: 'openid profile email' // Make sure to include these scopes
      }
    })
    
    if (err) throw err
  } catch (err) {
    error.value = err.message
    alert(error.value)
    isLoadingMicrosoft.value = false
  }
  // Note: We don't set isLoadingMicrosoft to false here because we're being redirected
}
</script>

<style lang="scss">
// Base styles
body {
// Professional color palette
--color-primary: #3b82f6;
--color-primary-hover: #2563eb;
--color-background: #f5f7fa;
--color-card: #ffffff;
--color-input-bg: #ffffff;
--color-input-border: #cbd5e1;
--color-input-focus: #3b82f6;
--color-text: #1e293b;
--color-text-secondary: #64748b;
--color-tab-inactive: #94a3b8;
--color-tab-active-border: #3b82f6;
--color-tab-bg: #f8fafc;
--color-tab-active-bg: #ffffff;
--color-google: #ea4335;
--color-microsoft: #0078d4;
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--radius: 8px;

// Dark mode
@media (prefers-color-scheme: dark) {
    --color-primary: #60a5fa;
    --color-primary-hover: #3b82f6;
    --color-background: #0f172a;
    --color-card: #1e293b;
    --color-input-bg: #1e293b;
    --color-input-border: #334155;
    --color-text: #f1f5f9;
    --color-text-secondary: #cbd5e1;
    --color-tab-inactive: #94a3b8;
    --color-tab-bg: #0f172a;
    --color-tab-active-bg: #1e293b;
}
  background-color: var(--color-background);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-text);
}

// BEM-style classes
.auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: var(--color-background);
  
  &__card {
    width: 100%;
    max-width: 440px;
    background-color: var(--color-card);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }
  
  &__tabs-wrapper {
    background-color: var(--color-tab-bg);
    border-bottom: 1px solid var(--color-input-border);
    padding: 0 1rem;
  }
  
  &__tabs {
    display: flex;
  }
  
  &__tab {
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    font-weight: 600;
    color: var(--color-tab-inactive);
    cursor: pointer;
    position: relative;
    
    &--active {
      color: var(--color-primary);
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: var(--color-tab-active-border);
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
      }
    }
    
    &:hover:not(.auth__tab--active):not(:disabled) {
      color: var(--color-text);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &__content {
    padding: 2rem;
  }
  
  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-align: center;
    color: var(--color-text);
  }
  
  &__subtitle {
    color: var(--color-text-secondary);
    text-align: center;
    margin-bottom: 2rem;
  }
  
  &__form {
    margin-bottom: 2rem;
  }
  
  &__form-group {
    margin-bottom: 1.5rem;
  }
  
  &__label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }
  
  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 2px solid var(--color-input-border);
    border-radius: var(--radius);
    background-color: var(--color-input-bg);
    transition: all 0.2s;
    
    &:focus-within:not(:has(input:disabled)) {
      border-color: var(--color-input-focus);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }
  }
  
  &__input-icon {
    width: 20px;
    height: 20px;
    margin-left: 12px;
    color: var(--color-text-secondary);
  }
  
  &__input {
    width: 100%;
    padding: 12px;
    border: none;
    background: transparent;
    color: var(--color-text);
    font-size: 1rem;
    
    &:focus {
      outline: none;
    }
    
    &::placeholder {
      color: var(--color-tab-inactive);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &__form-actions {
    margin-top: 1.5rem;
  }
  
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.875rem 1.5rem;
    border-radius: var(--radius);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.15s ease;
    
    &--primary {
      background-color: var(--color-primary);
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background-color: var(--color-primary-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
    
    &--social {
      background-color: transparent;
      border: 2px solid var(--color-input-border);
      color: var(--color-text);
      margin-bottom: 0.75rem;
      gap: 0.75rem;
      
      &:hover:not(:disabled) {
        background-color: rgba(0, 0, 0, 0.03);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
    
    &--google {
      &:hover:not(:disabled) {
        border-color: var(--color-google);
      }
    }
    
    &--microsoft {
      margin-bottom: 0;
      
      &:hover:not(:disabled) {
        border-color: var(--color-microsoft);
      }
    }
  }
  
  &__button-loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__spinner {
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    
    &-path {
      stroke: currentColor;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
    
    &--dark {
      .auth__spinner-path {
        stroke: var(--color-text);
      }
    }
  }
  
  &__divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin: 1.5rem 0;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--color-input-border);
    }
    
    &::before {
      margin-right: 1rem;
    }
    
    &::after {
      margin-left: 1rem;
    }
  }
  
  &__social {
    display: flex;
    flex-direction: column;
  }
}

// Spinner animations
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .auth {
    padding: 1rem;
    
    &__content {
      padding: 1.5rem;
    }
  }
}
</style>