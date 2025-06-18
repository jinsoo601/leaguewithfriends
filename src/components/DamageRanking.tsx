'use client';

import React from 'react';
import { Match } from '@/types';

type DamageRankingProps = {
	matches: Match[];
	puuids: string[];
};

type StatBlock = {
	puuid: string;
	name: string;
	damageDone: number;
	damageTaken: number;
	games: number;
};

export default function DamageRanking({ matches, puuids }: DamageRankingProps) {
	if (!matches?.length) return null;

	const stats: Record<string, StatBlock> = {};

	puuids.forEach(id => {
		stats[id] = {
			puuid: id,
			name: id.slice(0, 8) + '…',
			damageDone: 0,
			damageTaken: 0,
			games: 0,
		};
	});

	matches.forEach(match => {
		match.info.participants.forEach(p => {
			if (!stats[p.puuid]) return;
			const s = stats[p.puuid];
			s.damageDone += p.totalDamageDealtToChampions;
			s.damageTaken += p.totalDamageTaken;
			s.games += 1;
			s.name = `${p.riotIdGameName}#${p.riotIdTagline}`;
		});
	});

	const toArray = () => Object.values(stats);

	const rank = (metric: (s: StatBlock) => number, desc: boolean = true) =>
		[...toArray()].sort((a, b) => (desc ? metric(b) - metric(a) : metric(a) - metric(b)));

	const ddpg = (s: StatBlock) => s.damageDone / s.games || 0;
	const dtpg = (s: StatBlock) => s.damageTaken / s.games || 0;

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
			case 'Total Damage Done':
				return (s: StatBlock) => s.damageDone;
			case 'Total Damage Taken':
				return (s: StatBlock) => s.damageTaken;
			case 'Damage Done / Game':
				return ddpg;
			case 'Damage Taken / Game':
				return dtpg;
			default:
				return ddpg;
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
			<Card title="Total Damage Done" items={rank(s => s.damageDone)} fmt={v => v.toLocaleString()} />
			<Card title="Damage Done / Game" items={rank(ddpg)} fmt={v => Math.round(v).toLocaleString()} />
			<Card title="Total Damage Taken" items={rank(s => s.damageTaken)} fmt={v => v.toLocaleString()} />
			<Card title="Damage Taken / Game" items={rank(dtpg)} fmt={v => Math.round(v).toLocaleString()} />
		</div>
	);
}
