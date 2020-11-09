import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { m1CreditSaleSchema } from './model/m1-credit-sale-schema';
// import { m1CashSaleSchema } from './model/m1-cash-sale.schema';
import { saleSchema } from './model/sale.schema';

// const URI = 'mongodb+srv://username:password@host/database?retryWrites=true&w=majority';
// const URI = 'mongodb://localhost/vs-patchwork';
const URI = 'mongodb://localhost/velavanstationery';

@Module({
  imports: [
    MongooseModule.forRoot(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    // MongooseModule.forFeature([
    //   { name: 'M1CreditSale', schema: m1CreditSaleSchema },
    // ]),
    // MongooseModule.forFeature([
    //   { name: 'M1CashSale', schema: m1CashSaleSchema },
    // ]),
    MongooseModule.forFeature([
      { name: 'Sale', schema: saleSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
