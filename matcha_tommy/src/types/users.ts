export type User = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  gender: string;
  sexual_preference: string;
  is_verified: boolean;
};