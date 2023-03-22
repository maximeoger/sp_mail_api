import { getLastWeeksDate } from "./utils";

export type Supplier = {
	name: String
	sender_email: String,
	last_fetch_messages: Date,
	keywords: {
		excluded: Array<String>,
		included: Array<String>
	}
}

export const games_workshop : Supplier = {
	name: 'Games Workshop',
	sender_email: 'info@info.games-workshop.com',
	last_fetch_messages: getLastWeeksDate(), // todo: à remplacer par une donnée en dur à la fin du run
	keywords: {
		excluded: [
			'Mise à jour',
			'service commercial',
			'Informations relatives',
			'departement commercial',
			'Formulaire de Retour',
			'déménage',
			'votre commande',
			'jeu organisé',
			'rappel du produit',
			'produit',
		],
		included: [
			'warhammer',
			'warhammer 40.000',
			'40,000',
			'40000',
			'warhammer Age of Sigmar',
			'age of sigmar',
			'tomes de battaille',
			'warcry',
			'necromunda',
			'battleforces',
			'codex',
			'citadel',
			'hérésie',
			'horus',
			'blood bowl'
		],
	}
}