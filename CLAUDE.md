# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Dev server**: `npm run dev` - Start Vite development server
- **Build**: `npm run build` - TypeScript build and Vite production build
- **Lint**: `npm run lint` - Run ESLint
- **Preview**: `npm run preview` - Preview production build

## Architecture Overview

**Holy Echoes** is a React + TypeScript prayer book application built with Vite and Capacitor for cross-platform deployment (web, iOS, Android).

### Core Technologies
- **Frontend**: React 19 with TypeScript, Vite, React Router v7
- **UI**: shadcn/ui components, Radix UI primitives, Tailwind CSS v4, styled-components
- **Database**: InstantDB (real-time database) with structured schema
- **Mobile**: Capacitor for iOS/Android builds
- **Build**: Vite with path aliases (`@/` → `./src/`)

### Database Schema (InstantDB)
The app uses InstantDB with a structured schema defined in `src/database/index.tsx`:

**Core Entities:**
- `prayers` - Prayer documents with name, order, published status
- `prayerBlocks` - Individual content blocks within prayers (text, images, references)
- `blockTypes` - Predefined block types (Body, Title, Quote, Litany, etc.)
- `litanyBlocks` - Call-and-response prayer blocks
- `categories` - Prayer categorization
- `admin` - Admin user management
- `$files` - File storage for images

**Key Relationships:**
- Prayers → many-to-many with Categories
- Prayers → one-to-many with PrayerBlocks
- PrayerBlocks → one-to-many with BlockTypes and Files
- PrayerBlocks → one-to-many with LitanyBlocks

### Application Structure

**Routing** (`src/layout/App/router.tsx`):
- `/home` - Public prayer browsing
- `/prayer/:prayerId` - Individual prayer view
- `/admin/*` - Admin interface for prayer management
- `/admin/config` - Configuration page

**Key Components:**
- `src/layout/` - Layout components (Header, PrayerControls, etc.)
- `src/components/` - Reusable UI components and form inputs
- `src/components/ui/` - shadcn/ui components
- `src/pages/` - Route pages (Home, Prayer, Admin, Login)
- `src/hooks/` - Custom React hooks for data management

**Mobile Build:**
- `capacitor.config.ts` - Capacitor configuration
- `android/` and `ios/` - Native platform builds
- Built web assets go to `dist/` directory

### Environment Setup
- Requires `VITE_INSTANT_APP_ID` environment variable for InstantDB connection
- TypeScript with strict configuration and path aliases
- ESLint with React hooks and TypeScript support