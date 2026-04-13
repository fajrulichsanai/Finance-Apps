import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/lib/constants/assistant';

export function useAssistantChat(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // TODO: Replace with actual API call to AI service
    console.log('Sending message:', newMessage.content);
  }, [inputValue]);

  const handleQuickReply = useCallback((suggestion: string) => {
    setInputValue(suggestion);
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    handleQuickReply,
  };
}
