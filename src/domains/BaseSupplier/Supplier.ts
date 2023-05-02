import fs from 'node:fs/promises'
import Imap from 'imap'
import ImapReader  from '../../ImapReader/ImapReader'
import dayjs, { Dayjs } from "dayjs";

export interface SupplierData {
	name : string
	email: string
	dest_file_name: string
}

export default abstract class Supplier {
	name: string
	email: string
	date_file_path: string
	excluded_keywords?: Array<string>
	included_keywords?: Array<string>
	imapConnection?: Imap
	downloadsDirectory: string = `${process.cwd()}/downloads`
	run_date?: string

	protected constructor(data: SupplierData) {
		this.name = data.name
		this.email = data.email
		this.date_file_path = `${process.cwd()}/last_runs/${data.dest_file_name}.txt`
	}

	async readRunDateInFile(path: string) : Promise<string> {
		let date = await fs.readFile(path, { encoding: 'utf-8' })
		return date
	}

	async writeRunDateInFile(path: string) : Promise<string> {
		let date = dayjs().format('YYYY-MM-DD')
		await fs.writeFile(path, date, { encoding: 'utf-8' })
		return date
	}

	async checkIfDateFileExists(path: string): Promise<void> {
		await fs.stat(path)
	}

	async defineDateForCurrentRun() : Promise<void> {
		let path = this.date_file_path
		let date = ''
		try {
			await this.checkIfDateFileExists(path)
			// file exists
			date = await this.readRunDateInFile(path)
		} catch (error) {
			// file foes not exists
			date = await this.writeRunDateInFile(path)
		}
		this.run_date = dayjs(date).format('YYYY-MM-DD')
	}


	/*

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

	 */

	// Initialise le Supplier /!\ ne se lance qu'une fois au début du serveur
	async init(): Promise<void> {
		this.setImapConnection()
	}

	setImapConnection(): void {
		this.imapConnection = new ImapReader().connect()
	}

	/*
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

	 */
}

