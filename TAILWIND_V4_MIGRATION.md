# Tailwind CSS v4 Migration

## Summary
Successfully migrated from Tailwind CSS CDN to locally installed Tailwind CSS v4 using the PostCSS approach.

## Changes Made

### 1. Package Installation
Installed the following packages:
- `tailwindcss@4.0.0` - Core Tailwind CSS v4
- `@tailwindcss/postcss@4.1.17` - PostCSS plugin for Tailwind v4
- `postcss@8.5.6` - PostCSS processor
- `autoprefixer@10.4.22` - Vendor prefix support

### 2. Configuration Files

#### `postcss.config.js` (NEW)
Created PostCSS configuration to process Tailwind CSS:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

#### `app.css` (NEW)
Created main stylesheet with Tailwind v4 imports and custom theme:
- Uses `@import "tailwindcss"` for v4
- Defines custom colors using `@theme` directive:
  - `asphalt`: #1a1a1a
  - `leather`: #5c4033
  - `rust`: #b7410e
  - `chrome`: #e5e7eb
  - `bike-orange`: #f97316
- Sets default font family to Inter
- Includes custom scrollbar utilities

### 3. File Updates

#### `index.html`
- Removed CDN script tag (`<script src="https://cdn.tailwindcss.com"></script>`)
- Removed inline Tailwind config (`<script>` with tailwind.config)
- Removed inline styles (moved to `app.css`)

#### `index.tsx`
- Added import for `app.css` at the top of the file

#### `vite.config.ts`
- No Vite plugin needed (PostCSS handles Tailwind processing automatically)

## Usage

### Development
```bash
npm run dev
```
Vite will automatically process CSS through PostCSS → Tailwind → Autoprefixer

### Production Build
```bash
npm run build
```
Creates optimized production bundle with purged unused CSS

## Custom Theme Usage

All custom colors are available as Tailwind utilities:
- `bg-asphalt`, `text-asphalt`
- `bg-leather`, `text-leather`
- `bg-rust`, `text-rust`
- `bg-chrome`, `text-chrome`
- `bg-bike-orange`, `text-bike-orange`

Example:
```jsx
<div className="bg-asphalt text-bike-orange">
  Costa Brava Bikers
</div>
```

## Notes

- Tailwind CSS v4 uses PostCSS instead of the Vite plugin for more stable builds
- The `@theme` directive is v4's new way to define custom design tokens
- All existing Tailwind classes work exactly the same
- Build output is optimized and tree-shaken automatically
