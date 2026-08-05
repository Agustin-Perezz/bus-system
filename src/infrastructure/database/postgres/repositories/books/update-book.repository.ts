import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IUpdateBookRepository } from '../../../../../application/use-cases/books/update-book/update-book.repository.interface';
import { Author } from '../../../../../domain/entities/author.entity';
import { Book } from '../../../../../domain/entities/book.entity';
import { AuthorEntity } from '../../entities/author.entity';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class UpdateBookRepository implements IUpdateBookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repository: EntityRepository<BookEntity>,
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: EntityRepository<AuthorEntity>,
  ) {}

  async findById(id: string): Promise<Book | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async save(book: Book): Promise<Book> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(BookEntity, { id: book.id });
      if (!entity) {
        throw new Error('Book not found');
      }
      entity.title = book.title;
      entity.author = book.authorId;
      entity.publicationYear = book.publicationYear;
      entity.genre = book.genre;
      entity.updatedAt = new Date();
      await em.flush();
      return this.toDomain(entity);
    });
  }

  async findAuthorById(id: string): Promise<Author | null> {
    const entity = await this.authorRepository.findOne({ id });
    if (!entity) {
      return null;
    }
    return Author.reconstruct({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toDomain(entity: BookEntity): Book {
    return Book.reconstruct({
      id: entity.id,
      title: entity.title,
      authorId: entity.author,
      isbn: entity.isbn,
      publicationYear: entity.publicationYear,
      genre: entity.genre,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
