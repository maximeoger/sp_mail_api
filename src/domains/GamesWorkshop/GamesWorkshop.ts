import fs from 'node:fs/promises'
import Supplier, { SupplierData } from '../BaseSupplier/Supplier'
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
    let currentPath = this.getCurrentDirectory()
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

    // télécharge les produits dedans
    return new Promise(() => {})
  }

  async run() : Promise<void> {
    await this.defineDateForCurrentRun()
    let { imapReader, email, run_date, name } = this
    await imapReader?.openMailBox()
    let currentDirectory = this.getCurrentDirectory()

    let isNewMessages = await imapReader!.getSupplierMessagesFromImap(
      email!,
      run_date!,
      name!,
      currentDirectory
    )

    if(isNewMessages) {
      // continue
      console.log('Nouveaux messages, création des dossiers')
    } else {
      // Return 204 no-content
      console.log('Pas de nouveau messages')
    }
    /*
    await this.createDestFile()
    await this.downloadProductsFromEmail("2457")
    */
  }
}