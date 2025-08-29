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
  cart?: { 
    id: number;
    status: string;
    created_at: Date;
    items: {
      id: number;
      quantity: number;
      book: {
        id: number;
        title: string;
        price: number;
      } | null;
    }[];
  } | null;
}