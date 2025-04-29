import { PartialType } from '@nestjs/mapped-types';
import { CreateBookQuestionDto } from './create-book-question.dto';

export class UpdateBookQuestionDto extends PartialType(CreateBookQuestionDto) {}
