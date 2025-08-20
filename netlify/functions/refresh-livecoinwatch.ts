import type { Handler } from '@netlify/functions';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../../shared/schema.js';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool, schema });

// choose which tickers to store (can be many; LCW /coins/list supports paging)
const CODES = ['ETH', 'BTC']; // add more codes as you like

async function fetchCoinsFromLCW(codes: string[]) {
  // LCW “coins/list” endpoint returns many coins in one call (efficient).
  // If you prefer a different LCW endpoint, adjust the URL/body accordingly.
  const res = await fetch('https://api.livecoinwatch.com/coins/list', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.LIVECOINWATCH_API_KEY!,
    },
    body: JSON.stringify({
      currency: 'USD',
      sort: 'rank',
      order: 'ascending',
      offset: 0,
      limit: 100,     // pull a page big enough to include your codes
      meta: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`LCW list failed: ${res.status} ${await res.text()}`);
  }

  type LcwCoin = {
    code: string;
    name: string;
    rate: number;
    volume: number;
    cap: number | null;
    delta?: {
      hour?: number | null;
      day?: number | null;
      week?: number | null;
      month?: number | null;
      quarter?: number | null;
      year?: number | null;
    };
    supply?: number | null;           // some fields vary by plan
    circulatingSupply?: number | null;
    maxSupply?: number | null;
  };

  const data = (await res.json()) as LcwCoin[];

  // Keep only the coins you care about
  const byCode = new Map(data.map((c) => [c.code, c]));
  return codes.map((code) => byCode.get(code)).filter(Boolean) as LcwCoin[];
}

async function upsertCoins(coins: any[]) {
  // upsert each coin by unique code
  for (const c of coins) {
    await db
      .insert(schema.liveCoinWatchCoins)
      .values({
        code: c.code,
        name: c.name,
        rate: c.rate ?? null,
        volume: c.volume ?? null,
        cap: c.cap ?? null,
        deltaHour: c.delta?.hour ?? null,
        deltaDay: c.delta?.day ?? null,
        deltaWeek: c.delta?.week ?? null,
        deltaMonth: c.delta?.month ?? null,
        deltaQuarter: c.delta?.quarter ?? null,
        deltaYear: c.delta?.year ?? null,
        totalSupply: (c.supply ?? null) as any,
        circulatingSupply: (c.circulatingSupply ?? null) as any,
        maxSupply: (c.maxSupply ?? null) as any,
      })
      .onConflictDoUpdate({
        target: schema.liveCoinWatchCoins.code,
        set: {
          name: c.name,
          rate: c.rate ?? null,
          volume: c.volume ?? null,
          cap: c.cap ?? null,
          deltaHour: c.delta?.hour ?? null,
          deltaDay: c.delta?.day ?? null,
          deltaWeek: c.delta?.week ?? null,
          deltaMonth: c.delta?.month ?? null,
          deltaQuarter: c.delta?.quarter ?? null,
          deltaYear: c.delta?.year ?? null,
          totalSupply: (c.supply ?? null) as any,
          circulatingSupply: (c.circulatingSupply ?? null) as any,
          maxSupply: (c.maxSupply ?? null) as any,
          lastUpdated: new Date(),
        },
      });
  }
}

export const handler: Handler = async () => {
  try {
    if (!process.env.LIVECOINWATCH_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing LIVECOINWATCH_API_KEY' }),
      };
    }

    const coins = await fetchCoinsFromLCW(CODES);
    if (!coins.length) {
      return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'No coins found in LCW response' }) };
    }

    await upsertCoins(coins);
    return { statusCode: 200, body: JSON.stringify({ ok: true, updated: coins.map(c => c.code) }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: (e as Error).message }) };
  }
};

// OPTIONAL: allow manual triggering in browser if you like:
// Deploying with a schedule (see netlify.toml) means this runs automatically.
