import request from 'superagent'
import fs from 'node:fs/promises'
import admZip from 'adm-zip'

async function unZip (fileDirectory: string, fileName: string) {
  const zip = new admZip(`${fileDirectory}/${fileName}`)
  zip.extractAllToAsync(fileDirectory, true, true, (error) => {})
  await fs.rm(`${fileDirectory}/${fileName}`)
}

export async function downloadFileAndUnzip (url: string, seqno: number, destFileName: string): Promise<void> {

  const destPath = `${destFileName}/${seqno}`
  await fs.mkdir(destPath, { recursive: true })

  const fileHandle = await fs.open(`${destPath}/products.zip`, 'w')

  await request
    .get(url)
    .on('error', (error) => {
      console.warn(error)
      throw error
    })
    .pipe(fileHandle.createWriteStream())
    .on('finish', async () => {
      console.log(`Download completed. File stored at ${destPath}/products.zip`)
      // Todo: Envoyer le fichier ZIP sur un bucket S3
      try {
        await unZip(destPath,`products.zip`)
      } catch(error) {
        console.error(`Error unziping file ${seqno}`)
      }
    })
}
