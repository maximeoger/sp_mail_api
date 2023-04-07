import request from 'superagent'
import dayjs from 'dayjs'
import fs from 'node:fs/promises'
import admZip from 'adm-zip'

async function unZip (fileDirectory: string, fileName: string) {
  const zip = new admZip(`${fileDirectory}/${fileName}.zip`)
  await zip.extractAllToAsync(`${fileDirectory}/${fileName}`)
}

export async function downloadFileAndUnzip (url: string, destFileName: string): Promise<void> {

  const fileDirectory = `${__dirname}/../../downloads/${destFileName}`
  const fileName = `${dayjs().format('DD-MM-YYYY')}`

  const fileHandle = await fs.open(`${fileDirectory}/${fileName}.zip`, 'w')

  return new Promise((fulfill, reject) => {
    request
      .get(url)
      .on('error', (error) => console.warn(error))
      .pipe(fileHandle.createWriteStream())
      .on('finish', async () => {
        console.log(`Download completed. File stored at ${__dirname}/../../${fileName}.zip`)
        // Todo: Envoyer le fichier ZIP sur un bucket S3
        await unZip(fileDirectory, fileName)
        fulfill()
      })
  })
}