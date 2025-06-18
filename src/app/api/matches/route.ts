import { Match } from '@/types';
import { NextResponse } from 'next/server';

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to chunk array into smaller arrays
const chunk = <T>(array: T[], size: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
};

export async function POST(req: Request) {
	try {
		const { puuids } = await req.json();

		// Get match IDs for each PUUID
		const matchIdsPromises = puuids.map(async (puuid: string) => {
			const res = await fetch(
				`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`,
				{ headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } },
			);
			return res.json();
		});

		const matchIdsArrays = await Promise.all(matchIdsPromises);
		const uniqueMatchIds = [...new Set(matchIdsArrays.flat())];

		// Process match details in chunks of 10 with 1 second delay between chunks
		const matchDetails: Match[] = [];
		const chunks = chunk(uniqueMatchIds, 10);

		for (const chunk of chunks) {
			const chunkPromises = chunk.map(async id => {
				const res = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${id}`, {
					headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! },
				});
				return res.json();
			});

			const chunkResults = await Promise.all(chunkPromises);
			matchDetails.push(...chunkResults);

			// Add delay between chunks (except for the last chunk)
			if (chunk !== chunks[chunks.length - 1]) {
				await delay(1000); // 1 second delay
			}
		}

		return NextResponse.json(matchDetails);
	} catch (error) {
		console.error('Error fetching matches:', error);
		return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
	}
}
