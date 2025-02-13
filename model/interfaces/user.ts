interface User {
	_id: string;
    pseudo: string;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    birthdate: Date;
    stock: Stock;
    team: Team;
}

interface FightMonster {
	_id: string;
	name: string;
	type: string[];
	stats: {
		hp: number;
		attack: number;
		def: number;
		speed: number;
		stamina: number;
		balance: number;
	};
	image: string;
	passive: string;
	skills: string[];
}

interface Team {
	first: FightMonster,
	second: FightMonster,
	third: FightMonster,
	fourth: FightMonster
}

interface Stock {
	pc: FightMonster[];
}

export { User, Stock, Team}