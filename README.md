## Hidayah AI — Your Islamic Companion

Tagline: Learn, Recite, and Discover with Guidance from AI

### Identity
- Name: Hidayah AI
- Theme Colors: White (purity), Emerald Green (Islamic tradition), Gold (premium feel)
- Logo Concept: Crescent + Quran book + minimal AI touch

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the home page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Static HTML Export

The app is configured for static export. To produce a static site that can be hosted as plain HTML:

```bash
npm run build
npm run export
# Output in `out/` can be hosted anywhere
```

## Features
- **Qur'an Reader**: Uthmani script, tafsir, translations, audio, bookmarks
- **Hadith Insights**: Search, source verification, AI summaries with local and external datasets
- **AI Chatbot**: Ask Islamic questions, find ayat/hadith (disclaimer added)
- **Recitation Feedback**: AI listens & corrects tajweed & pronunciation
- **Profile**: User history, streaks, bookmarks, progress

## API Configuration

### HadithAPI.com Integration
This app integrates with HadithAPI.com for external hadith data. To set up:

1. **Create environment file**: Create a `.env.local` file in the root directory
2. **Add your API key**:
   ```
   HADITHAPI_KEY=your_api_key_here
   ```
3. **Test the connection**: Visit `/api/hadith/test` to verify the API is working

The app also includes a comprehensive local hadith dataset with 16 authentic hadiths from major collections.

### Available Hadith Sources
- **Local Dataset**: 16 authentic hadiths with full metadata
- **External API**: HadithAPI.com integration for extensive search
- **Collections**: Sahih Bukhari, Sahih Muslim, Jami' at-Tirmidhi, Sunan an-Nasa'i, Sunan Abu Dawud, Sunan Ibn Majah
