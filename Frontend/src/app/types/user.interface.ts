export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt?: Date;
  lastLogin?: Date | null;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  email?: string;
  role?: 'Admin' | 'User' | 'Viewer';
  status?: 'Active' | 'Inactive' | 'Pending';
} 