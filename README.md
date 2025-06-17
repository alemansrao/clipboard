# Clipboard Project - Summary

## Overview

The Clipboard project is a modern web application designed to manage, store, and interact with snippets of text or content. It leverages the Next.js framework for server-side rendering and routing, React for UI components, and a variety of supporting libraries for authentication, UI, and utility functions.

---

## Key Features

- **User Authentication**: Integrates with NextAuth.js for secure user login and session management.
- **Clipboard Management**: Users can add, view, favorite, and delete clipboard entries.
- **Copy to Clipboard**: One-click copy functionality for clipboard items, with toast notifications for feedback.
- **Favorites**: Mark/unmark clipboard items as favorites for quick access.
- **Responsive UI**: Built with HeroUI components for a modern, accessible interface.
- **Theme Switching**: Light/dark mode toggle using `next-themes` and a custom theme switch component.
- **Server-Side Rendering**: Uses Next.js SSR for fast initial loads and SEO benefits.
- **API Integration**: Fetches and manipulates clipboard data via RESTful API endpoints.

---

## Main Components

- **CardComponent**: Displays individual clipboard entries with actions (copy, favorite, delete).
- **NavbarComponent**: Top navigation bar with branding, add button, and theme switcher.
- **ThemeSwitch**: Custom toggle for switching between light and dark themes.
- **PostDetailPage**: Dynamic route for viewing details of a specific clipboard entry.

---

## Technology Stack

- **Frontend**: React, Next.js, HeroUI, Tailwind CSS (for utility classes)
- **Authentication**: NextAuth.js (with support for OAuth providers)
- **UI Icons**: react-icons (FontAwesome, Ionicons)
- **Notifications**: HeroUI Toast
- **State Management**: React hooks (`useState`, `useEffect`)
- **Clipboard API**: Uses the browser's `navigator.clipboard` API
- **Utilities**: clsx (conditional classNames), uuid (for unique IDs), lodash (utility functions)

---

## Project Structure

- `/components`: Reusable UI components (Card, Navbar, ThemeSwitch, etc.)
- `/app`: Next.js app directory with page routes (including dynamic `[id]` route for clipboard details)
- `/api`: API endpoints for CRUD operations on clipboard data
- `/node_modules`: External dependencies (including openid-client, jsonwebtoken, etc.)
- `.next`: Next.js build output (server chunks, SSR code, etc.)

---

## Notable Code Patterns

- **SSR with Client-Side Hooks**: Uses `"use client"` directive for components that require browser APIs or React hooks.
- **Dynamic Routing**: Uses Next.js dynamic routes (e.g., `/app/[id]/page.jsx`) to display individual clipboard entries.
- **Conditional Rendering**: Handles loading, error, and empty states gracefully in UI components.
- **Modular Imports**: Leverages code-splitting and modular imports for performance.

---

## How It Works

1. **Authentication**: Users log in via NextAuth.js. Unauthenticated users are redirected to the login page.
2. **Viewing Clipboard Items**: The main page lists all clipboard entries. Each entry is rendered as a CardComponent.
3. **Copying Content**: Clicking the title copies the content to the clipboard and shows a toast notification.
4. **Favorites & Deletion**: Users can mark items as favorites or delete them (with appropriate UI feedback).
5. **Theme Switching**: Users can toggle between light and dark themes via the Navbar.
6. **Detail View**: Clicking on a clipboard entry navigates to a detail page (`/app/[id]`) showing the full content.

---

## Extensibility

- **API Layer**: Easily extendable for more complex CRUD operations or integration with external storage.
- **UI Components**: Modular design allows for easy addition of new features (e.g., search, tags).
- **Authentication Providers**: NextAuth.js supports adding more OAuth providers as needed.

---

## Dependencies

- `next`, `react`, `next-auth`, `@heroui/*`, `react-icons`, `clsx`, `uuid`, `jsonwebtoken`, `openid-client`, and more.

---

## Environment Variables

You must define the following 5 keys in a `.env` file at the project root:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace the example values with your actual credentials.

---

## Getting Started

1. **Install dependencies**: `npm install`
2. **Run development server**: `npm run dev`
3. **Build for production**: `npm run build`
4. **Start production server**: `npm start`

---

## License

This project is licensed under the MIT License.

---
