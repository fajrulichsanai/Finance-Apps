# Finance App - Next.js PWA

A modern, beautiful finance tracking application built with Next.js 15, featuring Progressive Web App (PWA) capabilities, dark mode support, and interactive charts.

## Features

✨ **Beautiful UI/UX** - Sleek mobile-first design with smooth animations
📱 **PWA Ready** - Install as a native app on any device
🌙 **Dark Mode** - Full dark mode support
📊 **Interactive Charts** - Beautiful data visualizations with Recharts
⚡ **Next.js 15** - Built with the latest Next.js App Router
🎨 **TailwindCSS** - Modern utility-first styling

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS 4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **PWA:** next-pwa
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm run start
```

The PWA service worker will be automatically generated during the build process.

## PWA Features

- 📲 **Installable** - Add to home screen on mobile and desktop
- 🔄 **Offline Support** - Works without internet connection
- ⚡ **Fast Loading** - Cached assets for instant loading
- 🔔 **Push Notifications** - Ready for push notifications (implementation required)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with PWA metadata
│   ├── page.tsx            # Home page (main app)
│   └── globals.css         # Global styles
├── lib/
│   └── utils.ts            # Utility functions
├── public/
│   ├── manifest.json       # PWA manifest
│   └── icons/              # App icons (add your icons here)
├── next.config.mjs         # Next.js configuration with PWA
├── tailwind.config.ts      # TailwindCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Adding PWA Icons

To complete the PWA setup, add the following icon files to the `public/` directory:

- `icon-192x192.png` - 192x192px app icon
- `icon-512x512.png` - 512x512px app icon
- `favicon.ico` - Browser favicon

You can generate these icons from a single source image using tools like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Customization

### Changing App Colors

Edit the theme colors in:
- `tailwind.config.ts` - TailwindCSS theme
- `app/globals.css` - CSS custom properties
- `public/manifest.json` - PWA theme color

### Modifying App Name

Update the app name in:
- `app/layout.tsx` - Page metadata
- `public/manifest.json` - PWA manifest
- `package.json` - Package name

## Environment Variables

Create a `.env.local` file for environment variables if needed:

```env
# Add your environment variables here
# NEXT_PUBLIC_API_URL=https://api.example.com
```

## License

MIT

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms

This app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean
- AWS Amplify

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
