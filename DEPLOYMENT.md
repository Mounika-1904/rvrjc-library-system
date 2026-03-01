# College Library Management System: Deployment Guide 🚀

Follow these steps to deploy the application on a production-ready cloud stack using GitHub, Neon (Database), Render (Backend), and Vercel/Render (Frontend).

## 0. Install Git
Your computer needs a program called "Git" to upload code to the cloud.
1. Download Git for Windows from: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Run the downloaded installer (you can just click "Next" on all the default settings).
3. **IMPORTANT:** Once installed, completely CLOSE and re-open your VS Code / Terminal for it to recognize the new `git` command.

## 1. Push Application to GitHub

1. **Create a GitHub Account:** Go to [GitHub.com](https://github.com/) and sign up if you don't have an account.
2. **Create a New Repository:** 
   - Once logged into GitHub, click the `+` icon in the top right corner and select `New repository`.
   - Name it `rvrjc-library-system` (or whatever you prefer).
   - Leave it as "Public" or "Private". Do NOT check "Add a README file". Click `Create repository`.
3. **Open Terminal in Your Folder:**
   - Go to your `UI-UX apll` folder. Right-click inside the folder and select "Open in Terminal" or "Open Git Bash here".
4. **Run Git Commands:** Run these exactly as written one by one, pressing Enter after each:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Library System"
   git branch -M main
   # IMPORTANT: Replace the URL below with the actual URL GitHub gave you in Step 2!
   git remote add origin https://github.com/YOUR_USERNAME/rvrjc-library-system.git
   git push -u origin main
   ```
5. **Verify:** Refresh your GitHub page. You should now see all your folders (`frontend`, `backend`, `brain`, etc.) uploaded there!

## 1. Set Up PostgreSQL Database on Neon
1. Go to [Neon.tech](https://neon.tech/) and sign up.
2. Create a new project. Name it something like `rvrjc-library-db`.
3. Neon will provide you with a PostgreSQl connection string. It starts with `postgresql://...` or `postgres://...`
4. Copy this connection string. You will need it in the next step.

## 2. Deploy Backend on Vercel
1. Push this codebase to your GitHub account (as done in Step 1).
2. Go to [Vercel.com](https://vercel.com/) and sign up with GitHub.
3. Click **Add New** -> **Project**.
4. Import your GitHub repository (`rvrjc-library-system`).
5. In the configuration settings that appear:
   - **Framework Preset**: `Other`
   - **Root Directory**: Click "Edit" and type `backend` (Important!).
6. Expand the **Environment Variables** section and add:
   - Name: `DATABASE_URL`, Value: (Paste the Neon connection string from Step 1)
   - Name: `JWT_SECRET`, Value: (A strong, secure random string, e.g. `MyRVRSecretKey2025`)
7. Click **Deploy**. Wait for the deployment to finish.
8. Once deployed, Vercel gives you a URL (e.g., `https://rvrjc-library-backend.vercel.app`). Copy this URL.

## 3. Link Frontend to the New Vercel Backend
1. In your code editor, open `frontend/js/script.js`.
2. Locate line 1: `const API_URL = 'http://localhost:5000/api';`
3. Replace `http://localhost:5000` with your actual Vercel backend URL from Step 2.
   *Example:* `const API_URL = 'https://rvrjc-library-backend.vercel.app/api';`
4. Commit and push this change to GitHub (run `git add .`, `git commit -m "update api url"`, `git push`).

## 4. Deploy Frontend on Vercel
1. Go back to your [Vercel dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Import the *exact same* GitHub repository (`rvrjc-library-system`) again.
3. In the configuration settings:
   - **Project Name:** Name it something different like `rvrjc-library-frontend`
   - **Framework Preset**: `Other`
   - **Root Directory**: Click "Edit" and type `frontend` (Important!).
4. Click **Deploy**.
5. Vercel will build and deploy your frontend, providing you with a live URL!

Your application is now entirely globally accessible on Vercel! 🎉
