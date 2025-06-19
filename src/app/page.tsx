import { predefinedGroups, getGroupSlug } from '@/config/predefined-groups';

export default function Home() {
	return (
		<main className="p-4 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold text-center mb-8">League with Friends</h1>

			{/* Custom group form */}
			<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
				<h2 className="text-xl font-semibold mb-4">Create Custom Group</h2>
				<form action="/group" method="GET">
					<label htmlFor="riotIds" className="block text-sm font-medium text-gray-700 mb-2">
						Enter Riot IDs (comma-separated, format: name#tag)
					</label>
					<input
						id="riotIds"
						name="riotIds"
						className="border border-gray-300 rounded-md p-3 w-full mb-4"
						type="text"
						placeholder="e.g. Player1#TAG1, Player2#TAG2"
					/>
					<button
						className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
						type="submit"
					>
						View Group Stats
					</button>
				</form>
			</div>

			{/* Predefined groups */}
			<div className="bg-white rounded-lg shadow-lg p-6">
				<h2 className="text-xl font-semibold mb-4">Predefined Groups</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{predefinedGroups.map(group => (
						<a
							key={group.name}
							href={`/group/${getGroupSlug(group.riotIds)}`}
							className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
						>
							<h3 className="font-semibold text-lg mb-2">{group.name}</h3>
							<p className="text-sm text-gray-600 mb-3">{group.riotIds.length} players</p>
							<div className="text-xs text-gray-500">
								{group.riotIds.slice(0, 3).join(', ')}
								{group.riotIds.length > 3 && ` +${group.riotIds.length - 3} more`}
							</div>
						</a>
					))}
				</div>
			</div>
		</main>
	);
}
