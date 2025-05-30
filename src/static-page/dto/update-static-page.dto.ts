import { PartialType } from '@nestjs/mapped-types';
import { CreateStaticPageDto } from './create-static-page.dto';

export class UpdateStaticPageDto extends PartialType(CreateStaticPageDto) {
  en_title?: string;
  en_content?: string;
  ar_title?: string;
  ar_content?: string;
  url?: string;
  is_published?: boolean;
}
