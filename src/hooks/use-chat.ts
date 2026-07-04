import { useState, useCallback } from 'react';
import { useChatStore } from '@/store/use-chat-store';
import { Message, Role } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useChat = () => {
  const {
    currentChatId,
    chats,
    addMessage,
    updateLastMessage,
    setIsLoading,
    addChat,
    setCurrentChatId
  } = useChatStore();

  const sendMessage = useCallback(async (content: string, model: string = 'google/diffusiongemma-26b-a4b-it') => {
    let chatId = currentChatId;

    if (!chatId) {
      chatId = uuidv4();
      addChat({
        id: chatId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        model,
        messages: [],
        isPinned: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      createdAt: new Date(),
    };

    addMessage(chatId, userMessage);
    setIsLoading(true);

    try {
      const currentChat = useChatStore.getState().chats.find(c => c.id === chatId);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: currentChat?.messages.map(m => ({ role: m.role, content: m.content })),
            model
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };
      addMessage(chatId, assistantMessage);

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = '';
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') break;
              try {
                const data = JSON.parse(dataStr);
                const delta = data.choices[0]?.delta?.content || '';
                accumulatedContent += delta;
                updateLastMessage(chatId, accumulatedContent);
              } catch (e) {}
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentChatId, addChat, addMessage, setCurrentChatId, updateLastMessage, setIsLoading]);

  return {
    sendMessage,
    currentChat: chats.find(c => c.id === currentChatId),
    isLoading: useChatStore(state => state.isLoading),
  };
};
