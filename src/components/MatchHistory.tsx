'use client';

import React from 'react';

type Match = any;

type MatchHistoryProps = {
	matches: Match[];
	puuids: string[];
};

const formatDuration = (seconds: number) => {
	const min = Math.floor(seconds / 60);
	const sec = seconds % 60;
	return `${min}:${sec.toString().padStart(2, '0')}`;
};

const formatDate = (epochMs: number) =>
	new Date(epochMs).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

const CHAMPION_IMG_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion';

export default function MatchHistory({ matches, puuids }: MatchHistoryProps) {
	if (!matches?.length) return null;

	return (
		<div className="space-y-4 w-full">
			{matches.map(match => {
				const {
					info: { participants, gameCreation, gameDuration, teams },
					metadata: { matchId },
				} = match;

				const myParticipant = participants.find((p: any) => puuids.includes(p.puuid)) ?? participants[0];

				const myTeamId = myParticipant.teamId;
				const myTeamWon = teams.find((t: any) => t.teamId === myTeamId)?.win;

				const teamMy = participants.filter((p: any) => p.teamId === myTeamId);
				const teamEnemy = participants.filter((p: any) => p.teamId !== myTeamId);

				const renderRow = (p: any) => (
					<tr key={p.puuid} className="text-sm">
						<td className="flex items-center gap-2 pr-2 py-1">
							<img
								src={`${CHAMPION_IMG_BASE}/${p.championName}.png`}
								alt={p.championName}
								title={p.championName}
								className="w-6 h-6 rounded"
							/>
							<span>
								{p.riotIdGameName}#{p.riotIdTagline}
							</span>
						</td>
						<td>
							{p.kills}/{p.deaths}/{p.assists}
						</td>
					</tr>
				);

				return (
					<div
						key={matchId}
						className={`border rounded-lg p-4 ${
							myTeamWon ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
						}`}
					>
						<header className="flex justify-between text-xs text-gray-600 mb-2">
							<span>{formatDate(gameCreation)}</span>
							<span>Duration {formatDuration(gameDuration)}</span>
						</header>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 overflow-x-auto">
							{/* Your Team */}
							<table className="w-full min-w-0">
								<thead>
									<tr className="text-left text-xs uppercase">
										<th colSpan={2}>Your Team</th>
									</tr>
								</thead>
								<tbody>{teamMy.map(renderRow)}</tbody>
							</table>

							{/* Enemy Team */}
							<table className="w-full min-w-0">
								<thead>
									<tr className="text-left text-xs uppercase">
										<th colSpan={2}>Enemy Team</th>
									</tr>
								</thead>
								<tbody>{teamEnemy.map(renderRow)}</tbody>
							</table>
						</div>
					</div>
				);
			})}
		</div>
	);
}
