import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { m1CreditSaleSchema } from './model/m1-credit-sale-schema';

const URI = 'mongodb+srv://username:password@host/database?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    MongooseModule.forFeature([{name:'M1CreditSale', schema: m1CreditSaleSchema}])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
