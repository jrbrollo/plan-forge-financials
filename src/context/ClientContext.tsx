
import React, { createContext, useContext, useState, useEffect } from "react";
import { Client } from "@/lib/types";
import { getClientById, saveClient } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { createFinancialPlanFromClient } from "@/services/financialService";

interface ClientContextType {
  currentClient: Client | null;
  setCurrentClient: (client: Client | null) => void;
  loadClient: (clientId: string) => Client | null;
  updateClient: (clientData: Client) => void;
  getFinancialData: (client: Client) => any;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const loadClient = (clientId: string): Client | null => {
    try {
      const client = getClientById(clientId);
      if (client) {
        setCurrentClient(client);
        return client;
      } else {
        toast({
          title: "Cliente não encontrado",
          description: "Não foi possível carregar o cliente solicitado."
        });
        return null;
      }
    } catch (error) {
      console.error("Erro ao carregar cliente:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados do cliente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateClient = (clientData: Client) => {
    try {
      saveClient(clientData);
      setCurrentClient(clientData);
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso."
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar os dados do cliente.",
        variant: "destructive"
      });
    }
  };

  // Função para obter dados financeiros com base em um cliente
  const getFinancialData = (client: Client) => {
    if (!client) return null;
    
    try {
      const financialPlan = createFinancialPlanFromClient(client);
      return { financialPlan };
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
    <ClientContext.Provider value={{ currentClient, setCurrentClient, loadClient, updateClient, getFinancialData }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
