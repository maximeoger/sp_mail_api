import fs from 'node:fs/promises'
import Imap from 'imap'
import imapReader  from '../imap'
import dayjs from "dayjs";

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
	downloadsDirectory: string = `${process.cwd()}/downloads`
	currentRunDirectory?: string
	currentRunDate?: string

	protected constructor(data: SupplierData) {
		this.name = data.name
		this.email = data.email
		this.last_run = data.last_run
		this.dest_file_name = data.dest_file_name
	}

	setCurrentRunDate(): void {
		this.currentRunDate = dayjs().format('DD-MM-YYYY')
	}

	// Lancé à chaque run : créé un dossier à la date du run au format DD-MM-YYYY
	async createDestFile(): Promise<void> {
		const canRun = this.downloadsDirectory && this.dest_file_name && this.currentRunDate

		if(!canRun) {
			throw Error('Missing download directory, destination file name of current run date.')
		}

		let dirPath = `${this.downloadsDirectory}/${this.dest_file_name}/${this.currentRunDate}`

		await fs.mkdir(dirPath, { recursive: true })

		this.currentRunDirectory = dirPath
	}

	// Initialise le Supplier /!\ ne se lance qu'une fois au début du serveur
	async init(): Promise<void> {
		this.setImapConnection()
	}

	setImapConnection(): void {
		this.imapConnection = imapReader({
			user: process.env.MAILBOX_USER || "",
			password: process.env.MAILBOX_PWD || "",
			host: process.env.IMAP_HOST || "",
			port: Number(process.env.IMAP_PORT),
			tls: true
		})
	}

	// méthode générique pour tous les fournisseurs car la nomenclature des dossiers de reception est la meme
	async getProductsFromDownloads(): Promise<void> {
		try {
			const productsFromNewsLetter : Array<any> = await fs.readdir(`${this.downloadsDirectory}/${this.dest_file_name}`)

			const output = productsFromNewsLetter.map((file, i) => {
				return file
			})
			console.log(output)

		} catch (err) {
			console.log(err)
			throw Error('erreur :(')
		}

	}
}

