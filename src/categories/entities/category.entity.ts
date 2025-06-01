import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, UpdateDateColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ar_title: string;

      @UpdateDateColumn()
  updated_at: Date;

    @UpdateDateColumn()
    ceated_at: Date;
  @ManyToMany(() => Book, (book) => book.categories)
  books: Book[];
}