'use client';

import React from 'react';
import {
  AssistantHeader,
  ChatMessage,
  SpendingAnomalyCard,
  QuickReplies,
  ChatInput,
} from '@/components/features/assistant';
import {
  INITIAL_MESSAGES,
  MOCK_SPENDING_ANOMALY,
  AI_FOLLOW_UP_MESSAGE,
  QUICK_REPLY_SUGGESTIONS,
} from '@/lib/constants/assistant';
import { useAssistantChat } from '@/hooks/useAssistantChat';

export default function AssistantPage() {
  const { messages, inputValue, setInputValue, sendMessage, handleQuickReply } = 
    useAssistantChat(INITIAL_MESSAGES);

  return (
    <div className="font-dm-sans bg-slate-50 min-h-screen flex flex-col">
      {/* Header */}
      <AssistantHeader />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 pb-2 flex flex-col gap-3 scrollbar-hide">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Spending Anomaly Card (shown after AI explains) */}
        <SpendingAnomalyCard data={MOCK_SPENDING_ANOMALY} />
        
        {/* Follow-up Message */}
        <div className="flex flex-col animate-fade-up">
          <div className="bg-white rounded-[4px_18px_18px_18px] px-4 py-3.5 text-[13.5px] leading-relaxed text-gray-700 shadow-md max-w-[90%]">
            {AI_FOLLOW_UP_MESSAGE}
          </div>
        </div>
      </div>

      {/* Quick Replies */}
      <QuickReplies 
        suggestions={QUICK_REPLY_SUGGESTIONS} 
        onSelect={handleQuickReply} 
      />

      {/* Input Bar */}
      <ChatInput 
        value={inputValue}
        onChange={setInputValue}
        onSend={sendMessage}
      />
    </div>
  );
}