import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { puuids } = await req.json();

  const matchIdsByUser = await Promise.all(puuids.map(async (puuid: string) => {
    const res = await fetch(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`,
      { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } }
    );
    return res.json();
  }));

  const uniqueMatchIds = Array.from(new Set(matchIdsByUser.flat()));
  const matchDetails = await Promise.all(uniqueMatchIds.map(async (id) => {
    const res = await fetch(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${id}`,
      { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } }
    );
    return res.json();
  }));

  return NextResponse.json(matchDetails);
}
