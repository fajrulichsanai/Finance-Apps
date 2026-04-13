import React from 'react';
import { Bell } from 'lucide-react';
import RobotIcon from './RobotIcon';

export default function AssistantHeader() {
  return (
    <div className="bg-slate-50 px-5 py-2 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-[#12205e] rounded-xl flex items-center justify-center">
          <RobotIcon size={22} />
        </div>
        <h1 className="font-nunito text-xl font-extrabold text-slate-900">
          AI Assistant
        </h1>
      </div>
      
      <button className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow transition-shadow">
        <Bell size={18} className="text-slate-900" />
      </button>
    </div>
  );
}
