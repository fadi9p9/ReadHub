import { PartialType } from '@nestjs/mapped-types';
import { CreateReplyDto } from './create-replay.dto';

export class UpdateReplayDto extends PartialType(CreateReplyDto) {}
