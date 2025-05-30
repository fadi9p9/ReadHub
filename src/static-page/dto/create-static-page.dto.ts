export class CreateStaticPageDto {
  en_title: string;
  en_content: string;
  ar_title: string;
  ar_content: string;
  url: string;
  is_published?: boolean;
}