import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizWinnerDto } from './create-quiz-winner.dto';

export class UpdateQuizWinnerDto extends PartialType(CreateQuizWinnerDto) {}
