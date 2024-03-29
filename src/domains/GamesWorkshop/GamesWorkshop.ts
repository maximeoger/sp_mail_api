import Supplier, { SupplierData } from '../BaseSupplier/Supplier'

export default class GW extends Supplier {

  constructor(data: SupplierData) {
    super(data);
  }

  async run() : Promise<void> {
    await this.defineDateForCurrentRun()
    let { imapReader, email, run_date, name } = this
    await imapReader?.openMailBox()
    let currentDirectory = this.getCurrentDirectory()

    await imapReader!.getSupplierMessagesFromImap(
      email!,
      run_date!,
      name!,
      currentDirectory
    )
  }
}