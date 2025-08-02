import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import { EventType } from '@azure/msal-browser';

export const useAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Handle redirect promise first
        await instance.handleRedirectPromise();
        
        const currentAccounts = instance.getAllAccounts();
        
        if (currentAccounts.length > 0) {
          const account = currentAccounts[0];
          setIsAuthenticated(true);
          setUser(account);
          instance.setActiveAccount(account);
          console.log('User authenticated:', account.username);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    // Set up event listeners for MSAL events
    const callbackId = instance.addEventCallback((event) => {
      console.log('MSAL Event:', event.eventType, event);
      
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const account = (event.payload as any).account;
        setIsAuthenticated(true);
        setUser(account);
        instance.setActiveAccount(account);
        setError(null);
        console.log('Login success:', account.username);
      }
      
      if (event.eventType === EventType.LOGIN_FAILURE && event.error) {
        console.error('Login failed:', event.error);
        setError(event.error.message);
        setIsLoading(false);
      }
      
      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        setIsAuthenticated(false);
        setUser(null);
        setError(null);
      }
    });

    checkAuth();

    // Cleanup event listener
    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we're already in the middle of a login flow
      if (inProgress === 'login') {
        console.log('Login already in progress');
        return;
      }
      
      console.log('Starting login redirect...');
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    isAuthenticated,
    isLoading: isLoading || inProgress !== 'none',
    user,
    error,
    login,
    logout
  };
};