import React from 'react';
import { Star } from 'lucide-react';

export default function ProCard() {
  const handleManageSubscription = () => {
    // TODO: Implement subscription management
    console.log('Manage subscription');
  };

  return (
    <div className="relative bg-blue-900 rounded-[20px] mx-0 mb-4 px-5 py-5.5 overflow-hidden shadow-lg shadow-blue-900/30 animate-fade-up">
      <div className="absolute right-4.5 top-1/2 -translate-y-1/2 text-[80px] text-white/[0.07] leading-none pointer-events-none">
        <Star className="w-20 h-20" />
      </div>
      
      <h3 className="text-[22px] font-black text-white mb-1.5">
        Architect Pro
      </h3>
      
      <p className="text-[13px] text-white/60 mb-4.5 leading-relaxed">
        Unlock predictive analytics<br />and multi-bank integration.
      </p>
      
      <button 
        onClick={handleManageSubscription}
        className="bg-green-500 text-white border-none rounded-full px-6 py-3 text-[13.5px] font-bold shadow-lg shadow-green-500/35 hover:opacity-90 transition-opacity active:opacity-80"
      >
        Manage Subscription
      </button>
    </div>
  );
}
