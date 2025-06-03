import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorProfileDto } from './create-author-profile.dto';

export class UpdateAuthorProfileDto extends PartialType(CreateAuthorProfileDto) {}
