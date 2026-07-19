# AI Career Growth Mirror

A judge-ready demo app that turns a career profile, a resume, and weekly check-ins into a practical AI career-growth analysis with a visible live-vs-offline mode.

## Screenshot

![Demo placeholder](https://placehold.co/1200x640?text=Career+Growth+Mirror)

## Local setup

```bash
npm install
npm run server
npm run dev
```

## Deploy

### Render (API)
- Deploy [server.js](server.js)
- Set environment variables:
  - OPENAI_API_KEY
  - PORT=3001
  - CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173

### Vercel (frontend)
- Deploy the frontend app
- Set VITE_API_URL=https://your-api.onrender.com

## Demo script (3 minutes)
1. Open the profile page and fill in your role, target role, challenge, and skills.
2. Upload a PDF or TXT resume and note the resume text being used.
3. Generate analysis and show the Live AI badge.
4. Add a check-in, re-analyze with check-ins, and show the experiment update.
5. Turn off the API or use a bad CORS origin to show the Offline demo fallback banner.

## Troubleshooting
- If the Analysis page shows “Offline demo”, check that the API server has OPENAI_API_KEY and that CORS_ORIGINS includes your frontend origin.
- If the resume upload fails, try a plain TXT file or a text-based PDF.
