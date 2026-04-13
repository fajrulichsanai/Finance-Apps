import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export const useRegister = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const submitInProgress = useRef(false);

  const updateField = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!formData.agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }

    return true;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitInProgress.current || isLoading) {
      console.log('⚠️ Submit already in progress, ignoring');
      return;
    }
    
    setError('');
    setSuccess(false);
    
    if (!validateForm()) {
      return;
    }

    submitInProgress.current = true;
    setIsLoading(true);

    try {
      const { error } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.name
      );
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        submitInProgress.current = false;
      } else {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  const handleGoogleRegister = async () => {
    if (submitInProgress.current || isLoading) {
      return;
    }
    
    submitInProgress.current = true;
    setError('');
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign up error:', err);
      setError('Failed to initiate Google sign up');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  return {
    formData,
    updateField,
    error,
    success,
    isLoading,
    handleEmailRegister,
    handleGoogleRegister,
  };
};
