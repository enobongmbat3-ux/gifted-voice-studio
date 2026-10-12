// Secure proxy: keeps VOICE_API_KEY on the server, never in the browser.
// Set VOICE_API_URL (and optionally VOICE_API_KEY) in Netlify > Site settings > Environment variables.
const json = (statusCode, obj) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(obj),
});

exports.handler = async (event) => {
  const url = process.env.VOICE_API_URL;
  const key = process.env.VOICE_API_KEY;

  if (event.httpMethod === "GET") return json(200, { configured: Boolean(url) });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  if (!url) {
    return json(503, {
      error: "The voice conversion service isn't connected yet. Set VOICE_API_URL on the server.",
    });
  }

  try {
    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": event.headers["content-type"],
        ...(key ? { authorization: `Bearer ${key}` } : {}),
      },
      body,
    });
    if (!res.ok) return json(502, { error: `Conversion service responded with ${res.status}.` });
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: { "content-type": res.headers.get("content-type") || "audio/wav" },
      body: buf.toString("base64"),
    };
  } catch (e) {
    return json(502, { error: "Could not reach the conversion service." });
  }
};
