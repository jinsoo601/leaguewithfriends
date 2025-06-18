// /app/group/page.tsx
import { headers } from 'next/headers';

interface GroupPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function GroupPage({ searchParams }: GroupPageProps) {
  const riotIdsParam = (await searchParams)?.riotIds ?? '';
  const riotIds =
    typeof riotIdsParam === 'string'
      ? riotIdsParam.split(',').map((id) => id.trim()).filter(Boolean)
      : [];

  if (riotIds.length === 0) {
    return <p className="p-4 text-red-600">No Riot IDs provided.</p>;
  }

  const host = (await headers()).get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseURL = `${protocol}://${host}`;

  // 🔁 Convert each "gameName#tagLine" into a PUUID via /api/account
  const accounts = await Promise.all(
    riotIds.map(async (riotId) => {
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
    })
  );

  const validAccounts = accounts.filter(Boolean);
  const puuids = validAccounts.map((acc: any) => acc.puuid);

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
    return (
      <p className="p-4 text-red-600">
        Error fetching match data: {matchesRes.statusText}
      </p>
    );
  }

  const matches = await matchesRes.json();

  // ✅ Display everything as raw JSON for now
  return (
    <>
    <header className="p-4">
      <form action="/group" method="GET" className="flex items-center gap-2">
        <label htmlFor="riotIds" className="sr-only">Enter Riot IDs</label>
        <input
          id="riotIds"
          name="riotIds"
          className="border p-2 flex-grow"
          type="text"
          placeholder="e.g. Player1#TAG1, Player2#TAG2"
          defaultValue={riotIdsParam}
        />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Update Group
        </button>
      </form>
    </header>
    <main className="p-4">
      <pre className="whitespace-pre-wrap text-sm">
        {JSON.stringify({ accounts: validAccounts, matches: matches.length }, null, 2)}
      </pre>
    </main>
    </>
  );
}
