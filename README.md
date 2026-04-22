# React + TypeScript + Vite + Supabase

This is **TrustGraph** - an AI-powered behavioral reputation engine for meme tokens on BNB Chain, built for the Four.meme AI Sprint 2026.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup Supabase database
# 1. Create project at supabase.com
# 2. Copy connection string to .env
# 3. Run migrations and seed data
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

See **[QUICKSTART.md](QUICKSTART.md)** for detailed 5-minute setup guide.

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete database setup guide
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - MySQL → PostgreSQL migration details

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Hono + tRPC
- **Database**: Supabase PostgreSQL + Drizzle ORM
- **AI**: Cerebras Cloud SDK (Qwen 3 235B)
- **Blockchain**: Moralis API (BNB Chain)
- **UI**: 50+ shadcn/ui components

## 🎯 Features

- **AI Trust Scoring**: 6-dimensional risk analysis powered by Cerebras
- **Real-time Indexing**: Monitor Four.meme token launches
- **Wallet Graph**: Visualize deployer relationships and scam networks
- **Risk Detection**: Honeypots, rug pulls, concentrated holdings
- **Deep Analysis**: Plain-English AI explanations of risk factors

## 📦 Database Schema

- `tokens` - Token information and metadata
- `wallets` - Developer reputation and history
- `trust_scores` - AI-powered trust ratings
- `risk_flags` - Specific risk indicators
- `graph_nodes` & `graph_edges` - Wallet relationship network
- `alerts` - Real-time notifications

## 🛠️ Development

```bash
# Development
npm run dev

# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format

# Database commands
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to Supabase
npm run db:seed      # Seed demo data

# Production build
npm run build
npm start
```

## 🌐 Environment Variables

```env
# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:pass@project.supabase.co:6543/postgres

# Optional: AI & Blockchain APIs
CEREBRAS_API_KEY=your_key
MORALIS_API_KEY=your_key
```

## 📊 Demo Data

The seed script includes:
- 10 tokens (mix of safe and scam)
- 9 wallets (verified devs and scammers)
- 10 trust scores with AI explanations
- 14 risk flags
- Graph relationship data

## 🚢 Deployment

Works with any Node.js hosting:
- Vercel
- Railway
- Render
- Fly.io

Supabase handles the database automatically.

## 📝 Original Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
