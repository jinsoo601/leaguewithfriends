export const predefinedGroups = [
	{
		name: 'Main Squad',
		riotIds: ['hinadad#na1', 'ikarugo#na1', 'dontaskdontsee#na1', 'cny1#na1', 'hungryhugsy#na1'],
	},
];

export function getGroupSlug(riotIds: string[]): string {
	const encodedIds = riotIds.map(id => encodeURIComponent(id));
	return encodedIds.join(',');
}

export function getGroupFromSlug(slug: string): string[] {
	return slug
		.split(',')
		.map(id => decodeURIComponent(id))[0]
		.split(',');
}
