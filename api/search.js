import OpenAI from "openai";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

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

function loadBundledCache(name) {
  const key = name.toLowerCase().replace(/\s+/g, "_");
  try {
    const cacheFile = path.join(process.cwd(), "cache", `${key}.json`);
    if (fs.existsSync(cacheFile)) {
      return JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
    }
  } catch {
    // ignore
  }
  return null;
}

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Name parameter required" });

  const cacheKey = `geotimeline:${name.toLowerCase().replace(/\s+/g, "_")}`;

  // 1. Bundled cache
  const bundled = loadBundledCache(name);
  if (bundled) return res.json(bundled);

  // 2. Upstash Redis
  const redis = getRedis();
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return res.json(cached);
    } catch (e) {
      console.error("Redis read error:", e.message);
    }
  }

  // 3. OpenRouter API
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OPENROUTER_API_KEY not set" });

  try {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    });

    const result = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: PROMPT_TEMPLATE(name) }],
    });

    const text = result.choices[0].message.content;
    let cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const data = JSON.parse(cleaned);

    // Cache in Redis
    if (redis) {
      try {
        await redis.set(cacheKey, data);
      } catch (e) {
        console.error("Redis write error:", e.message);
      }
    }

    res.json(data);
  } catch (err) {
    console.error("OpenRouter API error:", err.message);
    res.status(500).json({ error: "Failed to fetch data", details: err.message });
  }
}
