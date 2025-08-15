<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FelloWs OS Next Gen Maternity Platform

This contains everything you need to run your app locally and deploy it to Netlify.

View your app in AI Studio: https://ai.studio/apps/drive/11yExWu8GmfaEIWbWQyuUNrqY9g98f8H6

## Run Locally

**Prerequisites:** Node.js (version 18 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Set your `GEMINI_API_KEY` in `.env.local` to your Gemini API key
4. Run the app:
   ```bash
   npm run dev
   ```

## Build for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy to Netlify

### Option 1: Deploy from Git Repository

1. **Connect Repository:**
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose your Git provider and select this repository

2. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These settings are also configured in `netlify.toml`

3. **Set Environment Variables:**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add `GEMINI_API_KEY` with your Google AI Studio API key

4. **Deploy:**
   - Click "Deploy site"
   - Your site will be available at a Netlify URL

### Option 2: Manual Deploy

1. Build the project locally:
   ```bash
   npm run build
   ```

2. Go to [Netlify](https://netlify.com) and drag the `dist/` folder to the deploy area

3. Configure environment variables in Site settings if needed

## Environment Variables

- `GEMINI_API_KEY`: Your Google AI Studio API key
  - Get it from: https://ai.studio/apps/drive/11yExWu8GmfaEIWbWQyuUNrqY9g98f8H6
  - Required for the AI functionality to work

## Project Structure

- `index.html` - Main HTML file
- `index.tsx` - TypeScript entry point
- `index.css` - Styles
- `vite.config.ts` - Vite configuration
- `netlify.toml` - Netlify deployment configuration
