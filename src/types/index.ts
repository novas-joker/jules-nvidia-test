export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  isPinned: boolean;
  isArchived: boolean;
  folderId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  chats: Chat[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}
