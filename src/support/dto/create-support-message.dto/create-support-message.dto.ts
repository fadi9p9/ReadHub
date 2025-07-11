export class CreateSupportMessageDto {
  userId: number;
  from: 'user' | 'admin';
  message: string;
}