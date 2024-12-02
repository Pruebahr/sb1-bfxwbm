export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface Profile {
  id: string;
  username: string;
  password: string;
  createdBy: string;
  createdAt: Date;
}