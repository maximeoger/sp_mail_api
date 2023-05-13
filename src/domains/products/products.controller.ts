import { Controller, Get } from '@nestjs/common'
import { Product } from './product.interface'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getAll(): Promise<Array<Product>> {
    return new Promise((fulfill) => {
      fulfill(this.productsService.getAll())
    })
  }
}