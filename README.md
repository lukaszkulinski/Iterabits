
# Iterabits Habit Tracker 🌸

Iterabits is a beautiful, intelligent, mobile-first habit tracker built with React, TypeScript, Tailwind CSS, and Supabase. It leverages Google Gemini AI to provide personalized motivation and insights based on your habit streaks.

## ✨ Features

*   **Progressive Web App (PWA):** Installable on mobile and desktop, works offline.
*   **Glassmorphism Design:** Modern, dark-themed UI with smooth animations.
*   **Habit Tracking:** Create, edit, and delete habits with custom categories.
*   **Smart Analytics:** Weekly success rates, best day tracking, and interactive charts.
*   **AI Insights:** personalized daily coaching and habit-specific trivia powered by Gemini AI.
*   **Detailed History:** Calendar view to track progress over months.
*   **Cloud Sync:** Data persistence via Supabase Authentication and Database.
*   **Multi-language Support:** English (EN) and Polish (PL).

## 🚀 Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS, Lucide React (Icons), Recharts (Analytics)
*   **Backend / DB:** Supabase (PostgreSQL + Auth)
*   **AI:** Google Gemini API (@google/genai)
*   **Build Tool:** Vite (Compatible)

## 🛠️ Setup & Configuration

To run this project or deploy it, you need to configure the Environment Variables.

### 1. Supabase Setup
You need a Supabase project with the following tables:
1.  `habits`
2.  `categories`
3.  `habit_completions`

(See provided SQL scripts in the development history for structure and RLS policies).

### 2. Environment Variables
Create a `.env` file in the root directory or configure these variables in your deployment provider (Vercel, Netlify, etc.):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI (Already injected in some environments as API_KEY)
API_KEY=your_gemini_api_key
```

### 3. Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 📱 PWA Support
The app includes a `manifest.json` and `service-worker.js` to enable "Add to Home Screen" functionality and offline caching for static assets.

## 📄 License
MIT
