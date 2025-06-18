'use client';

import React from 'react';

type KDARankingProps = {
	matches: any[];
	puuids: string[];
};

type StatBlock = {
	puuid: string;
	name: string;
	kills: number;
	deaths: number;
	assists: number;
	games: number;
};

export default function KDARanking({ matches, puuids }: KDARankingProps) {
	if (!matches?.length) return null;

	const stats: Record<string, StatBlock> = {};

	puuids.forEach(id => {
		stats[id] = {
			puuid: id,
			name: id.slice(0, 8) + '…',
			kills: 0,
			deaths: 0,
			assists: 0,
			games: 0,
		};
	});

	matches.forEach(match => {
		match.info.participants.forEach((p: any) => {
			if (!stats[p.puuid]) return;
			const s = stats[p.puuid];
			s.kills += p.kills;
			s.deaths += p.deaths;
			s.assists += p.assists;
			s.games += 1;
			s.name = `${p.riotIdGameName}#${p.riotIdTagline}`;
		});
	});

	const toArray = () => Object.values(stats);

	const rank = (metric: (s: StatBlock) => number, desc: boolean = true) =>
		[...toArray()].sort((a, b) => (desc ? metric(b) - metric(a) : metric(a) - metric(b)));

	const kpg = (s: StatBlock) => s.kills / s.games || 0;
	const dpg = (s: StatBlock) => s.deaths / s.games || 0;
	const apg = (s: StatBlock) => s.assists / s.games || 0;
	const kdaRatio = (s: StatBlock) => (s.kills + s.assists) / Math.max(1, s.deaths);

	const Card = ({
		title,
		items,
		fmt = (v: number) => v.toFixed(1),
	}: {
		title: string;
		items: StatBlock[];
		fmt?: (v: number) => string;
	}) => (
		<div className="border rounded-lg p-4 shadow-sm bg-white">
			<h3 className="font-semibold mb-2 text-sm">{title}</h3>
			<ol className="space-y-1">
				{items.map((s, idx) => (
					<li key={s.puuid} className="flex justify-between text-xs">
						<span className="truncate">
							{idx + 1}. {s.name}
						</span>
						<span className="font-mono">{fmt(metric(title)(s))}</span>
					</li>
				))}
			</ol>
		</div>
	);

	const metric = (title: string) => {
		switch (title) {
			case 'Total Kills':
				return (s: StatBlock) => s.kills;
			case 'Total Deaths':
				return (s: StatBlock) => s.deaths;
			case 'Total Assists':
				return (s: StatBlock) => s.assists;
			case 'Kills / Game':
				return kpg;
			case 'Deaths / Game':
				return dpg;
			case 'Assists / Game':
				return apg;
			default:
				return kdaRatio;
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
			<Card title="Total Kills" items={rank(s => s.kills)} fmt={v => v.toString()} />
			<Card title="Total Deaths" items={rank(s => s.deaths)} fmt={v => v.toString()} />
			<Card title="Total Assists" items={rank(s => s.assists)} fmt={v => v.toString()} />
			<Card title="Kills / Game" items={rank(kpg)} />
			<Card title="Deaths / Game" items={rank(dpg)} />
			<Card title="Assists / Game" items={rank(apg)} />
			<Card title="KDA Ratio" items={rank(kdaRatio)} />
		</div>
	);
}
