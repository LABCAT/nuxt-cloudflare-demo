<!-- pages/dashboard.vue -->
<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h1 class="dashboard__title">My Dashboard</h1>
      <div class="dashboard__user">
        <span v-if="user" class="dashboard__email">{{ user.email }}</span>
        <button @click="handleSignOut" class="dashboard__button dashboard__button--signout">
          Sign Out
        </button>
      </div>
    </header>
    
    <div class="dashboard__content">
      <aside class="dashboard__sidebar">
        <nav class="dashboard__nav">
          <ul class="dashboard__menu">
            <li class="dashboard__menu-item dashboard__menu-item--active">
              <a href="#" class="dashboard__menu-link">Overview</a>
            </li>
            <li class="dashboard__menu-item">
              <a href="#" class="dashboard__menu-link">Profile</a>
            </li>
            <li class="dashboard__menu-item">
              <a href="#" class="dashboard__menu-link">Settings</a>
            </li>
            <li class="dashboard__menu-item">
              <a href="#" class="dashboard__menu-link">Help</a>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main class="dashboard__main">
        <div class="dashboard__welcome">
          <h2>Welcome to your dashboard!</h2>
          <p>This is a protected area that only authenticated users can access.</p>
        </div>
        
        <!-- Server-side rendered component -->
        <div class="dashboard__card">
          <h3 class="dashboard__card-title">Server Component</h3>
          <div class="dashboard__card-content">
            <ServerComponent v-if="isComponentsLoaded" />
            <p v-else>Loading server component...</p>
          </div>
        </div>
        
        <!-- Client-side rendered component -->
        <ClientOnly>
          <div class="dashboard__card">
            <h3 class="dashboard__card-title">Client Component</h3>
            <div class="dashboard__card-content">
              <ClientComponent />
            </div>
          </div>
        </ClientOnly>
        
        <!-- Web Component Example -->
        <div class="dashboard__card">
          <h3 class="dashboard__card-title">Web Component Example</h3>
          <div class="dashboard__card-content">
            <p class="dashboard__web-component-info">
              Web Components are custom, reusable HTML elements created using standard web platform APIs. 
              They work across modern browsers and can be used with any JavaScript library or framework.
            </p>
            <div class="dashboard__web-component-demo">
              <my-component message="Hello from My Web Component!"></my-component>
            </div>
          </div>
        </div>
        
        <div class="dashboard__grid">
          <div class="dashboard__card">
            <h3 class="dashboard__card-title">Your Profile</h3>
            <div class="dashboard__card-content">
              <p><strong>Email:</strong> {{ user?.email }}</p>
              <p><strong>User ID:</strong> {{ user?.id }}</p>
              <p v-if="user?.user_metadata?.name"><strong>Name:</strong> {{ user.user_metadata.name }}</p>
            </div>
          </div>
          
          <div class="dashboard__card">
            <h3 class="dashboard__card-title">Account Status</h3>
            <div class="dashboard__card-content">
              <p class="dashboard__status dashboard__status--active">Active</p>
              <p>You're currently on the Free plan</p>
              <button class="dashboard__button dashboard__button--upgrade">Upgrade to Pro</button>
            </div>
          </div>
          
          <div class="dashboard__card">
            <h3 class="dashboard__card-title">Recent Activity</h3>
            <div class="dashboard__card-content">
              <p>No recent activity to display</p>
            </div>
          </div>
          
          <div class="dashboard__card">
            <h3 class="dashboard__card-title">Quick Actions</h3>
            <div class="dashboard__card-content dashboard__actions">
              <button class="dashboard__action-button">Edit Profile</button>
              <button class="dashboard__action-button">View Settings</button>
              <button class="dashboard__action-button">Get Support</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useSupabaseClient, useSupabaseUser, navigateTo } from '#imports'

// User state
const user = ref(null)
const isComponentsLoaded = ref(false)

