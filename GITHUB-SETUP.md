# GitHub Repository Setup Instructions

## Step 1: Create GitHub Repository
1. Go to https://github.com and sign in
2. Click the "+" icon → "New repository"
3. Repository name: `carpentry-website`
4. Description: "Professional carpentry website for Casa Madera - The Bahamas"
5. Set to **Public**
6. **DON'T** check "Initialize with README"
7. Click "Create repository"

## Step 2: Connect Local Repository
After creating the GitHub repository, run these commands in your terminal:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/carpentry-website.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Verify Upload
- Go to your GitHub repository
- You should see all your website files
- Make sure the `_data` folder and `admin` folder are there

## Next Steps
After pushing to GitHub:
1. Set up Netlify deployment
2. Configure Netlify Identity
3. Test the admin panel

## Troubleshooting
If you get authentication errors:
- You may need to set up a GitHub personal access token
- Go to GitHub Settings → Developer settings → Personal access tokens
- Create a token with "repo" permissions
- Use the token as your password when prompted