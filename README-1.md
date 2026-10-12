# Gifted Voice Studio

Static web app (no build step). Voice conversion is done by a Seed-VC Gradio Space, called straight from the browser with the official Gradio JS client. No secret keys exist in the browser code.

## Files
- `index.html` — the whole app (design, uploads, previews, Gradio call, result/download)
- `netlify.toml` — Netlify settings (publish `.`, functions in `netlify/functions`)
- `netlify/functions/convert.js` — optional proxy for a private backend. **Not used** by the current Gradio setup; safe to leave in place.

## How conversion works
- Space: `SPACE_URL` at the top of the script in `index.html` (currently `https://mtnproductions-seed-vc.hf.space`).
- Endpoint `/predict_1` (Seed-VC V1), inputs by name: `source_audio_path`, `target_audio_path`, `diffusion_steps`, `length_adjust`, `inference_cfg_rate`, `f0_condition`, `auto_f0_adjust`, `pitch_shift`.
- Outputs: `[stream chunks, Full Output Audio]`. The app plays and offers download of the **second** (full) output.
- If the Space is busy, asleep, out of quota, or fails, the app shows an error. It never returns the original audio as a result.

## Test checklist
1. Open the site, add a short (5–10 s) source and a clean 10–25 s reference, tick the permission box, press Convert.
2. Status text should change (connecting, queue/starting, converting). A sleeping Space can take minutes.
3. Confirm the result plays, sounds like the reference voice, and Download saves a file.

## Important
- This uses a third-party public demo: it can disappear, queue, or hit GPU quota, and your audio is sent to it. For real use, duplicate the Seed-VC Space into your own Hugging Face account and change `SPACE_URL`.
- The Gradio client loads from jsDelivr unpinned. After your first successful test, pin a version (see jsdelivr.com/package/npm/@gradio/client) in `GRADIO_CLIENT_URL`.
- For a private Space you would need a token kept on the server (Netlify Function), never in `index.html`.
- 