// Get Supabase client from Nuxt module
const supabase = useSupabaseClient()
const supabaseUser = useSupabaseUser()

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
  // Set user from composable
  user.value = supabaseUser.value
  
  // Set up listener for auth state changes
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
  
  // Simulate components loading
  setTimeout(() => {
    isComponentsLoaded.value = true
  }, 500)
  
  // Define and register a basic Web Component
  if (typeof window !== 'undefined' && !customElements.get('my-component')) {
    class MyComponent extends HTMLElement {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' })
      }
      
      connectedCallback() {
        const message = this.getAttribute('message') || 'Hello World'
        
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              padding: 16px;
              background-color: #f0f9ff;
              border-radius: 8px;
              margin: 10px 0;
              border-left: 4px solid #3b82f6;
            }
            .message {
              font-weight: 500;
              color: #1e40af;
              margin: 0;
            }
            .info {
              margin-top: 8px;
              font-size: 0.9em;
              color: #334155;
            }
            button {
              margin-top: 8px;
              padding: 6px 12px;
              background-color: #3b82f6;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background-color: #2563eb;
            }
          </style>
          <div>
            <p class="message">${message}</p>
            <p class="info">This component is encapsulated using Shadow DOM</p>
            <button id="counter-btn">Clicked 0 times</button>
          </div>
        `
        
        // Add event listener to the button
        let count = 0
        const button = this.shadowRoot.getElementById('counter-btn')
        button.addEventListener('click', () => {
          count++
          button.textContent = `Clicked ${count} times`
        })
      }
    }
    
    // Register the web component
    customElements.define('my-component', MyComponent)
  }
})
</script>

<style lang="scss">
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-success: #10b981;
  --color-border: #e5e7eb;
  --color-text: #333;
  --color-text-light: #6b7280;
  --color-background: #fff;
  --color-background-light: #f9fafb;
  --color-sidebar: #f9fafb;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.1);
  --border-radius: 4px;
  --spacing-small: 8px;
  --spacing-medium: 16px;
  --spacing-large: 24px;
}

.dashboard {
  min-height: 100vh;
  background-color: var(--color-background-light);
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-medium) var(--spacing-large);
    background-color: var(--color-background);
    box-shadow: var(--shadow);
  }
  
  &__title {
    font-size: 1.5rem;
    margin: 0;
  }
  
  &__user {
    display: flex;
    align-items: center;
    gap: var(--spacing-medium);
  }
  
  &__email {
    color: var(--color-text-light);
  }
  
  &__button {
    padding: var(--spacing-small) var(--spacing-medium);
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &--signout {
      background-color: var(--color-background-light);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      
      &:hover {
        background-color: var(--color-border);
      }
    }
    
    &--upgrade {
      background-color: var(--color-primary);
      color: white;
      border: none;
      
      &:hover {
        background-color: var(--color-primary-dark);
      }
    }
  }
  
  &__content {
    display: flex;
    min-height: calc(100vh - 64px);
  }
  
  &__sidebar {
    width: 240px;
    background-color: var(--color-sidebar);
    padding: var(--spacing-large) 0;
    border-right: 1px solid var(--color-border);
  }
  
  &__menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  &__menu-item {
    margin-bottom: 2px;
    
    &--active {
      .dashboard__menu-link {
        background-color: rgba(59, 130, 246, 0.1);
        color: var(--color-primary);
        border-left: 3px solid var(--color-primary);
      }
    }
  }
  
  &__menu-link {
    display: block;
    padding: 10px var(--spacing-large);
    color: var(--color-text);
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(59, 130, 246, 0.05);
    }
  }
  
  &__main {
    flex: 1;
    padding: var(--spacing-large);
  }
  
  &__welcome {
    margin-bottom: var(--spacing-large);
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-large);
  }
  
  &__card {
    background-color: var(--color-background);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    margin-bottom: var(--spacing-large);
  }
  
  &__card-title {
    padding: var(--spacing-medium);
    margin: 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 1.125rem;
  }
  
  &__card-content {
    padding: var(--spacing-medium);
  }
  
  &__status {
    font-weight: 500;
    
    &--active {
      color: var(--color-success);
    }
  }
  
  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-small);
  }
  
  &__action-button {
    padding: var(--spacing-small);
    background-color: var(--color-background-light);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    cursor: pointer;
    
    &:hover {
      background-color: var(--color-border);
    }
  }
  
  &__web-component-info {
    margin-bottom: var(--spacing-medium);
    line-height: 1.5;
  }
  
  &__web-component-demo {
    margin-top: var(--spacing-medium);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1e293b;
    --color-background-light: #334155;
    --color-sidebar: #1e293b;
    --color-text: #f8fafc;
    --color-text-light: #cbd5e1;
    --color-border: #475569;
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .dashboard {
    &__menu-item {
      &--active {
        .dashboard__menu-link {
          background-color: rgba(59, 130, 246, 0.2);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .dashboard {
    &__content {
      flex-direction: column;
    }
    
    &__sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--color-border);
      padding: var(--spacing-medium) 0;
    }
    
    &__menu {
      display: flex;
      overflow-x: auto;
      padding: 0 var(--spacing-medium);
    }
    
    &__menu-item {
      margin-bottom: 0;
      margin-right: var(--spacing-small);
    }
    
    &__menu-link {
      border-left: none;
      border-bottom: 3px solid transparent;
      padding: var(--spacing-small) var(--spacing-medium);
    }
    
    &__menu-item--active .dashboard__menu-link {
      border-left: none;
      border-bottom: 3px solid var(--color-primary);
    }
    
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>