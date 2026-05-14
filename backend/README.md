# 🚀 AI Resume Analyser - Backend API

This directory contains the backend server for the AI Resume Analyser application. It handles parsing resumes (PDF/DOCX), scoring them against job descriptions using Natural Language Processing (NLP), generating AI-powered study plans via OpenAI, and managing user data.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT (JSON Web Tokens) & Google Auth Library
* **AI & NLP:** `openai`, `natural`, `stopword`
* **File Processing:** `pdf-parse` (PDFs), `mammoth` (DOCX), `multer`
* **Cloud Storage:** Cloudinary (for storing profile pictures or resumes)

## 📁 Directory Structure

```text
backend/
├── API/              # Express route controllers (e.g., pdfAPI.js, analysisAPI.js, resumeHistoryAPI.js)
├── config/           # Database and Cloudinary configuration files
├── middleware/       # Custom middleware (authentication, file upload, error handling)
├── model/            # Mongoose schemas (User, ResumeHistory, etc.)
├── utils/            # Helper functions (scoringUtils.js, nlp setup)
├── server.js         # Entry point for the Express application
└── package.json      # Dependencies and scripts
```

## ⚙️ Environment Variables

Create a `.env` file in the root of the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key

# Cloudinary Setup (if applicable)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   # or
   node server.js
   ```

The server will start on the port specified in your `.env` file (default is `5000`).

## 🧠 Key Features & Logic

* **Resume Parsing Engine:** Uploaded files are parsed dynamically. Stop-words are removed, and the core skills/text are isolated.
* **NLP Matching System:** Uses the `natural` library to tokenize job descriptions and resumes, returning an exact percentage match for technical keywords.
* **AI Study Plan Generator:** Integrates with the OpenAI API to craft personalized learning paths based on the missing keywords calculated by the scoring utility.
