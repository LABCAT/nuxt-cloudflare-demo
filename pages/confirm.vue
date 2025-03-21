<!-- pages/confirm.vue -->
<template>
  <div class="confirm">
    <div v-if="loading" class="confirm__loading">
      <p>Confirming your authentication...</p>
      <div class="confirm__spinner"></div>
    </div>
   
    <div v-else-if="error" class="confirm__error">
      <h1>Authentication Error</h1>
      <p>{{ error }}</p>
      <a href="/auth" class="confirm__button">Return to Login</a>
    </div>
   
    <div v-else class="confirm__success">
      <h1>Authentication Successful!</h1>
      <p>You will be redirected to your dashboard in a moment.</p>
      <a href="/dashboard" class="confirm__button">Go to Dashboard</a>
    </div>
  </div>
</template>

<script setup>
import { useSupabaseUser, useRouter, useRoute } from '#imports'

const loading = ref(true)
const error = ref(null)
const router = useRouter()
const route = useRoute()
const user = useSupabaseUser()

onMounted(async () => {
  try {
    // Check for error parameters in URL
    if (route.query.error) {
      const errorCode = route.query.error_code || ''
      const errorDesc = route.query.error_description || 'Unknown error'
      throw new Error(`${errorDesc} (${errorCode})`)
    }
    
    // Wait a moment to ensure auth state is updated
    setTimeout(() => {
      if (user.value) {
        loading.value = false
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        throw new Error('Authentication failed or was cancelled')
      }
    }, 1500)
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
})
</script>

<style lang="scss">
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-border: #ddd;
  --color-text: #333;
  --color-background: #fff;
  --color-error: #dc2626;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --border-radius: 4px;
  --spacing-medium: 16px;
  --spacing-large: 24px;
}

.confirm {
  max-width: 500px;
  margin: 100px auto;
  padding: var(--spacing-large);
  text-align: center;
  border-radius: 8px;
  box-shadow: var(--shadow);
  background-color: var(--color-background);
 
  h1 {
    margin-bottom: var(--spacing-medium);
  }
 
  p {
    margin-bottom: var(--spacing-large);
  }
 
  &__loading, &__success, &__error {
    padding: var(--spacing-medium);
  }
 
  &__error {
    h1 {
      color: var(--color-error);
    }
  }
 
  &__button {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--color-primary);
    color: white;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s ease;
   
    &:hover {
      background-color: var(--color-primary-dark);
    }
  }
  
  &__spinner {
    margin: 20px auto;
    width: 40px;
    height: 40px;
    border: 4px solid rgba(59, 130, 246, 0.2);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spinner 1s linear infinite;
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1e293b;
    --color-text: #f8fafc;
    --color-border: #475569;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
 
  .confirm {
    color: var(--color-text);
  }
}
</style>