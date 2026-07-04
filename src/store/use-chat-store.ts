import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, Message } from '@/types';

interface ChatState {
  currentChatId: string | null;
  chats: Chat[];
  isLoading: boolean;
  setCurrentChatId: (id: string | null) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (id: string, updates: Partial<Chat>) => void;
  deleteChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateLastMessage: (chatId: string, content: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      currentChatId: null,
      chats: [],
      isLoading: false,
      setCurrentChatId: (id) => set({ currentChatId: id }),
      setChats: (chats) => set({ chats }),
      addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
      updateChat: (id, updates) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id ? { ...chat, ...updates } : chat
          ),
        })),
      deleteChat: (id) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== id),
          currentChatId: state.currentChatId === id ? null : state.currentChatId,
        })),
      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat
          ),
        })),
      updateLastMessage: (chatId, content) =>
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              const messages = [...chat.messages];
              if (messages.length > 0) {
                messages[messages.length - 1] = {
                  ...messages[messages.length - 1],
                  content: content,
                };
              }
              return { ...chat, messages };
            }
            return chat;
          }),
        })),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'chat-storage',
    }
  )
);
