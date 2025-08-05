"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  emailConfirmed: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  emailConfirmed: false,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  useEffect(() => {
    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setEmailConfirmed(!!session?.user?.email_confirmed_at);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email_confirmed_at);
        
        setSession(session);
        setUser(session?.user ?? null);
        setEmailConfirmed(!!session?.user?.email_confirmed_at);
        setLoading(false);

        // Verificar eventos específicos
        if (event === 'SIGNED_UP' && !session) {
          toast.info('Verifique seu e-mail para confirmar a conta!');
        }
        
        if (event === 'SIGNED_IN' && session?.user && !session.user.email_confirmed_at) {
          toast.error('Por favor, confirme seu e-mail antes de continuar.');
          await supabase.auth.signOut();
        }

        if (event === 'TOKEN_REFRESHED' && session?.user?.email_confirmed_at) {
          toast.success('E-mail confirmado com sucesso!');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setEmailConfirmed(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, emailConfirmed, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}