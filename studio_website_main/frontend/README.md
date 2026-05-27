# AuraLens Photography — Next.js + TypeScript

A pixel-perfect conversion of the AuraLens photography landing page, rebuilt with:

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **CSS Modules** (scoped per component)
- **Google Fonts** via CSS `@import`

---

## Project Structure

```
frontend/
└── studio_website_main/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx       ← Root layout + metadata
    │   │   └── page.tsx         ← Home page
    │   ├── components/
    │   │   ├── Header.tsx       ← Fixed nav with scroll effect
    │   │   ├── HeroSection.tsx  ← Full-screen hero with bg switching
    │   │   └── ArchWheel.tsx    ← Rotating wheel of photo icons
    │   ├── data/
    │   │   └── archIcons.ts     ← Photography categories data
    │   ├── hooks/
    │   │   └── useScrolled.ts   ← Custom hook: header scroll effect
    │   ├── styles/
    │   │   ├── globals.css      ← Global styles + font import
    │   │   ├── Header.module.css
    │   │   └── Hero.module.css
    │   └── types/
    │       └── index.ts         ← TypeScript interfaces
    ├── package.json
    ├── tsconfig.json
    └── next.config.js
```

---

## Getting Started

```bash
cd frontend/studio_website_main
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Adding Your Own Photos

Replace the `imageUrl` values in `src/data/archIcons.ts` with your own local paths or Unsplash URLs. Local images should be placed in the `/public` folder and referenced as `/your-image.jpg`.

---

## Features

- ✅ Fixed header that gains a glassmorphism background on scroll
- ✅ Animated rotating arch-wheel with 10 photo cards
- ✅ Background crossfade between hero images on icon click
- ✅ Apex-monitor: auto-highlights nearest center icon on rotation
- ✅ Smooth text fade transition on category switch
- ✅ Responsive layout for mobile/tablet/desktop
- ✅ Fully typed with TypeScript interfaces
