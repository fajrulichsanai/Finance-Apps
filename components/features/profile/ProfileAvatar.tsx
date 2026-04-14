import React from 'react';
import { Edit } from 'lucide-react';

export default function ProfileAvatar() {
  return (
    <div className="relative w-[88px] h-[88px] mb-3.5">
      <div className="w-[88px] h-[88px] rounded-[20px] bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="60%" r="60%">
              <stop offset="0%" stopColor="#2e4499"/>
              <stop offset="100%" stopColor="#1a2f7a"/>
            </radialGradient>
          </defs>
          <rect width="80" height="80" rx="18" fill="url(#bgGrad)"/>
          <path d="M20 80 Q20 58 40 54 Q60 58 60 80Z" fill="#1e3a8a"/>
          <path d="M35 54 L40 58 L45 54 L43 68 L40 72 L37 68Z" fill="white" opacity="0.9"/>
          <path d="M40 58 L38 65 L40 69 L42 65Z" fill="#e63946"/>
          <rect x="35" y="46" width="10" height="10" rx="4" fill="#f5c5a3"/>
          <ellipse cx="40" cy="36" rx="14" ry="16" fill="#f5c5a3"/>
          <path d="M26 32 Q27 18 40 18 Q53 18 54 32 Q52 22 40 22 Q28 22 26 32Z" fill="#2c1a0e"/>
          <path d="M26 30 Q25 36 27 40 Q26 34 26 30Z" fill="#2c1a0e"/>
          <path d="M54 30 Q55 36 53 40 Q54 34 54 30Z" fill="#2c1a0e"/>
          <ellipse cx="34" cy="36" rx="2.5" ry="2.8" fill="white"/>
          <ellipse cx="46" cy="36" rx="2.5" ry="2.8" fill="white"/>
          <circle cx="34.5" cy="36.5" r="1.5" fill="#1a1a2e"/>
          <circle cx="46.5" cy="36.5" r="1.5" fill="#1a1a2e"/>
          <circle cx="35" cy="36" r="0.5" fill="white"/>
          <circle cx="47" cy="36" r="0.5" fill="white"/>
          <path d="M31 32 Q34 30 37 32" stroke="#2c1a0e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M43 32 Q46 30 49 32" stroke="#2c1a0e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M39 38 Q40 41 41 38" stroke="#e0a882" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M35 44 Q40 48 45 44" stroke="#c97a5a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="26" cy="37" rx="2.5" ry="3" fill="#f5c5a3"/>
          <ellipse cx="54" cy="37" rx="2.5" ry="3" fill="#f5c5a3"/>
        </svg>
      </div>
      <button 
        className="absolute -bottom-1 -right-1 w-[26px] h-[26px] rounded-full bg-blue-900 border-[2.5px] border-gray-50 flex items-center justify-center hover:bg-blue-800 transition-colors"
        aria-label="Edit profile picture"
      >
        <Edit className="w-3 h-3 text-white" strokeWidth={2.5} />
      </button>
    </div>
  );
}
