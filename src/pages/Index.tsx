
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Layout/Sidebar";
import { ClientOverview } from "@/components/Dashboard/ClientOverview";
import { CashFlowComparison } from "@/components/Dashboard/CashFlowComparison";
import { BudgetSummary } from "@/components/Dashboard/BudgetSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import { getClientById, getClients } from '@/services/clientService';
import { createFinancialPlanFromClient, calculateFinancialHealth } from '@/services/financialService';
import { ClientFinancialSummary } from '@/components/Dashboard/ClientFinancialSummary';
import type { Client, FinancialPlan, FinancialHealth } from '@/lib/types';

const Index = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { currentClient, setCurrentClient, getFinancialData } = useClient();
  const [loading, setLoading] = useState(true);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);
  const [financialHealth, setFinancialHealth] = useState<FinancialHealth | null>(null);
  const [hasClients, setHasClients] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Verificar se há clientes cadastrados
      const clients = getClients();
      setHasClients(clients.length > 0);
      
      let client: Client | null = null;
      
      if (clientId) {
        // Se tiver clientId na URL, carrega os dados desse cliente
        client = getClientById(clientId);
        if (client) {
          setCurrentClient(client);
        } else {
          // Cliente não encontrado
          setFinancialPlan(null);
          setLoading(false);
          return;
        }
      } else if (currentClient) {
        // Se não tiver clientId mas tiver cliente no contexto
        client = currentClient;
      } else if (clients.length > 0) {
        // Se não tiver cliente definido mas existirem clientes, usa o primeiro
        client = clients[0];
        setCurrentClient(client);
      } else {
        // Nenhum cliente
        setFinancialPlan(null);
        setLoading(false);
        return;
      }
      
      if (client) {
        try {
          // Gerar plano financeiro com base nos dados do cliente
          const plan = createFinancialPlanFromClient(client);
          setFinancialPlan(plan);
          
          // Calcular saúde financeira
          const health = calculateFinancialHealth(client, plan);
          setFinancialHealth(health);
        } catch (error) {
          console.error("Erro ao processar dados financeiros:", error);
        }
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [clientId, setCurrentClient, currentClient]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-finance-navy">Dashboard Financeiro</h1>
            <p className="text-gray-600">Visão geral da situação financeira atual e recomendações.</p>
          </div>
          
          {!hasClients ? (
            <Button onClick={() => navigate('/clients')}>
              <Users className="mr-2 h-4 w-4" /> Adicionar Clientes
            </Button>
          ) : !currentClient ? (
            <Button onClick={() => navigate('/clients')}>
              <Users className="mr-2 h-4 w-4" /> Selecionar Cliente
            </Button>
          ) : (
            currentClient && (
              <Button variant="outline" onClick={() => navigate(`/clients/${currentClient.id}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cliente
              </Button>
            )
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando dados financeiros...</p>
          </div>
        ) : !hasClients ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Nenhum cliente cadastrado. Adicione clientes para ver o dashboard.</p>
              <Button onClick={() => navigate('/clients')}>
                <Users className="mr-2 h-4 w-4" /> Cadastrar Clientes
              </Button>
            </CardContent>
          </Card>
        ) : !currentClient || !financialPlan ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Selecione um cliente para visualizar seu dashboard financeiro.</p>
              <Button onClick={() => navigate('/clients')}>
                <Users className="mr-2 h-4 w-4" /> Selecionar Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <ClientOverview client={currentClient} />
            </div>
            
            <div className="mb-6">
              <ClientFinancialSummary 
                client={currentClient} 
                financialPlan={financialPlan} 
                financialHealth={financialHealth} 
              />
            </div>
            
            <div className="mb-6">
              <CashFlowComparison 
                currentCashFlow={financialPlan.currentCashFlow} 
                suggestedCashFlow={financialPlan.suggestedCashFlow} 
              />
            </div>
            
            <div className="mb-6">
              <BudgetSummary
                currentExpenses={financialPlan.currentCashFlow.expenses}
                suggestedExpenses={financialPlan.suggestedCashFlow.expenses}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
