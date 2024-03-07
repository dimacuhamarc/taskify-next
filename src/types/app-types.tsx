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

export const initialCategory: UserCategories = {
  id: 0,
  title: '',
  subtitle: '',
  user_id: 0
};
export interface UserTasks {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  category_id?: number;
}