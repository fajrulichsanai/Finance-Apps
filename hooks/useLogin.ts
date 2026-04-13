import { useState, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const submitInProgress = useRef(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitInProgress.current || isLoading) {
      console.log('⚠️ Submit already in progress, ignoring');
      return;
    }
    
    submitInProgress.current = true;
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        submitInProgress.current = false;
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  const handleGoogleLogin = async () => {
    if (submitInProgress.current || isLoading) {
      return;
    }
    
    submitInProgress.current = true;
    setError('');
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign in error:', err);
      setError('Failed to initiate Google sign in');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleEmailLogin,
    handleGoogleLogin,
  };
};
