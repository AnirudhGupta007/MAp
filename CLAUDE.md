# GeoTimeline — AI-Powered Historical Map Explorer

## Project Overview
An interactive app that shows life events of historical figures on a Leaflet map.  
**Live**: https://geotimeline.vercel.app  
**Repo**: https://github.com/AnirudhGupta007/MAp

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Motion (framer-motion v12+) — `import { motion, AnimatePresence } from "motion/react"`
- Leaflet + React-Leaflet for maps
- Vercel monorepo deployment (api/ serverless functions + frontend)

## Architecture
```
src/components/LandingHero.tsx  — Landing page with search
src/components/MapView.tsx      — Leaflet map with markers
src/components/GlowMarker.tsx   — Custom map markers
src/components/SearchBar.tsx    — Search overlay on map view
src/components/EventPanel.tsx   — Event info card (positioned next to clicked marker)
src/components/Timeline.tsx     — Bottom timeline with play/pause
src/App.tsx                     — Main app with state management
src/index.css                   — Global styles and animations
api/search.js                   — Vercel serverless function (Gemini AI backend)
```

## MCP Tools — IMPORTANT: How to find and use them

Three MCP servers are configured in ~/.claude/settings.json. Their tools are DEFERRED — 
they won't appear in your tool list automatically. You MUST use ToolSearch to load them first.

### Step 1: Load the tools with ToolSearch

Run these EXACT ToolSearch calls to discover the tools:

- `ToolSearch query: "playwright"` — finds Playwright browser automation tools
- `ToolSearch query: "21st"` — finds 21st.dev Magic component generation tools  
- `ToolSearch query: "motion"` — finds Motion.dev animation documentation tools

If those return nothing, also try:
- `ToolSearch query: "browser"` — Playwright tools
- `ToolSearch query: "magic"` — 21st.dev tools
- `ToolSearch query: "animation"` or `ToolSearch query: "generate_motion"` — Motion tools

### Step 2: If MCP tools are NOT found

If ToolSearch returns no MCP tools, the servers may have failed to start. Tell the user:
"MCP servers didn't connect. Please restart Claude Code."

The 3 configured servers are:
1. **playwright**: `npx -y @playwright/mcp@latest`
2. **21st-dev**: `npx -y @21st-dev/magic@latest` (with API_KEY env var)
3. **motion**: `node /home/anirudh/motion-dev-mcp/dist/index.js`

### Step 3: How to use each MCP

**Playwright MCP** — Browser automation & screenshots
- Navigate to URLs, take screenshots, click elements, fill forms
- Use to screenshot the live site and localhost:5173 for verification
- Chromium browser is already installed

**21st.dev Magic MCP** — Generate modern UI components
- Generates production-quality React + Tailwind components
- Use for: search bars, cards, hero sections, buttons, badges, panels
- ALWAYS prefer 21st.dev generated components over hand-writing UI

**Motion.dev MCP** — Animation documentation & code generation
- `search_motion_docs` — search for animation patterns
- `get_component_api` — get props/API for motion components (use framework: "react")
- `generate_motion_component` — generate animated component code
- `get_examples_by_category` — get code examples by category
- Don't guess animation APIs — look them up through this MCP

## Design System
- **Theme**: Light aesthetic — warm whites, NOT dark theme
- **Fonts**: Plus Jakarta Sans (body) + Space Grotesk (display headings)
- **Colors**: Teal primary (#0d9488), Amber highlights (#d97706), Stone neutrals
- **Style**: Gen-Z modern (Linear, Vercel, Raycast, Arc browser vibes)
- **Effects**: Animated gradient backgrounds, floating orbs, glassmorphism panels
- **Interactions**: Hover lifts, press scales, spring animations on everything
- **Event card**: Must appear NEXT TO the clicked marker on the map, not in a corner

## Dev Commands
```bash
cd /home/anirudh/geotimeline
npm run dev              # Start dev server on localhost:5173
npx vercel --prod --yes  # Deploy to production
```

## Deploy Workflow
```bash
git add -A && git commit -m "description" && git push && npx vercel --prod --yes
```
