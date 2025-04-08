
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@/lib/types';
import { getClientById, getClientsByPlannerId, saveClient, deleteClient } from '@/services/clientSupabaseService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { createFinancialPlanFromClient } from "@/services/financialService";
import { calculateTotalInvestments, createInvestmentsFromClient } from "@/services/investmentService";

interface ClientContextType {
  clients: Client[];
  currentClient: Client | null;
  setCurrentClient: (client: Client | null) => void;
  addClient: (client: Client) => Promise<Client>;
  updateClient: (client: Client) => Promise<Client>;
  removeClient: (clientId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshClients: () => Promise<void>;
  getFinancialData: (client: Client) => any;
  loadClientById: (clientId: string) => Promise<void>; // Add this to make loadClient accessible
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { clientId } = useParams<{ clientId?: string }>();
  const navigate = useNavigate();
  const { planner, user } = useAuth();
  const { toast } = useToast();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar clientes quando o componente montar ou quando o planejador mudar
  useEffect(() => {
    if (planner?.id) {
      loadClients();
    }
  }, [planner?.id]);

  // Carregar cliente específico se houver um ID na URL
  useEffect(() => {
    if (clientId && planner?.id) {
      loadClientById(clientId);
    }
  }, [clientId, planner?.id]);

  // Função para carregar todos os clientes do planejador atual
  const loadClients = async () => {
    if (!planner?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedClients = await getClientsByPlannerId(planner.id);
      setClients(loadedClients);
      
      // Se não houver cliente atual selecionado e temos clientes carregados
      if (!currentClient && loadedClients.length > 0) {
        // Se temos um clientId na URL, tente encontrar esse cliente
        if (clientId) {
          const client = loadedClients.find(c => c.id === clientId);
          if (client) {
            setCurrentClient(client);
          }
        }
      }
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Não foi possível carregar a lista de clientes.');
      
      toast({
        title: "Erro ao carregar clientes",
        description: "Ocorreu um problema ao buscar os clientes. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para carregar um cliente específico por ID
  const loadClientById = async (id: string) => {
    if (!planner?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const client = await getClientById(id);
      
      if (client) {
        setCurrentClient(client);
      } else {
        setError(`Cliente com ID ${id} não encontrado.`);
        navigate('/clients');
        
        toast({
          title: "Cliente não encontrado",
          description: "O cliente que você está tentando acessar não foi encontrado.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Erro ao carregar cliente:', err);
      setError('Não foi possível carregar os dados do cliente.');
      
      toast({
        title: "Erro ao carregar cliente",
        description: "Ocorreu um problema ao buscar os dados do cliente. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para adicionar um novo cliente
  const addClient = async (client: Client): Promise<Client> => {
    if (!planner?.id) {
      throw new Error("Planejador não autenticado");
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Garantir que o cliente esteja associado ao planejador atual
      const clientToSave = {
        ...client,
        planner_id: planner.id
      };
      
      const savedClient = await saveClient(clientToSave, planner.id);
      
      // Atualizar a lista de clientes
      setClients(prevClients => [...prevClients, savedClient]);
      
      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso."
      });
      
      return savedClient;
    } catch (err) {
      console.error('Erro ao adicionar cliente:', err);
      setError('Não foi possível adicionar o cliente.');
      
      toast({
        title: "Erro ao adicionar cliente",
        description: "Ocorreu um problema ao adicionar o cliente. Tente novamente mais tarde.",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para atualizar um cliente existente
  const updateClient = async (client: Client): Promise<Client> => {
    if (!planner?.id) {
      throw new Error("Planejador não autenticado");
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Garantir que o cliente esteja associado ao planejador atual
      const clientToUpdate = {
        ...client,
        planner_id: planner.id
      };
      
      const updatedClient = await saveClient(clientToUpdate, planner.id);
      
      // Atualizar a lista de clientes
      setClients(prevClients => 
        prevClients.map(c => c.id === updatedClient.id ? updatedClient : c)
      );
      
      // Atualizar o cliente atual se for o mesmo
      if (currentClient && currentClient.id === updatedClient.id) {
        setCurrentClient(updatedClient);
      }
      
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso."
      });
      
      return updatedClient;
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      setError('Não foi possível atualizar os dados do cliente.');
      
      toast({
        title: "Erro ao atualizar cliente",
        description: "Ocorreu um problema ao atualizar os dados do cliente. Tente novamente mais tarde.",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para remover um cliente
  const removeClient = async (clientId: string): Promise<void> => {
    if (!planner?.id) {
      throw new Error("Planejador não autenticado");
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteClient(clientId);
      
      // Remover da lista de clientes
      setClients(prevClients => prevClients.filter(c => c.id !== clientId));
      
      // Se o cliente atual for o que está sendo removido, resetar
      if (currentClient && currentClient.id === clientId) {
        setCurrentClient(null);
      }
      
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso."
      });
    } catch (err) {
      console.error('Erro ao remover cliente:', err);
      setError('Não foi possível remover o cliente.');
      
      toast({
        title: "Erro ao remover cliente",
        description: "Ocorreu um problema ao remover o cliente. Tente novamente mais tarde.",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para recarregar a lista de clientes
  const refreshClients = async (): Promise<void> => {
    if (planner?.id) {
      await loadClients();
    }
  };

  const getFinancialData = (client: Client) => {
    if (!client) return null;
    
    try {
      // Gerar investimentos consistentes com os dados do cliente
      const investments = createInvestmentsFromClient(client);
      
      // Calcular o total real de investimentos (soma dos investimentos gerados)
      const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
      
      // Se o total calculado for diferente do registrado no cliente, atualizar o cliente
      if (client.hasInvestments && totalInvestments !== client.totalInvestments && investments.length > 0) {
        const updatedClient = {
          ...client,
          totalInvestments: totalInvestments
        };
        
        // Não salvamos aqui para evitar loops, apenas atualizamos o contexto
        setCurrentClient(updatedClient);
        client = updatedClient;
      }
      
      const financialPlan = createFinancialPlanFromClient(client);
      
      return { 
        financialPlan,
        totalInvestments,
        investments,
        hasDiversifiedPortfolio: client.hasDiversifiedPortfolio || false
      };
    } catch (error) {
      console.error("Erro ao processar dados financeiros:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar os dados financeiros do cliente.",
        variant: "destructive"
      });
      return null;
    }
  };

  return (
    <ClientContext.Provider 
      value={{
        clients,
        currentClient,
        setCurrentClient,
        addClient,
        updateClient,
        removeClient,
        isLoading,
        error,
        refreshClients,
        getFinancialData,
        loadClientById // Add this to expose the function
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient deve ser usado dentro de um ClientProvider');
  }
  return context;
};
