# Ankit Dutta - Personal Website

A fully responsive personal website for Ankit Dutta showcasing his achievements, skills, and experiences. The website features real-time Firebase integration, allowing content to be updated instantly from an admin panel.

## 🎯 Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Real-time Content**: Firebase integration with real-time data updates
- **Modern UI/UX**: Clean, modern design with animations and transitions
- **Dynamic Sections**:
  - Projects showcase
  - Blog posts
  - Achievements and certifications
  - Extracurricular activities
  - Photo gallery
  - Skills and expertise
  - Testimonials
  - Contact form

## 🔧 Technologies Used

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Cloud Storage)
- **Deployment**: Vercel

## 📁 Project Structure

The project follows a modular structure for easy maintenance:

```
ankit-website/
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── home/          # Homepage-specific components
│   │   ├── layout/        # Layout components (navbar, footer)
│   │   └── shared/        # Shared UI components
│   ├── lib/               # Utility functions and config
│   │   ├── firebase/      # Firebase configuration and helpers
│   │   └── types/         # TypeScript interfaces
│   └── styles/            # Global styles
├── public/                # Static assets
│   └── images/            # Image files
└── ...config files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Firebase config:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_USER_ID=...
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Content Management

Content is managed through the companion admin panel application. All changes made in the admin panel are reflected in real-time on the website.

## 🔒 Security

The Firebase security rules ensure that:
- Public website only has read access to content
- Admin panel has full CRUD access when authenticated
