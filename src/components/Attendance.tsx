'use client';

import React from 'react';

type AttendanceProps = {
	puuids: string[];
	matches: any[];
	accounts: any[];
};

export default function Attendance({ puuids, matches, accounts }: AttendanceProps) {
	if (!matches?.length) return null;

	// Create a map from puuid to riotId for display
	const puuidToRiotId = accounts.reduce((acc, account) => {
		acc[account.puuid] = `${account.gameName}#${account.tagLine}`;
		return acc;
	}, {} as Record<string, string>);

	// Build a map of attendance: player → array of booleans
	const attendance: Record<string, boolean[]> = {};
	puuids.forEach(id => (attendance[id] = []));

	const rows = matches.map(match => {
		const playersInMatch = match.info.participants.map((p: any) => p.puuid);

		puuids.forEach(id => {
			attendance[id].push(playersInMatch.includes(id));
		});

		return playersInMatch;
	});

	// For each player, compute attendance total
	const totals = puuids.map(id => attendance[id].filter(present => present).length);

	return (
		<div className="overflow-x-auto text-gray-600">
			<table className="table-auto border-collapse w-full text-sm">
				<thead>
					<tr className="bg-gray-100">
						<th className="border px-2 py-1 text-left whitespace-nowrap">Match #</th>
						{puuids.map(id => (
							<th key={id} className="border px-2 py-1 text-center">
								{puuidToRiotId[id] || id}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((players, i) => (
						<tr key={i} className="odd:bg-white even:bg-gray-50">
							<td className="border px-2 py-1 text-center">#{matches.length - i}</td>
							{puuids.map(id => {
								const present = players.includes(id);
								return (
									<td
										key={id}
										className={`border px-2 py-1 text-center font-medium ${
											present ? 'text-green-600' : 'text-gray-400'
										}`}
									>
										{present ? '✅' : '—'}
									</td>
								);
							})}
						</tr>
					))}
					<tr className="bg-gray-200 font-semibold">
						<td className="border px-2 py-1 text-right">Total</td>
						{totals.map((count, i) => (
							<td key={i} className="border px-2 py-1 text-center">
								{count}
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
}
