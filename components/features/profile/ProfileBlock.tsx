import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileBadge from './ProfileBadge';

interface ProfileBlockProps {
  displayName: string;
  email: string;
}

export default function ProfileBlock({ displayName, email }: ProfileBlockProps) {
  return (
    <div className="pb-5 animate-fade-up">
      <div className="flex items-start gap-4">
        <ProfileAvatar />
        
        <div className="flex-1 pt-1">
          <h2 className="text-[26px] font-black text-gray-900 dark:text-gray-100 mb-1 leading-tight transition-colors">
            {displayName}
          </h2>
          
          <p className="text-[13px] text-gray-400 dark:text-gray-500 font-medium mb-3 transition-colors">
            {email}
          </p>
          
          <div className="flex gap-2 flex-wrap">
            <ProfileBadge variant="elite">Elite Member</ProfileBadge>
            <ProfileBadge variant="sync">Security Sync</ProfileBadge>
          </div>
        </div>
      </div>
    </div>
  );
}
