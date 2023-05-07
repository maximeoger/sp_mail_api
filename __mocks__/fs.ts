const fs : any = jest.genMockFromModule('node:fs/promises')
const path = require('path')

let mockFiles = Object.create(null)

function __createMockFiles(newMockFiles : any) {
  mockFiles = Object.create(null)

  for (const file in newMockFiles) {
    const dir = path.dirname(file)
    if(!mockFiles[dir]) {
      mockFiles[dir] = []
    }

    mockFiles[dir].push(path.basename(file))
    mockFiles[dir][path.basename(file)] = newMockFiles[file]
  }
}

function exists(pathToDirectory: string) {
  return mockFiles[pathToDirectory]
}

fs.exists = exists
fs.__createMockFiles = __createMockFiles

export default fs