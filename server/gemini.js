const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

const PROMPT_TEMPLATE = (name) => `You are a historical data API. Return ONLY valid JSON (no markdown, no code blocks) for the historical figure "${name}".

Return this exact JSON structure:
{
  "person": "${name}",
  "title": "Short title/epithet",
  "born": <year number>,
  "died": <year number>,
  "portrait": "<a real Wikipedia commons image URL of this person if available, otherwise empty string>",
  "summary": "2-3 sentence biography",
  "events": [
    {
      "id": <sequential number starting from 1>,
      "title": "Event title",
      "year": <year number>,
      "lat": <latitude as number>,
      "lng": <longitude as number>,
      "place": "Place name",
      "description": "2-3 sentence description of the event",
      "people": ["Other people involved"],
      "type": "birth|death|battle|coronation|meeting|journey|achievement|construction",
      "highlight": <true if this is a particularly significant event, false otherwise>,
      "images": [],
      "videos": [],
      "links": ["https://en.wikipedia.org/wiki/relevant_article"]
    }
  ]
}

Include 8-15 major life events in chronological order. Ensure lat/lng coordinates are accurate real-world locations. Mark 2-3 events as highlighted. Include birth and death events.`;

async function fetchPersonData(name, apiKey) {
  const cacheFile = path.join(CACHE_DIR, `${name.toLowerCase().replace(/\s+/g, "_")}.json`);

  // Check cache first
  if (fs.existsSync(cacheFile)) {
    const cached = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
    return cached;
  }

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
  });

  const result = await client.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      { role: "user", content: PROMPT_TEMPLATE(name) }
    ],
  });

  const text = result.choices[0].message.content;

  // Clean up response - remove markdown code blocks if present
  let cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const data = JSON.parse(cleaned);

  // Cache the result
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));

  return data;
}

module.exports = { fetchPersonData };
