import { PartialType } from '@nestjs/mapped-types';
import { CreatePendingBookDto } from './create-pending-book.dto';

export class UpdatePendingBookDto extends PartialType(CreatePendingBookDto) {}
