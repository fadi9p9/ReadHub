export class TokenResponseDto {
  access_token: string;
  refresh_token?: string; 
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    img?: string;
  };
}