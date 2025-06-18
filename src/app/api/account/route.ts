// /app/api/account/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { gameName, tagLine } = await req.json();

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: 'Missing gameName or tagLine in request body' },
      { status: 400 }
    );
  }

  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;

  const res = await fetch(url, {
    headers: {
      'X-Riot-Token': process.env.RIOT_API_KEY!,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status });
  }

  return NextResponse.json(data);
}
