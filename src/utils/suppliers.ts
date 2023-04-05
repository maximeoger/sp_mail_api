import Imap from 'imap'
import imapReader  from '../imap'

export interface SupplierData {
	name : string
	email: string
	last_run: string
	dest_file_name: string
	excluded_keywords?: Array<string>
	included_keywords?: Array<string>
}

export default abstract class Supplier {
	name: string
	email: string
	last_run: string
	dest_file_name: string
	excluded_keywords?: Array<string>
	included_keywords?: Array<string>
	imapConnection?: Imap

	protected constructor(data: SupplierData) {
		this.name = data.name
		this.email = data.email
		this.last_run = data.last_run
		this.dest_file_name = data.dest_file_name
	}

	init(): void {
		// TODO: Faire venir ces données d'un backend externe
		this.excluded_keywords = [
			'Mise à jour',
			'service commercial',
			'Informations relatives',
			'departement commercial',
			'Formulaire de Retour',
			'déménage',
			'votre commande',
			'jeu organisé',
			'rappel du produit',
			'produit'
		]
		this.included_keywords = [
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
		]
		this.setImapConnection()
	}

	setImapConnection() : void {
		this.imapConnection = imapReader({
			user: process.env.MAILBOX_USER || "",
			password: process.env.MAILBOX_PWD || "",
			host: process.env.IMAP_HOST || "",
			port: Number(process.env.IMAP_PORT),
			tls: true
		})
	}
}

