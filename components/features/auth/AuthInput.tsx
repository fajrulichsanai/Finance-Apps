import React from 'react';

interface AuthInputProps {
  id: string;
  label: string;
  type: 'email' | 'password' | 'text';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  actionButton,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label 
          htmlFor={id} 
          className="text-[11px] font-semibold text-[#9999aa] tracking-[0.8px] uppercase"
        >
          {label}
        </label>
        {actionButton && (
          <button 
            type="button" 
            onClick={actionButton.onClick}
            className="text-[11px] font-bold text-[#1a1a6e] tracking-[0.3px] hover:underline"
          >
            {actionButton.label}
          </button>
        )}
      </div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-[18px] py-3.5 border-none rounded-xl bg-[#f2f2f5] text-sm text-[#0d0d2b] placeholder-[#b0b0c0] outline-none focus:bg-[#eaeaf0] transition-colors"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};
