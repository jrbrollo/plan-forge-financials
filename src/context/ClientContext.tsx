
import React, { createContext, useContext, useState, useEffect } from "react";
import { Client } from "@/lib/types";
import { getClientById, saveClient } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { createFinancialPlanFromClient } from "@/services/financialService";
import { calculateTotalInvestments, createInvestmentsFromClient } from "@/services/investmentService";

interface ClientContextType {
  currentClient: Client | null;
  setCurrentClient: (client: Client | null) => void;
  loadClient: (clientId: string) => Client | null;
  updateClient: (clientData: Client) => void;
  getFinancialData: (client: Client) => any;
}

// Create the context with undefined as the default value
const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Export the ClientContext Provider component
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
      // Garantir coerência dos dados de investimento
      if (clientData.hasInvestments && clientData.totalInvestments === undefined) {
        clientData.totalInvestments = 0;
      }
      
      // Se houver descrição de investimentos mas totalInvestments não estiver definido,
      // extrair o valor total da descrição ou definir um valor padrão
      if (clientData.investmentsDescription && !clientData.totalInvestments) {
        // Tentar extrair valores da descrição
        const regex = /R\$\s*([\d.,]+)/g;
        const matches = [...clientData.investmentsDescription.matchAll(regex)];
        
        if (matches.length > 0) {
          // Somar todos os valores encontrados na descrição
          const total = matches.reduce((sum, match) => {
            const valueStr = match[1].replace('.', '').replace(',', '.');
            return sum + parseFloat(valueStr);
          }, 0);
          
          clientData.totalInvestments = total;
        }
      }
      
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
    <ClientContext.Provider value={{ currentClient, setCurrentClient, loadClient, updateClient, getFinancialData }}>
      {children}
    </ClientContext.Provider>
  );
};

// Export the hook that allows components to access the context
export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
