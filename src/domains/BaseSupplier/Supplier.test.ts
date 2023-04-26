import Supplier, { SupplierData } from './Supplier'
import Imap from "imap";

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

  it('Should have set imap connection after initialization', () => {
    baseSupplier.init()
    const imap = baseSupplier.imapConnection
    let spy = jest.spyOn(imap, 'connect').mockImplementation()

    expect(imap).toBeInstanceOf(Imap)
  })
})