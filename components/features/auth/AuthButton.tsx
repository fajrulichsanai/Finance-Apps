import React from 'react';

interface AuthButtonProps {
  type?: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  type = 'button',
  onClick,
  disabled = false,
  variant = 'primary',
  children,
  icon,
}) => {
  const baseClasses = "w-full px-4 py-4 border-none rounded-[50px] text-base font-semibold cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all";
  
  const variantClasses = {
    primary: "bg-[#1a1a6e] text-white hover:bg-[#14146e]",
    secondary: "bg-white border-[1.5px] border-[#e8e8ee] text-[#0d0d2b] hover:bg-[#f8f8fb] hover:border-[#ccc]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
};
