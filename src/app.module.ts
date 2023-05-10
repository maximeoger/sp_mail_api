import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ProductsController } from './controllers/products.controller'
import { AppService } from './app.service'
import { ProductsService } from './services/products.service'

@Module({
  imports: [],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
