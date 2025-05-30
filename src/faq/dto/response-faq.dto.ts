export class ResponseFaqDto {
  id: number;
  question: string;
  answer: string;
  isPublished: 'active' | 'inactive';
}