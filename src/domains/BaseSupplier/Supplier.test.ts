import Imap from 'imap'
import dayjs from 'dayjs'
import fs from 'node:fs/promises'
import Supplier, { SupplierData } from './Supplier'
import exp from "constants";
import {writeEmailFile} from "../../imap";

jest.mock('imap', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: () => {}
    }
  })
})

jest.mock('node:fs/promises', () => {
  return {
    open: jest.fn(),
  }
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

  beforeAll(async () => {
    await fs.open(`${process.cwd()}`)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should have set imap connection after initialization', () => {
    baseSupplier.init()
    expect(Imap).toHaveBeenCalledTimes(1)
  })

  it.only('readRunDateInFile Should read date from file', async () => {
    baseSupplier.readRunDateInFile = jest.fn().mockResolvedValue('2023-04-30')
    await baseSupplier.readRunDateInFile('path/to/file')
    expect(fs.open).toHaveBeenCalledWith('path/to/file', 'r')
  })
})