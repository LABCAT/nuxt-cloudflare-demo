# Nuxt Cloudflare Pages Demo

This project demonstrates server-side rendering (SSR) with Nuxt.js deployed on Cloudflare Pages. It includes both server-side and client-side rendered components to showcase the SSR capabilities.

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd nuxt-cloudflare-demo
```

2. Install dependencies:
```bash
pnpm install
```

## Project Structure

- `app.vue`: Main application component
- `components/`:
  - `ServerComponent.vue`: Server-side rendered component example
  - `ClientComponent.vue`: Client-side rendered component example
- `nuxt.config.ts`: Nuxt configuration with Cloudflare Pages preset
- `wrangler.toml`: Cloudflare Pages configuration

## Development

Run the development server:
```bash
pnpm dev
```

## Deployment

1. Install Wrangler (if not already installed):
```bash
pnpm add -D wrangler
```

2. Login to Cloudflare:
```bash
npx wrangler login
```

3. Build and deploy:
```bash
pnpm build
npx wrangler pages deploy dist/
```

## Configuration Files

### nuxt.config.ts
```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  nitro: {
    preset: 'cloudflare-pages'
  }
})
```

### wrangler.toml
```toml
name = "nuxt-cloudflare-demo"
compatibility_date = "2024-11-01"
pages_build_output_dir = "dist"
```

## Notes

- The project uses `cloudflare-pages` preset in Nitro for proper SSR functionality
- Client-side components should be wrapped with `<ClientOnly>` in templates
- The build process outputs to `dist/` directory which is then deployed to Cloudflare Pages