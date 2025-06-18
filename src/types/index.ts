export type Participant = {
	puuid: string;
	riotIdGameName: string;
	riotIdTagline: string;
	championName: string;
	kills: number;
	deaths: number;
	assists: number;
	totalDamageDealtToChampions: number;
	totalDamageTaken: number;
	teamId: number;
};

export type Team = {
	teamId: number;
	win: boolean;
};

export type Match = {
	info: {
		participants: Array<Participant>;
		gameCreation: number;
		gameDuration: number;
		teams: Array<Team>;
	};
	metadata: {
		matchId: string;
	};
};

export type Account = {
	puuid: string;
	gameName: string;
	tagLine: string;
};
