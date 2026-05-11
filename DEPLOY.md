# Production Deployment Guide: smart-diet-plan.vercel.app

This guide explains how to deploy this application to your Vercel production domain using the terminal.

## Prerequisites
1. **Node.js**: Ensure you have Node.js 18+ installed.
2. **Vercel CLI**: Install it globally:
   ```bash
   npm install -g vercel
   ```

## Steps to Deploy

### 1. Install Dependencies
After downloading the ZIP, you must install the required libraries:
```bash
npm install
```

### 2. Build the Application
Generate the optimized production build:
```bash
npm run build
```
This will create a `dist` folder.

### 2. Login to Vercel (Terminal)
If not already logged in:
```bash
vercel login
```

### 3. Initialize & Deploy to Production
Run the following command in the root folder:
```bash
vercel --prod
```
*   **Set Setup and Deploy?** Yes
*   **Which scope?** [Your Scope]
*   **Link to existing project?** Yes
*   **Select Project:** [Select your 'smart-diet-plan' project]

### 4. Configure Environment Variables
Ensure the following variables are set in your Vercel Dashboard (Settings > Environment Variables):
- `GEMINI_API_KEY`: Your Google AI Studio API key.

## Firebase Configuration
Make sure the following are added to your **Firebase Console** (Build > Authentication > Settings > Authorized Domains):
1. `smart-diet-plan.vercel.app`
2. `localhost`

---

## Troubleshooting Login (Redirect Problems)
If login fails after deployment:
1. Go to Firebase Console > Project Settings > General.
2. Look at your **Web App** config.
3. Ensure the `authDomain` in your `firebase-applet-config.json` matches either your Firebase project ID (e.g., `your-project.firebaseapp.com`) or your custom Vercel domain if configured as a custom auth domain.
4. **Important**: Using `smart-diet-plan.vercel.app` as the `authDomain` requires setting up a custom domain in the Firebase Authentication settings.
