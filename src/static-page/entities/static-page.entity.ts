import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('static_pages')
export class StaticPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  en_title: string;

  @Column({ type: 'text', nullable: false })
  en_content: string;

  @Column({ nullable: false })
  ar_title: string;

  @Column({ type: 'text', nullable: false })
  ar_content: string;

  @Column({ unique: true, nullable: false })
  url: string;

  @Column({ default: false })
  is_published: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}