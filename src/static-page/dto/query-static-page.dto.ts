import { IsOptional, IsIn, IsBooleanString } from 'class-validator';

export class QueryStaticPageDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsIn(['en', 'ar'])
  lang?: 'en' | 'ar';

  @IsOptional()
  @IsBooleanString()
  is_published?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}