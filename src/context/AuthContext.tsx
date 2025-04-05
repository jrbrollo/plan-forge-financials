import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type Planner = Database['public']['Tables']['planners']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  planner: Planner | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: Partial<Planner>) => Promise<{ error: Error | null }>;
  updatePassword: (token: string, newPassword: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [planner, setPlanner] = useState<Planner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar sessão atual quando o componente montar
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao buscar sessão:", error);
      }

      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchPlanner(data.session.user.id);
      }

      setIsLoading(false);
    };

    fetchSession();

    // Configurar ouvinte para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);
      
      setSession(newSession);
      setUser(newSession?.user || null);

      if (newSession?.user) {
        await fetchPlanner(newSession.user.id);
      } else {
        setPlanner(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Buscar dados do planejador
  const fetchPlanner = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('planners')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Erro ao buscar dados do planejador:", error);
        return;
      }

      setPlanner(data);
    } catch (error) {
      console.error("Erro ao buscar dados do planejador:", error);
    }
  };

  // Fazer login
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error) {
        navigate('/clients');
      }

      setIsLoading(false);
      return { error };
    } catch (e) {
      setIsLoading(false);
      return { error: e as AuthError };
    }
  };

  // Criar conta
  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (!error && data.user) {
        // Criar perfil de planejador
        const { error: profileError } = await supabase
          .from('planners')
          .insert({
            id: data.user.id,
            email,
            name
          });

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
        } else {
          navigate('/login?verification=true');
        }
      }

      setIsLoading(false);
      return { error };
    } catch (e) {
      setIsLoading(false);
      return { error: e as AuthError };
    }
  };

  // Fazer logout
  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
    navigate('/login');
  };

  // Resetar senha
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setIsLoading(false);
      return { error };
    } catch (e) {
      setIsLoading(false);
      return { error: e as AuthError };
    }
  };

  // Atualizar perfil
  const updateProfile = async (data: Partial<Planner>) => {
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from('planners')
        .update(data)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Atualizar estado local
      setPlanner(prev => prev ? { ...prev, ...data } : null);

      return { error: null };
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return { error: error as Error };
    }
  };

  // Atualizar senha com token (para redefinição de senha)
  const updatePassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      setIsLoading(false);
      return { error };
    } catch (e) {
      setIsLoading(false);
      return { error: e as AuthError };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        planner,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}; 