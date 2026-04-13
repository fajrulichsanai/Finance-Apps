'use client';

import React from 'react';
import { useRegister } from '@/hooks/useRegister';
import { AuthLogo } from '@/components/features/auth/AuthLogo';
import { RegisterHero } from '@/components/features/auth/RegisterHero';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { SecurityFooter } from '@/components/features/auth/SecurityFooter';

export default function RegisterPage() {
  const {
    formData,
    updateField,
    error,
    success,
    isLoading,
    handleEmailRegister,
    handleGoogleRegister,
  } = useRegister();

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f5ee 60%, #dff0e8 100%)' }}
    >
      <div className="w-full max-w-[390px]">
        <AuthLogo />
        <RegisterHero />
        <RegisterForm
          name={formData.name}
          email={formData.email}
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          agreedToTerms={formData.agreedToTerms}
          onNameChange={(value) => updateField('name', value)}
          onEmailChange={(value) => updateField('email', value)}
          onPasswordChange={(value) => updateField('password', value)}
          onConfirmPasswordChange={(value) => updateField('confirmPassword', value)}
          onTermsChange={(value) => updateField('agreedToTerms', value)}
          error={error}
          success={success}
          isLoading={isLoading}
          onEmailRegister={handleEmailRegister}
          onGoogleRegister={handleGoogleRegister}
        />
        <SecurityFooter />
      </div>
    </div>
  );
}
