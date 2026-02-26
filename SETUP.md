# 🚀 M1778-Dungen — GitHub Hosting & Setup Guide

A complete step-by-step guide to get M1778-Dungen live on the internet using GitHub Pages.

---

## 📋 Prerequisites

- A [GitHub account](https://github.com)
- [Git](https://git-scm.com/downloads) installed on your computer
- [Node.js](https://nodejs.org/) installed (for local testing only)

---

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `M1778-Dungen`
3. **Description:** `Challenge dungeon for Pony.gamer 🎮`
4. Set it to **Public** (required for free GitHub Pages hosting)
5. Do **NOT** check "Add a README file" (we already have one)
6. Click **Create repository**

---

## Step 2: Push Your Code to GitHub

Open a terminal in the project folder and run these commands:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create the first commit
git commit -m "Initial commit - M1778-Dungen challenge dungeon"

# Set the branch name to main
git branch -M main

# Add your GitHub repo as origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/M1778-Dungen.git

# Push the code
git push -u origin main
```

---

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/M1778-Dungen`
2. Click the **Settings** tab (gear icon, top right)
3. In the left sidebar, click **Pages**
4. Under **Source**, select **GitHub Actions**
5. That's it! The included workflow (`.github/workflows/deploy.yml`) will handle deployment automatically

---

## Step 4: Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages" in progress
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once it shows a green ✅ checkmark, your site is live!

---

## Step 5: Access Your Live Site

Your site will be available at:

```
https://YOUR_USERNAME.github.io/M1778-Dungen/
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 🖥️ Local Development (Optional)

If you want to test locally before deploying:

```bash
# Install dependencies
npm install

# Start the local server
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Updating the Site

Every time you push changes to the `main` branch, GitHub Actions will automatically redeploy your site:

```bash
# Make your changes, then:
git add .
git commit -m "Update: description of changes"
git push
```

The site will update automatically within 1-2 minutes.

---

## 🔧 Troubleshooting

### Site shows 404 error
- Make sure GitHub Pages source is set to **GitHub Actions** (not "Deploy from a branch")
- Check the **Actions** tab for any failed deployments
- Make sure the repository is **Public**

### Workflow failed
- Go to **Actions** tab → click the failed run → check the error logs
- Make sure all files are committed and pushed

### Styles/Scripts not loading
- All paths in the HTML files should be relative (e.g., `css/style.css` not `/css/style.css`)
- Clear your browser cache and try again

### Login cookie doesn't work
- GitHub Pages uses HTTPS, so cookies should work fine
- Make sure you're on the correct URL
- Try clearing cookies for the site

---

## 📁 Project Structure

```
M1778-Dungen/
├── public/                  # All static files (deployed to GitHub Pages)
│   ├── index.html           # Homepage
│   ├── login.html           # Password login page
│   ├── challenges.html      # Challenge levels page
│   ├── css/
│   │   └── style.css        # Retro 2009 styling
│   └── js/
│       ├── auth.js          # Authentication & SHA256
│       └── challenges.js    # All 10 game implementations
├── server.js                # Express server (for local dev only)
├── package.json             # Node.js config
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages auto-deploy
├── README.md                # Project overview
├── SETUP.md                 # This setup guide
└── answers.md               # ⚠️ All answers (keep secret!)
```

---

## ⚠️ Important Notes

- **`answers.md` contains all the answers!** If you want to keep the challenge secret, consider adding it to `.gitignore` before pushing, or delete it from the repo after reviewing.
- The login password is stored as a SHA-256 hash in the code, so it's not visible in plain text to anyone inspecting the source.
- Level 10's answer is also SHA-256 hashed for extra security.

---

## 🎉 You're Done!

Share the link with Pony.gamer and let the challenge begin! 🐴⚔️

```
https://YOUR_USERNAME.github.io/M1778-Dungen/
```

Good luck! 💰
