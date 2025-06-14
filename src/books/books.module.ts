import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseService } from 'src/DATABASES/connection.service';

@Module({
  providers: [DatabaseService, BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
