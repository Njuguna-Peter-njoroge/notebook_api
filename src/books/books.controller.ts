/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';

import { Books } from 'src/Interfaces/books.interface';
import { createBooksDto } from 'src/DTOS/create_books.dtos';
import { updateBooksDto } from 'src/DTOS/update_books.dtos';
import { BooksService } from './books.service';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: createBooksDto): Promise<ApiResponse<Books>> {
    try {
      const book = await this.booksService.create(data);
      return {
        success: true,
        message: 'Book added successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add a book',
        error: error.message,
      };
    }
  }

  @Get()
  async findAll(): Promise<ApiResponse<Books[]>> {
    try {
      const books = await this.booksService.findAll();
      return {
        success: true,
        message: `${books.length} book(s) retrieved successfully`,
        data: books,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve books',
        error: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Books>> {
    try {
      const book = await this.booksService.findOne(id);
      return {
        success: true,
        message: 'Book found',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Book not found',
        error: error.message,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: updateBooksDto,
  ): Promise<ApiResponse<Books>> {
    try {
      const updatedBook = await this.booksService.update(id, data);
      return {
        success: true,
        message: 'Book info updated successfully',
        data: updatedBook,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update book info',
        error: error.message,
      };
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    try {
      const result = await this.booksService.remove(id);
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to remove book',
        error: error.message,
      };
    }
  }
}
