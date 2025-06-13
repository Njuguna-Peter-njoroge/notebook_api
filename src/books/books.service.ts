/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Books } from 'src/Interfaces/books.interface'; 
import { createBooksDto } from 'src/DTOS/create_books.dtos'; 
import { updateBooksDto } from 'src/DTOS/update_books.dtos'; 
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class BooksService {
  findByTitle() {
    throw new Error('Method not implemented.');
  }
  delete(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly databaseService: DatabaseService) {}

  // Create
  async create(createBooksDto: createBooksDto): Promise<Books> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.databaseService.query(
        `SELECT * FROM SP_CREATE_BOOKS($1, $2, $3, $4, $5)`,
        [
          createBooksDto.title,
          createBooksDto.content,
          createBooksDto.createdAt,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('Failed to create a book');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return result.rows[0];
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (error.message.includes('already exists')) {
        throw new ConflictException(
          `Book with ISBN ${createBooksDto.isbn} already exists`,
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
        `SELECT * FROM sp_get_all_books()`,
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
          updateBooksDto.author,
          updateBooksDto.published_year,
          updateBooksDto.isbn,
          updateBooksDto.isAvailable,
        ],
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found for update`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
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
