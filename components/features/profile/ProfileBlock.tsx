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
      <ProfileAvatar />
      
      <h2 className="text-[26px] font-black text-gray-900 mb-1">
        {displayName}
      </h2>
      
      <p className="text-[13px] text-gray-400 font-medium mb-3">
        {email}
      </p>
      
      <div className="flex gap-2 flex-wrap">
        <ProfileBadge variant="elite">Elite Member</ProfileBadge>
        <ProfileBadge variant="sync">Secure Sync Active</ProfileBadge>
      </div>
    </div>
  );
}
