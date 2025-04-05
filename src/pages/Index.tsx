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
import type { Client, FinancialPlan, Expense, Income, CashFlow } from '@/lib/types';

// Dados de exemplo para quando não há um cliente selecionado
const createDefaultCashFlow = (client?: Client): CashFlow => {
  const baseIncome = client?.monthlyNetIncome || 5000;
  return {
    incomes: [
      { source: "Renda Principal", amount: baseIncome, frequency: "monthly", percentage: 100 }
    ],
    expenses: [
      { category: "fixed", description: "Moradia", amount: baseIncome * 0.3, percentage: 30 },
      { category: "fixed", description: "Transporte", amount: baseIncome * 0.15, percentage: 15 },
      { category: "variable", description: "Alimentação", amount: baseIncome * 0.2, percentage: 20 },
      { category: "variable", description: "Lazer", amount: baseIncome * 0.1, percentage: 10 },
      { category: "variable", description: "Outros", amount: baseIncome * 0.15, percentage: 15 }
    ],
    investments: baseIncome * 0.1,
    totalIncome: baseIncome,
    totalExpenses: baseIncome * 0.9,
    balance: baseIncome * 0.1
  };
};

// Criar um plano financeiro baseado no cliente atual
const createFinancialPlanFromClient = (client: Client): FinancialPlan => {
  // Calcular gastos baseados nas informações do cliente
  const monthlyIncome = client.monthlyNetIncome || 5000;
  
  // Usar informações do cliente se disponíveis ou valores padrão
  const housingExpense = client.hasProperty ? 
    (client.isPropertyPaidOff ? 0 : (client.propertyMonthlyPayment || monthlyIncome * 0.3)) : 
    monthlyIncome * 0.3;
  
  const carExpense = client.hasCar ? 
    (client.isCarPaidOff ? 0 : (client.carMonthlyPayment || monthlyIncome * 0.15)) : 
    monthlyIncome * 0.15;
  
  const totalInvestments = client.hasInvestments ? (client.totalInvestments || 0) : 0;
  
  // Parse despesas fixas e variáveis do texto, se disponíveis
  let fixedExpenseItems: Expense[] = [];
  let variableExpenseItems: Expense[] = [];
  
  if (client.fixedMonthlyExpenses) {
    // Tentativa simples de parsing do texto de despesas
    const fixedItems = client.fixedMonthlyExpenses.split(',');
    let totalFixed = 0;
    
    fixedItems.forEach((item, index) => {
      const match = item.match(/([^:]+):\s*R\$\s*([\d.,]+)/);
      if (match) {
        const description = match[1].trim();
        const amount = parseFloat(match[2].replace('.', '').replace(',', '.'));
        totalFixed += amount;
        
        fixedExpenseItems.push({
          category: "fixed",
          description,
          amount,
          percentage: 0 // Será calculado depois
        });
      }
    });
    
    // Calcular percentagens
    if (totalFixed > 0) {
      fixedExpenseItems = fixedExpenseItems.map(item => ({
        ...item,
        percentage: Math.round((item.amount / monthlyIncome) * 100)
      }));
    }
  }
  
  if (client.variableExpenses) {
    // Mesma lógica para despesas variáveis
    const variableItems = client.variableExpenses.split(',');
    let totalVariable = 0;
    
    variableItems.forEach((item, index) => {
      const match = item.match(/([^:]+):\s*R\$\s*([\d.,]+)/);
      if (match) {
        const description = match[1].trim();
        const amount = parseFloat(match[2].replace('.', '').replace(',', '.'));
        totalVariable += amount;
        
        variableExpenseItems.push({
          category: "variable",
          description,
          amount,
          percentage: 0 // Será calculado depois
        });
      }
    });
    
    // Calcular percentagens
    if (totalVariable > 0) {
      variableExpenseItems = variableExpenseItems.map(item => ({
        ...item,
        percentage: Math.round((item.amount / monthlyIncome) * 100)
      }));
    }
  }
  
  // Se não conseguiu extrair despesas do texto, usar valores padrão
  if (fixedExpenseItems.length === 0) {
    fixedExpenseItems = [
      { category: "fixed", description: "Moradia", amount: housingExpense, percentage: Math.round((housingExpense / monthlyIncome) * 100) },
      { category: "fixed", description: "Transporte", amount: carExpense, percentage: Math.round((carExpense / monthlyIncome) * 100) }
    ];
  }
  
  if (variableExpenseItems.length === 0) {
    variableExpenseItems = [
      { category: "variable", description: "Alimentação", amount: monthlyIncome * 0.2, percentage: 20 },
      { category: "variable", description: "Lazer", amount: monthlyIncome * 0.1, percentage: 10 }
    ];
  }
  
  // Combinar todas as despesas
  const allExpenses = [...fixedExpenseItems, ...variableExpenseItems];
  
  // Calcular total de despesas
  const totalExpenses = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calcular saldo
  const balance = monthlyIncome - totalExpenses;
  
  // Investimento mensal (se positivo)
  const monthlyInvestment = balance > 0 ? balance : 0;
  
  // Criar fluxo de caixa atual
  const currentCashFlow: CashFlow = {
    incomes: [
      { source: client.profession || "Renda Principal", amount: monthlyIncome, frequency: "monthly", percentage: 100 }
    ],
    expenses: allExpenses,
    investments: monthlyInvestment,
    totalIncome: monthlyIncome,
    totalExpenses,
    balance
  };
  
  // Criar sugestão de fluxo de caixa otimizado
  // Reduzir gastos variáveis em 10% e aumentar investimentos
  const suggestedExpenses = allExpenses.map(expense => {
    if (expense.category === "variable") {
      const reducedAmount = expense.amount * 0.9;
      return {
        ...expense,
        amount: reducedAmount,
        percentage: Math.round((reducedAmount / monthlyIncome) * 100)
      };
    }
    return expense;
  });
  
  const suggestedTotalExpenses = suggestedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const suggestedBalance = monthlyIncome - suggestedTotalExpenses;
  const suggestedInvestment = suggestedBalance > 0 ? suggestedBalance : 0;
  
  const suggestedCashFlow: CashFlow = {
    incomes: currentCashFlow.incomes,
    expenses: suggestedExpenses,
    investments: suggestedInvestment,
    totalIncome: monthlyIncome,
    totalExpenses: suggestedTotalExpenses,
    balance: suggestedBalance
  };
  
  // Criar plano financeiro
  return {
    client,
    currentCashFlow,
    suggestedCashFlow,
    investments: [
      {
        name: "Investimentos Atuais",
        type: "diversified",
        initialValue: totalInvestments * 0.9,
        currentValue: totalInvestments,
        annualReturn: 10,
        investmentDate: new Date()
      }
    ],
    debts: client.debts || [],
    assets: [
      ...(client.hasProperty ? [{
        description: "Imóvel",
        currentValue: client.propertyMarketValue || 0,
        acquisitionValue: client.propertyMarketValue ? client.propertyMarketValue * 0.9 : 0,
        acquisitionDate: new Date()
      }] : []),
      ...(client.hasCar ? [{
        description: "Veículo",
        currentValue: client.carMarketValue || 0,
        acquisitionValue: client.carMarketValue ? client.carMarketValue * 1.1 : 0,
        acquisitionDate: new Date()
      }] : [])
    ],
    protections: [
      ...(client.hasHealthInsurance ? [{
        type: "Plano de Saúde",
        provider: "Operadora",
        coverageAmount: monthlyIncome * 12,
        monthlyPremium: monthlyIncome * 0.1,
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      }] : []),
      ...(client.hasLifeInsurance ? [{
        type: "Seguro de Vida",
        provider: "Seguradora",
        coverageAmount: monthlyIncome * 24,
        monthlyPremium: monthlyIncome * 0.05,
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      }] : [])
    ],
    financialGoals: client.otherGoals ? client.otherGoals.map(goal => ({
      description: goal.description,
      targetAmount: goal.amountNeeded,
      targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + parseInt(goal.deadline) || 5)),
      currentSavings: goal.amountNeeded * 0.1,
      monthlyContribution: (goal.amountNeeded - (goal.amountNeeded * 0.1)) / (parseInt(goal.deadline) * 12 || 60)
    })) : [],
    emergencyFundTarget: monthlyIncome * 6,
    emergencyFundCurrent: totalInvestments * 0.2
  };
};

const Index = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { currentClient, setCurrentClient } = useClient();
  const [loading, setLoading] = useState(true);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);
  const [hasClients, setHasClients] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Verificar se há clientes cadastrados
      const clients = getClients();
      setHasClients(clients.length > 0);
      
      if (clientId) {
        // Se tiver clientId na URL, carrega os dados desse cliente
        const client = getClientById(clientId);
        if (client) {
          setCurrentClient(client);
          const plan = createFinancialPlanFromClient(client);
          setFinancialPlan(plan);
        } else {
          // Cliente não encontrado
          setFinancialPlan(null);
        }
      } else if (currentClient) {
        // Se não tiver clientId mas tiver cliente no contexto
        const plan = createFinancialPlanFromClient(currentClient);
        setFinancialPlan(plan);
      } else if (clients.length > 0) {
        // Se não tiver cliente definido mas existirem clientes, usa o primeiro
        const client = clients[0];
        setCurrentClient(client);
        const plan = createFinancialPlanFromClient(client);
        setFinancialPlan(plan);
      } else {
        // Nenhum cliente
        setFinancialPlan(null);
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
        ) : !financialPlan ? (
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
              <ClientOverview client={financialPlan.client} />
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
