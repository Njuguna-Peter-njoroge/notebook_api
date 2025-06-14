/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Books } from 'src/Interfaces/books.interface';
import { createBooksDto } from 'src/DTOS/create_books.dtos';
import { updateBooksDto } from 'src/DTOS/update_books.dtos';
import { DatabaseService } from 'src/DATABASES/connection.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class BooksService {
  delete(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly databaseService: DatabaseService) {}

  // Create
  async create(createBooksDto: createBooksDto): Promise<Books> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.databaseService.query(
        `SELECT * FROM sp_create_book($1, $2, $3, $4, $5)`,
        [
          createBooksDto.title,
          createBooksDto.content,
          createBooksDto.createdAt,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('Failed to create a book');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result.rows[0];
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException(
          `Book with title ${createBooksDto.title} already exists`,
        );
      }
      console.error('Database error:', error);
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  // Find all books
  async findAll(): Promise<Books[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.databaseService.query(
        `SELECT * FROM sp_get_book()`,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw new InternalServerErrorException('Failed to fetch books');
    }
  }

  // Find one book by ID
  async findOne(id: number): Promise<Books> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.databaseService.query(
        `SELECT * FROM sp_get_book_by_id($1)`,
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw new InternalServerErrorException('Failed to fetch book');
    }
  }

  // Update
  async update(id: number, updateBooksDto: updateBooksDto): Promise<Books> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.databaseService.query(
        `SELECT * FROM sp_update_books($1, $2, $3, $4, $5, $6)`,
        [
          id,
          updateBooksDto.title,
          updateBooksDto.content,
          updateBooksDto.createdAt,
        ],
      );
      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found for update`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw new InternalServerErrorException('Failed to update book');
    }
  }

  // Delete
  async remove(id: number): Promise<{ message: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.databaseService.query(
        `SELECT * FROM sp_delete_books($1)`,
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(
          `Book with ID ${id} not found for deletion`,
        );
      }

      return { message: `Book with ID ${id} deleted successfully` };
    } catch (error) {
      console.error('Database error:', error);
      throw new InternalServerErrorException('Failed to delete book');
    }
  }
}
