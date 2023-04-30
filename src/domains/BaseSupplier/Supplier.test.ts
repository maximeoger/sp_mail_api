import Imap from 'imap'
import dayjs from 'dayjs'

import Supplier, { SupplierData } from './Supplier'
import exp from "constants";

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
    dest_file_name: 'dummy',
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should instantiate with dayjs object as lastRunDate', () => {
    baseSupplier.init()
    expect(baseSupplier.lastRunDate).toBeInstanceOf(dayjs)
  })

  it('Should have set imap connection after initialization', () => {
    baseSupplier.init()
    expect(Imap).toHaveBeenCalledTimes(1)
  })


})