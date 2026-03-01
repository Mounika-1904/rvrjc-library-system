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

## 2. Deploy Backend on Render
1. Push this codebase to your GitHub account.
2. Go to [Render.com](https://render.com/) and sign up with GitHub.
3. Click on **New +** and select **Web Service**.
4. Connect the GitHub repository containing this code.
5. In the settings:
   - **Root Directory**: `backend` (Important!)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` or `npm start`
6. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL` = (Paste the Neon connection string from Step 1)
   - `JWT_SECRET` = (A strong, secure random string)
7. Click **Create Web Service**. Wait for the deployment to finish.
8. Once deployed, Render gives you a URL (e.g., `https://rvrjc-library-backend.onrender.com`). Copy this URL.

## 3. Configure Frontend
1. In your code, open `frontend/js/script.js`.
2. Locate line 1: `const API_URL = ...`
3. Replace the placeholder URL (`https://rvrjc-library-backend.onrender.com/api`) with your actual Render backend URL from Step 2.
4. Commit and push this change to GitHub.

## 4. Deploy Frontend on Vercel (Recommended) or Render
1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. In the configuration:
   - **Framework Preset**: `Other`
   - **Root Directory**: `frontend` (Important!)
5. Click **Deploy**.
6. Vercel will build and deploy your frontend, providing you with a live URL!

Your application is now globally accessible and production-ready. 🎉
