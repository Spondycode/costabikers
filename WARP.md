# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Costa Brava Bikers is a motorcycle club management web app generated from Google AI Studio. It's a React + TypeScript + Vite SPA that uses the Gemini API for AI-powered features (route briefings and chat assistance).

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
Before running the app, you must set the Gemini API key:
1. Create `.env.local` in the project root
2. Add: `GEMINI_API_KEY=your_key_here`
3. The Vite config exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

**Note:** The app will fail to generate AI features without a valid API key, but the UI will still render with fallback messages.

## Architecture

### State Management
- **No external state library** - Uses React's `useState` for all state management
- State is initialized from `localStorage` via the `storage` service at app mount
- All state updates are persisted immediately to `localStorage` using the storage service
- State flows down from `App.tsx` to child components via props
- Child components call parent callbacks to update state (e.g., `onUpdateTrip`, `onUpdateMember`, `onUpdatePolls`)

### Data Flow Pattern
```
App.tsx (root state holder)
  ├─ useState hooks initialized from storage.getX()
  ├─ Pass data + callbacks to components
  └─ Components call callbacks → App updates state → storage.saveX()
```

### Key Files
- **App.tsx**: Root component holding all state (members, trips, polls, user), tab navigation, and data flow orchestration
- **types.ts**: Core TypeScript interfaces (Member, Trip, Comment, Poll, PollOption, TabView)
- **constants.ts**: Mock/seed data (MEMBERS, MOCK_TRIPS, INITIAL_POLLS) used on first load
- **services/storage.ts**: localStorage abstraction layer - all reads/writes go through this
- **services/geminiService.ts**: Gemini API integration for route analysis and chat AI replies

### Component Structure
All components are in `components/`:
- **Login.tsx**: Simple password-based login (no real auth)
- **Home.tsx**: Dashboard with quick stats and upcoming trip preview
- **NextTrip.tsx**: Displays upcoming trip, participant management, AI briefing, live chat with @AI mentions
- **PastTrips.tsx**: Archive of completed trips with galleries and external links (Relive, Calimoto, etc.)
- **Members.tsx**: Member directory with profile view/edit
- **Polls.tsx**: Voting system for next destinations

### Styling
- **Tailwind CSS** (via inline classes) - No separate CSS files
- Dark theme with custom color: `bike-orange` (#ff6600 range)
- Mobile-first responsive design with bottom navigation
- Uses Lucide React for icons

### AI Features
- **Route AI Briefing**: Auto-generated when a trip is viewed (geminiService.getRouteAIAnalysis)
- **Chat AI**: Triggered when a comment contains `@ai` (geminiService.getChatAssistantReply)
- Both use `gemini-2.5-flash` model

## Development Patterns

### Adding a New Feature
1. Update `types.ts` if new data structures are needed
2. Modify the storage service if persistence is required
3. Update `App.tsx` to manage the new state
4. Create or modify components with prop-based data flow
5. All updates must call parent callbacks to persist changes

### Working with localStorage
- Never directly access `localStorage` in components
- Always use the `storage` service methods
- Storage keys are prefixed with `cbb_` (Costa Brava Bikers)
- On first load, if storage is empty, mock data from `constants.ts` is used

### Gemini API Integration
- API key is injected at build time via Vite's `define` config
- Environment variable: `GEMINI_API_KEY` in `.env.local`
- Error handling returns fallback messages (e.g., "Ride details unavailable...")
- All AI calls are async and include loading states in the UI

## Project Origin
Generated via Google AI Studio: https://ai.studio/apps/drive/1pSeSqgrG8B92KgP1VKkNsf7b1Af90j8y

## Code Conventions
- Use functional components with hooks
- TypeScript strict mode is enabled
- Props are explicitly typed with interfaces
- Event handlers are named `handleX` (e.g., `handleSendMessage`)
- State setters follow React conventions (`setX`)
- Comments explain "why" not "what"
