# ✅ Setup Checklist

Use this checklist to ensure your TrustGraph installation is complete.

## Prerequisites

- [ ] Node.js 20+ installed
- [ ] npm or yarn installed
- [ ] Git installed (optional)
- [ ] Supabase account created

## Database Setup

### Supabase Project
- [ ] Created new Supabase project
- [ ] Saved database password securely
- [ ] Copied connection string from Settings → Database
- [ ] Verified connection string format: `postgresql://postgres...`

### Local Configuration
- [ ] Ran `npm install` successfully
- [ ] Copied `.env.example` to `.env`
- [ ] Added `DATABASE_URL` to `.env`
- [ ] Verified no syntax errors in `.env`

### Schema Migration
- [ ] Ran `npm run db:push` successfully
- [ ] Verified tables created in Supabase Table Editor
- [ ] Confirmed all 9 tables exist:
  - [ ] users
  - [ ] tokens
  - [ ] wallets
  - [ ] trust_scores
  - [ ] risk_flags
  - [ ] alerts
  - [ ] graph_nodes
  - [ ] graph_edges
  - [ ] favorites

### Data Seeding
- [ ] Ran `npm run db:seed` successfully
- [ ] Verified data in Supabase Table Editor:
  - [ ] 9 wallets inserted
  - [ ] 10 tokens inserted
  - [ ] 10 trust scores inserted
  - [ ] 14 risk flags inserted
  - [ ] 12 graph nodes inserted
  - [ ] 13 graph edges inserted
  - [ ] 5 alerts inserted

## Application Testing

### Development Server
- [ ] Ran `npm run dev` successfully
- [ ] Server started on port 5173
- [ ] No console errors in terminal
- [ ] Opened http://localhost:5173 in browser

### Landing Page
- [ ] Landing page loads without errors
- [ ] Token leaderboard displays 10 tokens
- [ ] Trust scores show colored circles
- [ ] Tier badges display (SAFE, MODERATE, RISKY, DANGER)
- [ ] Market cap, holders, 24h change display correctly
- [ ] Search bar is functional
- [ ] Filter buttons work (SAFE, MODERATE, RISKY, DANGER)
- [ ] Sort buttons work (Trust Score, Market Cap, Holders, 24h Change)

### Token Detail Page
- [ ] Clicking a token navigates to detail page
- [ ] Token information displays correctly
- [ ] Trust score gauge renders
- [ ] Risk breakdown chart shows
- [ ] Risk flags list displays
- [ ] Deployer wallet info shows
- [ ] Top holders list displays

### Other Pages
- [ ] `/scan` page loads
- [ ] `/compare` page loads
- [ ] `/graph` page loads
- [ ] `/wallet/:address` page loads
- [ ] Navigation menu works

### AI Features (Optional)
- [ ] "Deep" analysis button appears
- [ ] Clicking "Deep" triggers loading state
- [ ] AI explanation displays (if Cerebras API configured)

## Optional Integrations

### Cerebras AI (Optional)
- [ ] Created Cerebras account
- [ ] Generated API key
- [ ] Added `CEREBRAS_API_KEY` to `.env`
- [ ] Tested deep analysis feature
- [ ] AI explanations generate successfully

### Moralis Blockchain Data (Optional)
- [ ] Created Moralis account
- [ ] Generated API key
- [ ] Added `MORALIS_API_KEY` to `.env`
- [ ] Tested live blockchain data fetching

### Kimi OAuth (Optional)
- [ ] Configured Kimi OAuth credentials
- [ ] Added auth URLs to `.env`
- [ ] Tested login flow
- [ ] User sessions work correctly

## Production Readiness

### Code Quality
- [ ] Ran `npm run check` (TypeScript)
- [ ] Ran `npm run lint` (ESLint)
- [ ] Fixed all errors and warnings
- [ ] Ran `npm run format` (Prettier)

### Build Testing
- [ ] Ran `npm run build` successfully
- [ ] No build errors
- [ ] Ran `npm start` to test production build
- [ ] Production build works correctly

### Environment Variables
- [ ] All required env vars set
- [ ] No sensitive data in git
- [ ] `.env` added to `.gitignore`
- [ ] Created `.env.production` for deployment

### Database
- [ ] Connection pooling enabled (Supabase Pooler)
- [ ] SSL mode configured
- [ ] Indexes verified in Supabase
- [ ] Backup strategy confirmed

## Deployment (Optional)

### Hosting Platform
- [ ] Chose hosting platform (Vercel/Railway/Render)
- [ ] Created new project
- [ ] Connected git repository
- [ ] Configured build settings

### Environment Variables (Production)
- [ ] Added `DATABASE_URL` to hosting platform
- [ ] Added `APP_ID` and `APP_SECRET`
- [ ] Added optional API keys (Cerebras, Moralis)
- [ ] Verified all env vars set correctly

### Domain & SSL
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] HTTPS working correctly

### Testing Production
- [ ] Deployed successfully
- [ ] Production URL accessible
- [ ] Database connection works
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Performance acceptable

## Documentation Review

- [ ] Read `README.md`
- [ ] Read `QUICKSTART.md`
- [ ] Read `SUPABASE_SETUP.md`
- [ ] Read `DATABASE_SCHEMA.md`
- [ ] Reviewed `MIGRATION_SUMMARY.md`

## Troubleshooting

If you encounter issues, check:

### Database Connection Errors
- [ ] DATABASE_URL format is correct
- [ ] Password doesn't contain special characters needing escaping
- [ ] Using connection pooling URL (port 6543)
- [ ] Supabase project is active (not paused)

### Migration Errors
- [ ] Dropped all tables and re-ran `db:push`
- [ ] Checked for enum type conflicts
- [ ] Verified Drizzle version compatibility

### Seed Script Errors
- [ ] Schema was pushed successfully first
- [ ] All tables exist before seeding
- [ ] No duplicate key violations
- [ ] Connection string is correct

### Application Errors
- [ ] Ran `npm install` after pulling changes
- [ ] Cleared browser cache
- [ ] Checked browser console for errors
- [ ] Verified API routes are accessible

### Build Errors
- [ ] All dependencies installed
- [ ] TypeScript errors resolved
- [ ] Import paths are correct
- [ ] Environment variables set

## Success Criteria

Your setup is complete when:

✅ All tables created in Supabase
✅ Demo data seeded successfully
✅ Development server runs without errors
✅ Landing page displays token leaderboard
✅ Token detail pages work
✅ Search and filters functional
✅ No console errors in browser
✅ Build completes successfully

## Next Steps

After completing this checklist:

1. **Customize**: Modify branding, colors, content
2. **Integrate APIs**: Add Cerebras and Moralis keys
3. **Add Features**: Implement additional functionality
4. **Deploy**: Push to production hosting
5. **Monitor**: Set up error tracking and analytics

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev

## Feedback

Found an issue or have suggestions?
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Congratulations!** 🎉 Your TrustGraph installation is complete!
