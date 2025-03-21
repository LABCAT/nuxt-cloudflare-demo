<!-- pages/signup.vue -->
<template>
    <div class="signup">
      <h1 class="signup__title">Create an Account</h1>
      
      <!-- Email/Password Signup Form -->
      <form @submit.prevent="handleSignup" class="signup__form">
        <div class="signup__form-group">
          <label for="email" class="signup__label">Email</label>
          <input 
            id="email"
            type="email" 
            v-model="email" 
            placeholder="your@email.com" 
            required
            class="signup__input"
          />
        </div>
        
        <div class="signup__form-group">
          <label for="password" class="signup__label">Password</label>
          <input 
            id="password"
            type="password" 
            v-model="password" 
            placeholder="Password" 
            required
            minlength="8"
            class="signup__input"
          />
          <small class="signup__hint">Password must be at least 8 characters long</small>
        </div>
        
        <div class="signup__form-group">
          <label for="confirmPassword" class="signup__label">Confirm Password</label>
          <input 
            id="confirmPassword"
            type="password" 
            v-model="confirmPassword" 
            placeholder="Confirm Password" 
            required
            class="signup__input"
          />
          <small v-if="passwordsMismatch" class="signup__error">
            Passwords do not match
          </small>
        </div>
        
        <div class="signup__form-actions">
          <button type="submit" class="signup__button signup__button--primary">
            Create Account
          </button>
        </div>
      </form>
      
      <div class="signup__divider">or sign up with</div>
      
      <!-- Social Signup Options -->
      <div class="signup__social">
        <button @click="handleGoogleSignup" class="signup__button signup__button--social">
          Google
        </button>
        
        <button @click="handleMicrosoftSignup" class="signup__button signup__button--social">
          Microsoft
        </button>
      </div>
      
      <div class="signup__login">
        <p>Already have an account? <a href="/login" class="signup__link">Sign In</a></p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useSupabaseClient, useRouter } from '#imports'
  
  // Form state
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const error = ref(null)
  
  // Get Supabase client and router
  const supabase = useSupabaseClient()
  const router = useRouter()
  
  // Computed property to check if passwords match
  const passwordsMismatch = computed(() => {
    return confirmPassword.value !== '' && password.value !== confirmPassword.value
  })
  
  // Email/password signup
  const handleSignup = async () => {
    try {
      error.value = null
      
      // Check if passwords match
      if (password.value !== confirmPassword.value) {
        throw new Error('Passwords do not match')
      }
      
      // Register with email and password
      const { error: err } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
        },
      })
      
      if (err) throw err
      
      alert('Check your email for confirmation link!')
    } catch (err) {
      error.value = err.message
      alert(error.value)
    }
  }
  
  // Google signup
  const handleGoogleSignup = async () => {
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
  
  // Microsoft signup
  const handleMicrosoftSignup = async () => {
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
    --color-error: #dc2626;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --border-radius: 4px;
    --spacing-small: 8px;
    --spacing-medium: 16px;
    --spacing-large: 24px;
  }
  
  // BEM with SCSS and CSS Variables
  .signup {
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
    
    &__hint {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 4px;
    }
    
    &__error {
      display: block;
      font-size: 0.875rem;
      color: var(--color-error);
      margin-top: 4px;
    }
    
    &__form-actions {
      display: flex;
      justify-content: center;
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
        width: 100%;
        
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
    
    &__login {
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
    
    .signup {
      &__button--social {
        color: var(--color-text);
      }
    }
  }
  </style>