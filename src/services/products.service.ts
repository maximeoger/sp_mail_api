import { Injectable } from '@nestjs/common'
import { Product } from '../interfaces/product.interface'

@Injectable()
export class ProductsService {
  getAll(): Array<Product> {
    return [
      {
        title: 'TOTO',
        reference: '54-65',
        barcode: '1234567890324',
      },
      {
        title: 'TATA',
        reference: '54-65',
        barcode: '1234567890324',
      },
      {
        title: 'Titi',
        reference: '54-65',
        barcode: '1234567890324',
      },
    ]
  }
}
