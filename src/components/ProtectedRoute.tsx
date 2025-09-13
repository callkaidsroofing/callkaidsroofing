import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
      return;
    }

    if (user) {
      // Check if user is admin
      supabase.rpc('is_admin_user', { user_id: user.id })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error checking admin status:', error);
            navigate('/admin/login');
            return;
          }
          
          if (!data) {
            navigate('/admin/login');
            return;
          }
          
          setIsAdmin(data);
        });
    }
  }, [user, loading, navigate]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};