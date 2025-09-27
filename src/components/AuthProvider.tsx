/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { validatePassword } from '@/utils/passwordValidation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize security monitoring
  useSecurityMonitoring();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check for login blocks/delays
    const loginBlocked = localStorage.getItem('loginBlocked');
    const loginDelay = localStorage.getItem('loginDelay');
    
    if (loginBlocked && Date.now() < parseInt(loginBlocked)) {
      return { error: 'Too many failed attempts. Please try again later.' };
    }
    
    if (loginDelay && Date.now() < parseInt(loginDelay)) {
      const waitTime = Math.ceil((parseInt(loginDelay) - Date.now()) / 1000);
      return { error: `Please wait ${waitTime} seconds before trying again.` };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // After successful login, check if user needs admin profile creation
      if (data.user) {
        const { data: adminCheck } = await supabase
          .from('admin_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single();

        // If no admin profile exists, try to create one
        if (!adminCheck) {
          const { data: createResult } = await supabase.rpc('create_admin_for_authenticated_user');
          
          // Enhanced security monitoring with notification system
          if (createResult && typeof createResult === 'object' && 'success' in createResult) {
            if (createResult.success) {
              console.log('Admin profile created successfully');
              
              // Send security notification for admin creation
              try {
                await supabase.functions.invoke('admin-security-notification', {
                  body: {
                    event_type: 'ADMIN_CREATED',
                    user_id: data.user.id,
                    user_email: data.user.email,
                    event_details: {
                      login_method: 'password',
                      user_agent: navigator.userAgent,
                      timestamp: new Date().toISOString()
                    },
                    timestamp: new Date().toISOString()
                  }
                });
              } catch (notificationError) {
                console.warn('Failed to send admin creation notification:', notificationError);
              }
            } else if ('error' in createResult && createResult.error) {
              console.warn('Admin creation blocked:', createResult.error);
              
              // Send security notification for blocked admin creation
              try {
                await supabase.functions.invoke('admin-security-notification', {
                  body: {
                    event_type: 'ADMIN_CREATION_BLOCKED',
                    user_id: data.user.id,
                    user_email: data.user.email,
                    event_details: {
                      reason: createResult.error,
                      user_agent: navigator.userAgent,
                      timestamp: new Date().toISOString()
                    },
                    timestamp: new Date().toISOString()
                  }
                });
              } catch (notificationError) {
                console.warn('Failed to send security notification:', notificationError);
              }
            }
          }
        }
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred during sign in.' };
    }
  };


  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};