import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class AuthorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'text', nullable: true })
  bio_ar: string;

  @Column({ type: 'text', nullable: true })
  bio_en: string;

  @Column({ type: 'text', nullable: true })
  works_ar: string;

  @Column({ type: 'text', nullable: true })
  works_en: string;
}
