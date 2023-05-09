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

    let isNewProducts = await imapReader!.getSupplierMessagesFromImap(
      email!,
      run_date!,
      name!,
      currentDirectory
    )

    if(isNewProducts) {
      // continue
      console.log('Response 200 : Ok')
    } else {
      // Return 204 no-content
      console.log('Response 204 : No-Content')
    }
  }
}