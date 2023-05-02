import fs from 'node:fs/promises'
import Supplier, { SupplierData } from './Supplier'
import sinon from 'sinon';
import Mockdate from 'mockdate'
import ImapReader from '../../ImapReader/ImapReader'

jest.mock('imap', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: () => {}
    }
  })
})

class DummySupplier extends Supplier {
  constructor(d: SupplierData) {
    super(d);
  }
}

describe('Base Supplier entity', () => {

  let baseSupplier = new DummySupplier({
    name: 'dummy',
    email: 'dummy@email.com',
    dest_file_name: 'test_supplier',
  })

  let fakeDate = '2023-05-01'

  beforeAll(() => {
    Mockdate.set(fakeDate)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('Should have set imap connection after initialization', () => {
    let ImapReaderStub = sinon.createStubInstance(ImapReader)
    baseSupplier.init()
    expect(ImapReaderStub.connect).toHaveBeenCalled()
  })

  it('readRunDateInFile Should read date from file', async () => {
    let readFileStub = sinon.stub(fs, 'readFile').resolves(fakeDate)
    let date = await baseSupplier.readRunDateInFile('path/to/file')
    expect(readFileStub.called).toBe(true)
    expect(date).toBe(fakeDate)
  })

  it('writeRunDateInFile Should write correct date in file', async () => {
    let writeFileStub = sinon.stub(fs, 'writeFile')
    let date = await baseSupplier.writeRunDateInFile('path/to/file')
    expect(writeFileStub.called).toBe(true)
    expect(writeFileStub.args).toEqual([[ 'path/to/file', fakeDate, { encoding: 'utf-8' }]])
    expect(date).toEqual(fakeDate)
  })

  it('defineDateForCurrentRun Should create date file if not exists and set run_date attribute', async () => {
    let checkFileExistsStub = sinon.stub(baseSupplier, 'checkIfDateFileExists').rejects()
    let writeFileStub = sinon.stub(baseSupplier, 'writeRunDateInFile').resolves(fakeDate)
    await baseSupplier.defineDateForCurrentRun()
    expect(writeFileStub.called).toBe(true)
    expect(checkFileExistsStub.called).toBe(true)
    expect(baseSupplier.run_date).toEqual(fakeDate)
  })

  it('defineDateForCurrentRun Should return date in file if date file exists and set run_date attribute', async () => {
    let checkFileExistsStub = sinon.stub(baseSupplier, 'checkIfDateFileExists').resolves()
    let readDateInFileStub = sinon.stub(baseSupplier, 'readRunDateInFile').resolves(fakeDate)
    await baseSupplier.defineDateForCurrentRun()
    expect(readDateInFileStub.called).toBe(true)
    expect(checkFileExistsStub.called).toBe(true)
    expect(baseSupplier.run_date).toEqual(fakeDate)
  })
})