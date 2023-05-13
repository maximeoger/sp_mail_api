import request from 'superagent'
import fs from 'node:fs/promises'
import admZip from 'adm-zip'
import https from 'https'

async function unZip(fileDirectory: string, fileName: string) {
  const zip = new admZip(`${fileDirectory}/${fileName}`)
  zip.extractAllToAsync(fileDirectory, true, true, (error) => {})
  await fs.rm(`${fileDirectory}/${fileName}`)
}

function waitForEvent<T>(emitter, event): Promise<T> {
  return new Promise((resolve, reject) => {
    emitter.once(event, resolve)
    emitter.once('error', reject)
  })
}

const MIMES_TYPES = {
  'application/zip': '.zip',
  'application/xls': '.xls',
  'application/vnd.ms-excel': '.xls',
}

export async function download(url: string, path: string) {

  await fs.mkdir(path, { recursive: true })

  // from this point, I do not know the MIME type of the response
  const fh = await fs.open(`${path}/file.zip`, 'w')

  request
    .get(url)
    .pipe(fh.createWriteStream())
    .on('error', (error) => console.log(error))
    .on('finish', () => console.log('Download completed'))
}
