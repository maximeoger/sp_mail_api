import Supplier, { SupplierData } from '../../utils/suppliers'
import {getMailbox, getSupplierMessagesFromImap, writeEmailFile} from '../../imap'

export default class GW extends Supplier {

  constructor(data: SupplierData) {
    super(data);
    // TODO: Faire venir ces données d'un backend externe
    this.excluded_keywords = [
      'Mise à jour',
      'service commercial',
      'Informations relatives',
      'departement commercial',
      'Formulaire de Retour',
      'déménage',
      'votre commande',
      'jeu organisé',
      'rappel du produit',
      'produit'
    ]
    this.included_keywords = [
      'warhammer',
      'warhammer 40.000',
      '40,000',
      '40000',
      'warhammer Age of Sigmar',
      'age of sigmar',
      'tomes de battaille',
      'warcry',
      'necromunda',
      'battleforces',
      'codex',
      'citadel',
      'hérésie',
      'horus',
      'blood bowl'
    ]
  }

  private async getProductsFromNewsLetter() : Promise<any> {
    let messageStream = await getSupplierMessagesFromImap( // TODO: déplacer ça dans une classe dédiée ?
      this.imapConnection!,
      this.email,
      this.last_run,
      this.name,
    )

    await writeEmailFile(messageStream, this.currentRunDirectory!) // TODO: déplacer ça dans une classe dédiée ?
  }

  async run() : Promise<void> {
    this.setCurrentRunDate()

    try {
      await this.createDestFile()
      const mailBox = await getMailbox(this.imapConnection!) // TODO: déplacer ça dans une classe dédiée ?
      const messages = await this.getProductsFromNewsLetter()

    } catch (error) {
      console.log(error)
    }

  }
}