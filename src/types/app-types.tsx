export interface UserData {
  id: number;
  email: string;
  name: string;
}

export interface UserCategories {
  id: number;
  title: string;
  subtitle: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}