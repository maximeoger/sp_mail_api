import fs from 'node:fs/promises'
import Supplier, { SupplierData } from '../BaseSupplier/Supplier'
import { getMailbox, getSupplierMessagesFromImap, writeEmailFile } from '../../imap'
import {JSDOM} from "jsdom";

export default class GW extends Supplier {

  constructor(data: SupplierData) {
    super(data);
  }

  private async retreiveDownloadLinkFromParsedEmail(html: string): Promise<string> {
    let { document } = (new JSDOM(html, {contentType: "text/html"})).window
    let aTags = document.getElementsByTagName('a')
    let searchText = "Télécharger"
    let found

    for(var i=0; i<aTags.length; i++){
      if(aTags[i].textContent === searchText) {
        found = aTags[i]
        break
      }
    }

    if(!found) {
      throw ('No download link found for supplier.')
    } else {
      let downloadLink = found.getAttribute('href')
      return downloadLink!
      //await downloadFileAndUnzip(downloadLink!, currentRunDirectory)
    }

  }

  private async downloadProductsFromEmail(mailId: string) : Promise<void> {
    // cree un dossier mailId
    let currentPath = this.currentRunDirectory
    let newPath = `${currentPath}/${mailId}`

    await fs.mkdir(newPath)

    // place le mail dedans
    await fs.rename(`${currentPath}/${mailId}.html`, `${newPath}/mail.html`)

    // recherche la presence du link de download
    let html = ''
    let fileHandle = await fs.open(`${newPath}/mail.html`, 'r')
    let readable = fileHandle.createReadStream()

    readable.on('data', (buffer) => {
      let str = buffer.toString('utf8')
      html += str
    })

    readable.on('error', error => console.log(error))

    readable.on('end', async () => {
      let downloadLink = await this.retreiveDownloadLinkFromParsedEmail(html)
    })

    // telecharge les produits dedans
    return new Promise(() => {})
  }

  async run() : Promise<void> {
    await this.getLastRunDateFromFile()
    this.setCurrentRunDate()
    //await this.saveRunDate()

    await this.createDestFile()
    await getMailbox(this.imapConnection!) // TODO: déplacer ça dans une classe dédiée ?
    await getSupplierMessagesFromImap( // TODO: déplacer ça dans une classe dédiée ?
      this.imapConnection!,
      this.email,
      this.lastRunDate,
      this.name,
      this.currentRunDirectory!
    )
    await this.downloadProductsFromEmail("2457")

  }
}