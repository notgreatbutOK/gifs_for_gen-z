# GIFsForGenZ 🔥

> A fast, aesthetic Gen Z GIF website powered by GIPHY API.

## Features
- 🏠 **Homepage** — Hero search, trending GIFs, category chips
- 🔍 **Search Page** — Dynamic search with load more pagination
- 🗂️ **Category Page** — 8 curated categories (Relatable, Sigma, Cringe, Gaming…)
- 🖼️ **GIF Detail** — Large view, copy link, download, WhatsApp share

## Tech Stack
- Plain HTML, CSS, JavaScript (no frameworks)
- GIPHY Public API
- Glassmorphism dark UI with Syne + Space Mono fonts
- Mobile-first responsive design

## Deploy on Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
cd gifsforgenz
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repo
4. Framework Preset: **Other**
5. Output Directory: `.` (root)
6. Deploy!

## File Structure
```
gifsforgenz/
├── index.html        # Homepage
├── search.html       # Search results
├── category.html     # Category browser
├── gif.html          # GIF detail view
├── vercel.json       # Vercel config
├── css/
│   └── styles.css    # All styles
├── js/
│   ├── api.js        # GIPHY API module
│   ├── main.js       # Shared utilities + homepage
│   ├── search.js     # Search page logic
│   ├── category.js   # Category page logic
│   └── gif.js        # GIF detail page logic
└── assets/
    └── favicon.svg   # Site favicon
```

## API Key
The project uses GIPHY's public beta API key. For production use, get a free key at [developers.giphy.com](https://developers.giphy.com).
Replace `API_KEY` in `js/api.js`.
