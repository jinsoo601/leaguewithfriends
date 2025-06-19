import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import MatchHistory from '@/components/MatchHistory';
import Attendance from '@/components/Attendance';
import KDARanking from '@/components/KDARanking';
import DamageRanking from '@/components/DamageRanking';
import { Account, Match } from '@/types';
import { predefinedGroups, getGroupSlug, getGroupFromSlug } from '@/config/predefined-groups';

interface GroupPageProps {
	params: Promise<{ slug: string }>;
}

// Pre-generate pages for predefined groups
export async function generateStaticParams() {
	return predefinedGroups.map(group => ({
		slug: getGroupSlug(group.riotIds),
	}));
}

export default async function GroupPage({ params }: GroupPageProps) {
	const { slug } = await params;

	// Try to find the group in predefined groups first
	let riotIds: string[] = [];
	let groupName = 'Custom Group';

	const predefinedGroup = predefinedGroups.find(group => getGroupSlug(group.riotIds) === slug);
	if (predefinedGroup) {
		riotIds = predefinedGroup.riotIds;
		groupName = predefinedGroup.name;
	} else {
		// Try to parse as custom group
		try {
			riotIds = getGroupFromSlug(slug);
		} catch (error) {
			notFound();
		}
	}

	if (riotIds.length === 0) {
		notFound();
	}

	const host = (await headers()).get('host') || 'localhost:3000';
	const protocol = host.startsWith('localhost') ? 'http' : 'https';
	const baseURL = `${protocol}://${host}`;

	// 🔁 Convert each "gameName#tagLine" into a PUUID via /api/account
	const accounts = await Promise.all(
		riotIds.map(async riotId => {
			const [gameName, tagLine] = riotId.split('#');
			if (!gameName || !tagLine) return null;

			const res = await fetch(`${baseURL}/api/account`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ gameName, tagLine }),
				cache: 'no-store',
			});

			if (!res.ok) return null;
			return res.json();
		}),
	);

	const validAccounts = accounts.filter(Boolean);
	const puuids = validAccounts.map((acc: Account) => acc.puuid);

	if (puuids.length === 0) {
		return <p className="p-4 text-red-600">Failed to retrieve any valid PUUIDs.</p>;
	}

	// 📦 Fetch match data for all PUUIDs
	const matchesRes = await fetch(`${baseURL}/api/matches`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ puuids }),
		cache: 'no-store',
	});

	if (!matchesRes.ok) {
		return <p className="p-4 text-red-600">Error fetching match data: {matchesRes.statusText}</p>;
	}

	const matches = (await matchesRes.json()).filter((m: Match) => m.info && m.metadata);

	return (
		<>
			<header className="p-4">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold text-gray-800">{groupName}</h1>
					<a href="/group" className="text-blue-500 hover:text-blue-700">
						Create New Group
					</a>
				</div>
				<form action="/group" method="GET" className="flex items-center gap-2">
					<label htmlFor="riotIds" className="sr-only">
						Enter Riot IDs
					</label>
					<input
						id="riotIds"
						name="riotIds"
						className="border p-2 flex-grow"
						type="text"
						placeholder="e.g. Player1#TAG1, Player2#TAG2"
						defaultValue={riotIds.join(', ')}
					/>
					<button className="bg-blue-500 text-white px-4 py-2" type="submit">
						Update Group
					</button>
				</form>
			</header>
			<main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
				<section className="col-span-2 md:col-span-1 bg-gray-500/40 rounded-lg shadow-lg overflow-hidden flex flex-col h-[40rem]">
					<header className="bg-gray-500/40 px-6 py-4 flex-shrink-0">
						<h2 className="text-lg font-semibold text-white">Match History (Last {matches.length} matches)</h2>
					</header>
					<section className="p-6 flex-1 overflow-y-auto">
						<MatchHistory matches={matches} puuids={puuids} />
					</section>
				</section>
				<section className="col-span-2 md:col-span-1 bg-gray-500/40 rounded-lg shadow-lg overflow-hidden flex flex-col h-[40rem]">
					<header className="bg-gray-500/40 px-6 py-4 flex-shrink-0">
						<h2 className="text-lg font-semibold text-white">Attendance Tracker</h2>
					</header>
					<section className="p-6 flex-1 overflow-y-auto">
						<Attendance matches={matches} puuids={puuids} accounts={validAccounts} />
					</section>
				</section>
				<section className="col-span-2 md:col-span-1 bg-gray-500/40 rounded-lg shadow-lg overflow-hidden flex flex-col h-[40rem]">
					<header className="bg-gray-500/40 px-6 py-4 flex-shrink-0">
						<h2 className="text-lg font-semibold text-white">KDA Ranking</h2>
					</header>
					<section className="p-6 flex-1 overflow-y-auto">
						<KDARanking matches={matches} puuids={puuids} />
					</section>
				</section>
				<section className="col-span-2 md:col-span-1 bg-gray-500/40 rounded-lg shadow-lg overflow-hidden flex flex-col h-[40rem]">
					<header className="bg-gray-500/40 px-6 py-4 flex-shrink-0">
						<h2 className="text-lg font-semibold text-white">Damage Ranking</h2>
					</header>
					<section className="p-6 flex-1 overflow-y-auto">
						<DamageRanking matches={matches} puuids={puuids} />
					</section>
				</section>
			</main>
		</>
	);
}
