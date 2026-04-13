'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useRegister } from '@/hooks/useRegister';
import { AuthLogo } from '@/components/features/auth/AuthLogo';
import { RegisterHero } from '@/components/features/auth/RegisterHero';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { SecurityFooter } from '@/components/features/auth/SecurityFooter';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    formData,
    updateField,
    error,
    success,
    isLoading,
    handleEmailRegister,
    handleGoogleRegister,
  } = useRegister();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a1a6e] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b6b80] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render register form if user is logged in
  if (user) {
    return null;
  }

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
