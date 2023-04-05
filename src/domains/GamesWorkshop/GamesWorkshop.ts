import Supplier, { SupplierData } from '../../utils/suppliers'
import { getSupplierMessages } from '../../imap'

export default class GW extends Supplier {
  constructor(data: SupplierData) {
    super(data);
  }

  async getProductsFromNewsLetter () : Promise<any> {
    let products: any[] = await getSupplierMessages(this.imapConnection!, this.email, this.last_run, this.name, this.dest_file_name)
  }
}