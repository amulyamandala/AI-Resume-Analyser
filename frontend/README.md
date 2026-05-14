# 🎨 AI Resume Analyser - Frontend Application

This directory contains the user interface for the AI Resume Analyser. It's a modern, blazing-fast Single Page Application (SPA) that allows users to upload resumes, input job descriptions, view their ATS match scores, and explore AI-generated study plans.

## 🛠️ Tech Stack

* **Core Framework:** React 19 + Vite
* **Styling:** Tailwind CSS v4
* **State Management:** Zustand
* **Routing:** React Router v7
* **Authentication UI:** `@react-oauth/google` & Firebase
* **Document Preview:** `react-pdf` & `docx-preview`
* **Icons & UI Feedback:** `lucide-react` & `react-hot-toast`

## 📁 Directory Structure

```text
frontend/
├── public/           # Static assets like favicon
├── src/
│   ├── assets/       # Images, logos, and global static files
│   ├── components/   # Reusable UI components (Header, Footer, Dashboard, Profile, etc.)
│   ├── store/        # Zustand global state management slices
│   ├── styles/       # Global CSS and Tailwind configuration/utilities
│   ├── App.jsx       # Root application component and route definitions
│   └── main.jsx      # React DOM entry point
├── .env              # Environment variables (Ignored by Git)
├── package.json      # Dependencies and Vite scripts
└── vercel.json       # Vercel deployment configuration
```

## ⚙️ Environment Variables

Create a `.env` file in the root of the `frontend` directory with the following variables to connect to your local backend:

```env
VITE_API_URL=http://localhost:5000

# Add any additional Firebase or Google Client IDs here if required
# VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

The application will be accessible at `http://localhost:5173` by default.

## 🌟 Key Features

* **Interactive Dashboard:** Upload your files safely and securely while seeing your ATS match results mapped out beautifully.
* **In-Browser Document Preview:** Verify the contents of your PDF or DOCX file before submitting it for analysis.
* **Dynamic Study Plans:** Read through an AI-generated curriculum that focuses on exactly what you missed from the job description.
* **Fully Responsive:** Optimized across desktop, tablet, and mobile viewing using Tailwind CSS utility classes.
