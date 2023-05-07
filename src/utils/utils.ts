import request from 'superagent'
import fs from 'node:fs/promises'
import admZip from 'adm-zip'

async function unZip (fileDirectory: string, fileName: string) {
  const zip = new admZip(`${fileDirectory}/${fileName}`)
  await zip.extractAllToAsync(fileDirectory)
}

export async function downloadFileAndUnzip (url: string, destFileName: string): Promise<void> {

  const path = `${destFileName}/products.zip`
  const fileHandle = await fs.open(path, 'w')

  return new Promise((fulfill, reject) => {
    request
      .get(url)
      .on('error', (error) => {
        console.warn(error)
        reject(error)
      })
      .pipe(fileHandle.createWriteStream())
      .on('finish', async () => {
        console.log(`Download completed. File stored at ${path}`)
        // Todo: Envoyer le fichier ZIP sur un bucket S3
        await unZip(destFileName,`products.zip`)
        await fs.rm(path)
        fulfill()
      })
  })
}
