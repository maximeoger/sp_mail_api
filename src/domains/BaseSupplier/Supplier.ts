import fs from 'node:fs/promises'
import ImapReader  from '../../ImapReader/ImapReader'
import dayjs, {Dayjs} from 'dayjs'

export interface SupplierData {
	name : string
	email: string
	dest_file_name: string
}

export default abstract class Supplier {
	name: string
	email: string
	date_file_path: string
	imapReader?: ImapReader
	dest_file_name: string
	downloadsDirectory: string = `${process.cwd()}/downloads`
	run_date?: Dayjs

	protected constructor(data: SupplierData) {
		this.name = data.name
		this.email = data.email
		this.date_file_path = `${process.cwd()}/last_runs/${data.dest_file_name}.txt`
		this.dest_file_name = data.dest_file_name
	}

	async init(): Promise<void> {
		this.setImapConnection()
	}

	setImapConnection(): void {
		this.imapReader = new ImapReader()
		this.imapReader!.connect()
	}

	getCurrentDirectory (): string {
		const {downloadsDirectory, dest_file_name} = this
		return `${downloadsDirectory}/${dest_file_name}`
	}

	async readRunDateInFile(path: string) : Promise<string> {
		let date = await fs.readFile(path, { encoding: 'utf-8' })
		if(date === '') throw Error()
		return date
	}

	async writeRunDateInFile(path: string) : Promise<string> {
		let date = dayjs().format('YYYY-MM-DD')
		await fs.writeFile(path, date, {encoding: 'utf-8'})
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
		this.run_date = dayjs(date)
	}
}

