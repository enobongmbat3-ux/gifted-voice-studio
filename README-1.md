# Gifted Voice Studio

Static web app (no build step) + one Netlify Function that proxies to a real voice-conversion backend.

## Deploy
1. Push this folder to GitHub, then "Import from Git" in Netlify (publish dir `.`, functions `netlify/functions`).
2. Add env vars: `VOICE_API_URL` (required), `VOICE_API_KEY` (optional). Never put keys in `index.html`.

## Backend contract
`POST VOICE_API_URL` — multipart/form-data with files `source` and `reference`.
Respond with the converted audio (`audio/wav` or `audio/mpeg`) as the body.

## Open-source models to host behind that URL
Seed-VC, OpenVoice, or RVC — run on a GPU host (Hugging Face Space, Modal, RunPod, your own server) and wrap with a small FastAPI endpoint.

## Limits
Netlify Functions allow ~6 MB requests and ~10–26 s runtime. For longer or larger files, host the backend with CORS enabled and set `API_ENDPOINT` at the top of the script in `index.html` to its URL (use a short-lived token, not a secret key).
