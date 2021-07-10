import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// const URI = 'mongodb+srv://username:password@host/database?retryWrites=true&w=majority';
const URI = 'mongodb://admin:123456789@localhost:27017/stationerypatchwork?authSource=admin';
// const URI = 'mongodb://localhost/velavanstationery';

@Module({
  imports: [
    MongooseModule.forRoot(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
