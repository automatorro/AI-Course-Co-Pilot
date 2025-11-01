import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Plan } from '../types';
import { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthStateChange = async (event: AuthChangeEvent, session: Session | null) => {
      setLoading(true);
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // The error 'PGRST116' from Supabase means the profile row doesn't exist yet,
        // which is expected for a brand new user. We'll handle this gracefully
        // by assigning a default 'Trial' plan.
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          setUser(null);
        } else {
           let userPlan = (profile?.plan as Plan) || Plan.Trial;

           // Special override for the admin user to grant unlimited access
           if (session.user.email === 'lucian.cebuc@gmail.com') {
             userPlan = Plan.Admin;
           }

           const fullUser: User = {
            ...session.user,
            plan: userPlan,
          };
          setUser(fullUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    
    // Set initial user
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL_SESSION', session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};