#!/usr/bin/env node
import { appendFileSync } from "node:fs";

const SITE_URL = process.env.SITE_URL || "https://sports-calendar-v4.vercel.app/";
const API_KEY = process.env.SAFE_BROWSING_API_KEY;

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}

if (!API_KEY) {
  console.error("Missing SAFE_BROWSING_API_KEY env var");
  process.exit(1);
}

const body = {
  client: { clientId: "sports-calendar-v3-monitor", clientVersion: "1.0.0" },
  threatInfo: {
    threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
    platformTypes: ["ANY_PLATFORM"],
    threatEntryTypes: ["URL"],
    threatEntries: [{ url: SITE_URL }],
  },
};

let res;
try {
  res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
} catch (err) {
  console.error(`Network error calling Safe Browsing API: ${err.message}`);
  process.exit(1);
}

if (!res.ok) {
  console.error(`Safe Browsing API error: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
const flagged = Array.isArray(data.matches) && data.matches.length > 0;

setOutput("flagged", flagged);

if (flagged) {
  console.error("FLAGGED:", JSON.stringify(data.matches, null, 2));
} else {
  console.log(`Clean: ${SITE_URL} has no Safe Browsing matches.`);
}
