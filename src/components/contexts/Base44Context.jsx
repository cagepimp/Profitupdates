import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const Base44Context = createContext({
  user: null,
  loading: true,
  error: null
});

export function Base44Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setError(null);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('Failed to load user:', err);
        
        // Check if it's a rate limit error
        const isRateLimit = err.message?.includes('429') || err.message?.includes('Rate limit');
        
        if (isRateLimit && retryCount < 3) {
          // Retry with exponential backoff
          const delay = 1000 * Math.pow(2, retryCount);
          console.log(`Rate limit hit, retrying in ${delay}ms...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, delay);
        } else {
          setError(err);
          setLoading(false);
        }
      } finally {
        if (!error || retryCount >= 3) {
          setLoading(false);
        }
      }
    };

    loadUser();
  }, [retryCount]); // Re-run when retryCount changes

  return (
    <Base44Context.Provider value={{ user, loading, error }}>
      {children}
    </Base44Context.Provider>
  );
}

export function useBase44() {
  const context = useContext(Base44Context);
  if (context === undefined) {
    throw new Error('useBase44 must be used within a Base44Provider');
  }
  return context;
}