import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isInspector: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isInspector: false,
    isAdmin: false,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Check roles after session is set
        if (session?.user) {
          setTimeout(async () => {
            await checkUserRoles(session.user.id);
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            isInspector: false,
            isAdmin: false,
            loading: false,
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (session?.user) {
        await checkUserRoles(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoles = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;

      const rolesList = roles?.map(r => r.role) || [];
      
      setAuthState(prev => ({
        ...prev,
        isInspector: rolesList.includes('inspector') || rolesList.includes('admin'),
        isAdmin: rolesList.includes('admin'),
        loading: false,
      }));
    } catch (error) {
      console.error('Error checking user roles:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isInspector: false,
        isAdmin: false,
      });
    }
    return { error };
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
};
