import fs from 'node:fs/promises'
import Imap from 'imap'
import imapReader  from '../../imap'
import dayjs, { Dayjs } from "dayjs";

export interface SupplierData {
	name : string
	email: string
	dest_file_name: string
	excluded_keywords?: Array<string>
	included_keywords?: Array<string>
}

export default abstract class Supplier {
	name: string
	email: string
	lastRunDate: Dayjs
	dest_file_name: string
	excluded_keywords?: Array<string>
	included_keywords?: Array<string>
	imapConnection?: Imap
	downloadsDirectory: string = `${process.cwd()}/downloads`
	currentRunDirectory?: string
	currentRunDate?: Dayjs

	protected constructor(data: SupplierData) {
		this.name = data.name
		this.email = data.email
		this.dest_file_name = data.dest_file_name
		this.lastRunDate = dayjs()
	}

	getCurrentDateFormatted(format: string) : string {
		if(!this.currentRunDate) throw Error(`There is no current date for supplier ${this.name}`)
		return this.currentRunDate.format(format)
	}

	getLastRunDateFormatted(format: string) : string {
		if(!this.lastRunDate) throw Error(`There is no last run date for supplier ${this.name}`)
		return this.lastRunDate.format(format)
	}

	async getLastRunDateFromFile(): Promise<void> {
		let lastRunDate = await fs.readFile(`${process.cwd()}/last_runs/${this.dest_file_name}.txt`, { encoding: 'utf8' })
		this.lastRunDate = dayjs(lastRunDate)
	}

	setCurrentRunDate(): void {
		this.currentRunDate = dayjs()
	}

	async saveRunDate(): Promise<void> {
		await fs.writeFile(`${process.cwd()}/last_runs/${this.dest_file_name}.txt`, this.getCurrentDateFormatted('YYYY-MM-DD'))
	}

	// Lancé à chaque run : créé un dossier à la date du run au format DD-MM-YYYY
	async createDestFile(): Promise<void> {
		const canRun = this.downloadsDirectory && this.dest_file_name && this.currentRunDate

		if(!canRun) {
			throw Error('Missing download directory, destination file name of current run date.')
		}

		let dirPath = `${this.downloadsDirectory}/${this.dest_file_name}/${this.getCurrentDateFormatted('YYYY-MM-DD')}`

		await fs.mkdir(dirPath, { recursive: true })

		this.currentRunDirectory = dirPath
	}

	// Initialise le Supplier /!\ ne se lance qu'une fois au début du serveur
	async init(): Promise<void> {
		this.setImapConnection()
	}

	setImapConnection(): void {

		const env = process.env.NODE_ENV!.toUpperCase()

		const {
			[`MAILBOX_USER_${env}`] : mailBoxUser,
			[`MAILBOX_PWD_${env}`] : mailBoxPwd,
			[`IMAP_HOST_${env}`] : imapHost,
			[`IMAP_PORT_${env}`] : imapPort
		} = process.env

		this.imapConnection = imapReader({
			user: mailBoxUser || "",
			password: mailBoxPwd || "",
			host: imapHost || "",
			port: Number(imapPort),
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

