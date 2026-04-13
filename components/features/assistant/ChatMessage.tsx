import React from 'react';
import RobotIcon from './RobotIcon';
import type { ChatMessage as ChatMessageType } from '@/lib/constants/assistant';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.type === 'ai';

  if (isAI) {
    return (
      <div className="flex flex-col animate-fade-up">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-5 h-5 bg-[#12205e] rounded-full flex items-center justify-center">
            <RobotIcon size={11} />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            STITCH AI
          </span>
        </div>
        <div 
          className="bg-white rounded-[4px_18px_18px_18px] px-4 py-3.5 text-sm leading-relaxed text-gray-700 shadow-md max-w-[90%]"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end animate-fade-up">
      <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
        USER
      </span>
      <div className="bg-[#1a2f7a] text-white rounded-[18px_4px_18px_18px] px-4.5 py-3.5 text-sm leading-relaxed max-w-[82%] shadow-lg shadow-[#1a2f7a]/30">
        {message.content}
      </div>
    </div>
  );
}
