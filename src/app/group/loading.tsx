export default function Loading() {
	return (
		<>
			{/* Header with form skeleton */}
			<header className="p-4">
				<div className="flex items-center gap-2">
					<div className="flex-grow h-10 bg-gray-200 rounded animate-pulse"></div>
					<div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
				</div>
			</header>

			{/* Main content grid */}
			<main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Match History Card */}
				<section className="col-span-2 md:col-span-1 bg-gray-500/40 rounded-lg shadow-lg overflow-hidden flex flex-col h-[40rem]">
					<header className="bg-gray-500/40 px-6 py-4 flex-shrink-0">
						<h2 className="text-lg font-semibold text-white">Match History</h2>
					</header>
					<section className="p-6 flex-1 overflow-y-auto">
						<div className="space-y-4">
							{/* Match skeleton items */}
							{[...Array(3)].map((_, i) => (
								<div key={i} className="border rounded-lg p-4 bg-gray-100">
									{/* Match header skeleton */}
									<div className="flex justify-between text-xs text-gray-600 mb-2">
										<div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
										<div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
									</div>

									{/* Teams grid skeleton */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Your Team */}
										<div className="w-full">
											<div className="h-4 bg-gray-300 rounded animate-pulse w-16 mb-2"></div>
											<div className="space-y-1">
												{[...Array(5)].map((_, j) => (
													<div key={j} className="flex items-center gap-2">
														<div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
														<div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
														<div className="h-3 bg-gray-300 rounded animate-pulse w-8 ml-auto"></div>
													</div>
												))}
											</div>
										</div>

										{/* Enemy Team */}
										<div className="w-full">
											<div className="h-4 bg-gray-300 rounded animate-pulse w-20 mb-2"></div>
											<div className="space-y-1">
												{[...Array(5)].map((_, j) => (
													<div key={j} className="flex items-center gap-2">
														<div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
														<div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
														<div className="h-3 bg-gray-300 rounded animate-pulse w-8 ml-auto"></div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				</section>

				{/* Attendance Tracker Card */}
				<section className="col-span-2 md:col-span-1 bg-gray-500/40 rounded-lg shadow-lg overflow-hidden flex flex-col h-[40rem]">
					<header className="bg-gray-500/40 px-6 py-4 flex-shrink-0">
						<h2 className="text-lg font-semibold text-white">Attendance Tracker</h2>
					</header>
					<section className="p-6 flex-1 overflow-y-auto">
						<div className="overflow-x-auto">
							<div className="border-collapse w-full text-sm">
								{/* Table header skeleton */}
								<div className="bg-gray-100 border-b">
									<div className="flex">
										{[...Array(4)].map((_, i) => (
											<div key={i} className="flex-1 border-r px-2 py-1 last:border-r-0">
												<div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
											</div>
										))}
									</div>
								</div>
								{/* Table rows skeleton */}
								{[...Array(5)].map((_, i) => (
									<div key={i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
										<div className="flex">
											{[...Array(4)].map((_, j) => (
												<div key={j} className="flex-1 border-r px-2 py-1 last:border-r-0">
													<div className="h-3 bg-gray-300 rounded animate-pulse w-8"></div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				</section>

				{/* KDA Ranking Card */}
				<section className="col-span-2 md:col-span-1 bg-gray-500/40 rounded-lg shadow-lg overflow-hidden flex flex-col h-[40rem]">
					<header className="bg-gray-500/40 px-6 py-4 flex-shrink-0">
						<h2 className="text-lg font-semibold text-white">KDA Ranking</h2>
					</header>
					<section className="p-6 flex-1 overflow-y-auto">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Ranking cards skeleton */}
							{[...Array(6)].map((_, i) => (
								<div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
									<div className="h-4 bg-gray-300 rounded animate-pulse w-20 mb-2"></div>
									<div className="space-y-1">
										{[...Array(3)].map((_, j) => (
											<div key={j} className="flex justify-between text-xs">
												<div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
												<div className="h-3 bg-gray-300 rounded animate-pulse w-8"></div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</section>
				</section>

				{/* Damage Ranking Card */}
				<section className="col-span-2 md:col-span-1 bg-gray-500/40 rounded-lg shadow-lg overflow-hidden flex flex-col h-[40rem]">
					<header className="bg-gray-500/40 px-6 py-4 flex-shrink-0">
						<h2 className="text-lg font-semibold text-white">Damage Ranking</h2>
					</header>
					<section className="p-6 flex-1 overflow-y-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Damage ranking cards skeleton */}
							{[...Array(4)].map((_, i) => (
								<div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
									<div className="h-4 bg-gray-300 rounded animate-pulse w-24 mb-2"></div>
									<div className="space-y-1">
										{[...Array(3)].map((_, j) => (
											<div key={j} className="flex justify-between text-xs">
												<div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
												<div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</section>
				</section>
			</main>
		</>
	);
}
