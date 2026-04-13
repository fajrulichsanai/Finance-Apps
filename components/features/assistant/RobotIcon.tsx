import React from 'react';

interface RobotIconProps {
  className?: string;
  size?: number;
}

export default function RobotIcon({ className = '', size = 22 }: RobotIconProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="white" 
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <rect x="4" y="8" width="16" height="12" rx="3"/>
      <rect x="9" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/>
      <rect x="12.5" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/>
      <rect x="9.5" y="15" width="5" height="1.5" rx=".75" fill="#12205e"/>
      <rect x="11" y="5" width="2" height="3" rx="1"/>
      <circle cx="12" cy="4.5" r="1.5"/>
      <rect x="2" y="11" width="2" height="5" rx="1"/>
      <rect x="20" y="11" width="2" height="5" rx="1"/>
    </svg>
  );
}
