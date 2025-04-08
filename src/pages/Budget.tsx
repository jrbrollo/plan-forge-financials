import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, InfoIcon, Plus, Trash, Save } from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import { createFinancialPlanFromClient } from '@/services/financialService';
import type { FinancialPlan, Client, Income, Expense, CashFlow } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { BarChart } from '@/components/Charts/BarChart';
import { useToast } from '@/hooks/use-toast';

export default function Budget() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { currentClient, isLoading, error, loadClientById } = useClient();
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);
  const [currentCashFlow, setCurrentCashFlow] = useState<CashFlow | null>(null);
  const [suggestedCashFlow, setSuggestedCashFlow] = useState<CashFlow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("comparacao");
  const { toast } = useToast();

  // Estados para edição do orçamento
  const [income, setIncome] = useState<{id: string, description: string, amount: number}[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<{id: string, description: string, amount: number, isEssential: boolean}[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<{id: string, description: string, amount: number, isEssential: boolean}[]>([]);
  const [investments, setInvestments] = useState<{id: string, description: string, amount: number}[]>([]);

  useEffect(() => {
    const loadClientData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Verificar cliente no contexto ou por ID
        let client: Client | null = null;
        
        if (clientId) {
          console.log("Carregando cliente por ID:", clientId);
          client = loadClientById(clientId);
        } else if (currentClient) {
          console.log("Usando cliente do contexto:", currentClient.id);
          client = currentClient;
        } else {
          // Redirecionar para a lista de clientes
          console.log("Nenhum cliente disponível, redirecionando");
          navigate('/clients');
          return;
        }
        
        if (!client) {
          setError("Cliente não encontrado");
          setLoading(false);
          return;
        }
        
        console.log("Cliente carregado:", client.name);
        
        // Criar plano financeiro
        const plan = createFinancialPlanFromClient(client);
        console.log("Plano financeiro criado:", !!plan);
        
        if (!plan) {
          setError("Erro ao criar plano financeiro");
          setLoading(false);
          return;
        }
        
        // Atualizar estados
        setFinancialPlan(plan);
        setCurrentCashFlow(plan.currentCashFlow);
        setSuggestedCashFlow(plan.suggestedCashFlow);
        
        // Inicializar dados para edição
        initializeEditData(plan.currentCashFlow);
        
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados do orçamento");
        setLoading(false);
      }
    };

    loadClientData();
  }, [clientId, currentClient, navigate]);

  // Inicializar dados para edição a partir do fluxo de caixa atual
  const initializeEditData = (cashFlow?: CashFlow) => {
    if (!cashFlow) return;

    // Receitas
    if (cashFlow.income && cashFlow.income.length > 0) {
      setIncome(cashFlow.income.map((inc, idx) => ({
        id: idx.toString(),
        description: inc.description,
        amount: inc.amount
      })));
    } else {
      setIncome([{ id: '0', description: '', amount: 0 }]);
    }

    // Despesas fixas (essenciais)
    const fixed = cashFlow.expenses?.filter(exp => exp.isEssential) || [];
    setFixedExpenses(fixed.map((exp, idx) => ({
      id: idx.toString(),
      description: exp.description,
      amount: exp.amount,
      isEssential: true
    })));
    
    if (fixed.length === 0) {
      setFixedExpenses([{ id: '0', description: '', amount: 0, isEssential: true }]);
    }

    // Despesas variáveis (não essenciais)
    const variable = cashFlow.expenses?.filter(exp => !exp.isEssential) || [];
    setVariableExpenses(variable.map((exp, idx) => ({
      id: idx.toString(),
      description: exp.description,
      amount: exp.amount,
      isEssential: false
    })));
    
    if (variable.length === 0) {
      setVariableExpenses([{ id: '0', description: '', amount: 0, isEssential: false }]);
    }

    // Investimentos (simulado com base na diferença renda - despesas)
    const totalIncome = cashFlow.income?.reduce((sum, inc) => sum + inc.amount, 0) || 0;
    const totalExpenses = cashFlow.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const suggestedInvestment = Math.max(0, (totalIncome - totalExpenses) * 0.2); // 20% do saldo como sugestão

    setInvestments([{ 
      id: '0', 
      description: 'Investimento Mensal',  
      amount: suggestedInvestment
    }]);
  };

  // Agrupar despesas por categoria
  const groupExpensesByCategory = (expenses: Expense[] = []) => {
    const fixed = expenses.filter(exp => exp.isEssential);
    const variable = expenses.filter(exp => !exp.isEssential);
    
    const fixedTotal = fixed.reduce((sum, exp) => sum + exp.amount, 0);
    const variableTotal = variable.reduce((sum, exp) => sum + exp.amount, 0);
    
    return {
      fixed,
      variable,
      fixedTotal,
      variableTotal
    };
  };

  // Calcular totais
  const calculateTotals = (cashFlow: CashFlow | null) => {
    if (!cashFlow) return { income: 0, expenses: 0, investments: 0, balance: 0 };
    
    const income = cashFlow.income?.reduce((sum, inc) => sum + inc.amount, 0) || 0;
    const expenses = cashFlow.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    
    // Simulando investimentos (normalmente viria de outra parte do financialPlan)
    const investments = income * 0.07; // 7% da renda para investimentos
    
    const total = expenses + investments;
    const balance = income - total;
    
    return { income, expenses, investments, total, balance };
  };

  // Funções para manipular os dados de edição
  const addItem = (type: string) => {
    const newId = Date.now().toString();
    
    if (type === 'income') {
      setIncome([...income, { id: newId, description: '', amount: 0 }]);
    } else if (type === 'fixed') {
      setFixedExpenses([...fixedExpenses, { id: newId, description: '', amount: 0, isEssential: true }]);
    } else if (type === 'variable') {
      setVariableExpenses([...variableExpenses, { id: newId, description: '', amount: 0, isEssential: false }]);
    } else if (type === 'investments') {
      setInvestments([...investments, { id: newId, description: '', amount: 0 }]);
    }
  };

  const removeItem = (type: string, id: string) => {
    if (type === 'income') {
      setIncome(income.filter(item => item.id !== id));
    } else if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.filter(item => item.id !== id));
    } else if (type === 'variable') {
      setVariableExpenses(variableExpenses.filter(item => item.id !== id));
    } else if (type === 'investments') {
      setInvestments(investments.filter(item => item.id !== id));
    }
  };

  const updateDescription = (type: string, id: string, value: string) => {
    if (type === 'income') {
      setIncome(income.map(item => item.id === id ? { ...item, description: value } : item));
    } else if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.map(item => item.id === id ? { ...item, description: value } : item));
    } else if (type === 'variable') {
      setVariableExpenses(variableExpenses.map(item => item.id === id ? { ...item, description: value } : item));
    } else if (type === 'investments') {
      setInvestments(investments.map(item => item.id === id ? { ...item, description: value } : item));
    }
  };

  const updateAmount = (type: string, id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (type === 'income') {
      setIncome(income.map(item => item.id === id ? { ...item, amount: numValue } : item));
    } else if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.map(item => item.id === id ? { ...item, amount: numValue } : item));
    } else if (type === 'variable') {
      setVariableExpenses(variableExpenses.map(item => item.id === id ? { ...item, amount: numValue } : item));
    } else if (type === 'investments') {
      setInvestments(investments.map(item => item.id === id ? { ...item, amount: numValue } : item));
    }
  };

  const toggleEssential = (type: string, id: string) => {
    if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.map(item => 
        item.id === id ? { ...item, isEssential: !item.isEssential } : item
      ));
    } else if (type === 'variable') {
      setVariableExpenses(variableExpenses.map(item => 
        item.id === id ? { ...item, isEssential: !item.isEssential } : item
      ));
    }
  };

  const saveClientData = () => {
    if (!currentClient) return;

    // Construir fluxos de caixa atualizados
    const updatedCashFlow: CashFlow = {
      income: income.filter(i => i.description && i.amount > 0).map(i => ({
        description: i.description,
        amount: i.amount,
        frequency: 'monthly'
      })),
      expenses: [
        ...fixedExpenses.filter(e => e.description && e.amount > 0).map(e => ({
          description: e.description,
          amount: e.amount,
          category: 'Fixo',
          isEssential: true
        })),
        ...variableExpenses.filter(e => e.description && e.amount > 0).map(e => ({
          description: e.description,
          amount: e.amount,
          category: 'Variável',
          isEssential: false
        }))
      ]
    };

    // Preparando dados para salvar no cliente
    const fixedMonthlyExpenses = fixedExpenses
      .filter(e => e.description && e.amount > 0)
      .map(e => `${e.description}: R$ ${e.amount.toFixed(2).replace('.', ',')}`)
      .join(', ');

    const variableExpensesStr = variableExpenses
      .filter(e => e.description && e.amount > 0)
      .map(e => `${e.description}: R$ ${e.amount.toFixed(2).replace('.', ',')}`)
      .join(', ');

    // Calculando renda mensal total
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalInvestments = investments.reduce((sum, i) => sum + i.amount, 0);
    
    // Atualizando cliente
    const updatedClient = {
      ...currentClient,
      monthlyNetIncome: totalIncome,
      fixedMonthlyExpenses,
      variableExpenses: variableExpensesStr,
      monthlySavingsAverage: totalInvestments,
      hasSavingHabit: totalInvestments > 0
    };

    updateClient(updatedClient);
    
    // Atualizar o estado local com os novos fluxos de caixa
    setCurrentCashFlow(updatedCashFlow);
    
    // Criar um plano financeiro atualizado
    const newPlan = createFinancialPlanFromClient(updatedClient);
    setFinancialPlan(newPlan);
    setSuggestedCashFlow(newPlan.suggestedCashFlow);

    toast({
      title: "Orçamento atualizado",
      description: "Os dados do orçamento foram salvos com sucesso."
    });
  };
  
  const currentGroups = groupExpensesByCategory(currentCashFlow?.expenses);
  const suggestedGroups = groupExpensesByCategory(suggestedCashFlow?.expenses);
  
  const currentTotals = calculateTotals(currentCashFlow);
  const suggestedTotals = calculateTotals(suggestedCashFlow);
  
  // Calcular meta mensal (economia sugerida)
  const monthlySavingGoal = suggestedTotals.balance;
  const dailySavingGoal = monthlySavingGoal / 30;
  const annualSavingGoal = monthlySavingGoal * 12;

  // Dados para o gráfico de comparação
  const chartData = {
    labels: ['Gastos Fixos', 'Gastos Variáveis', 'Investimentos'],
    datasets: [
      {
        label: 'Atual',
        data: [currentGroups.fixedTotal, currentGroups.variableTotal, currentTotals.investments],
        backgroundColor: '#0c2461',
      },
      {
        label: 'Sugerido',
        data: [suggestedGroups.fixedTotal, suggestedGroups.variableTotal, suggestedTotals.investments],
        backgroundColor: '#546e90',
      },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calcular totais para os dados de edição
  const totalEditIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalEditFixedExpenses = fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalEditVariableExpenses = variableExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalEditExpenses = totalEditFixedExpenses + totalEditVariableExpenses;
  const totalEditInvestments = investments.reduce((sum, item) => sum + item.amount, 0);
  const monthlyEditBalance = totalEditIncome - totalEditExpenses - totalEditInvestments;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Orçamento</h1>
            <p className="text-gray-500">Gerencie e compare orçamentos atuais e sugeridos.</p>
          </div>
          
          {clientId && (
            <Button variant="outline" size="sm" onClick={() => navigate(`/clients/${clientId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Cliente
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando dados do orçamento...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        ) : !currentClient ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os dados financeiros do cliente.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="comparacao">Comparação de Orçamentos</TabsTrigger>
                <TabsTrigger value="edicao">Edição do Orçamento</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comparacao" className="space-y-6">
                {/* Cards de comparação e meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Situação Atual */}
                  <Card className="border rounded-lg overflow-hidden">
                    <div className="bg-[#0c2461] text-white p-4">
                      <h2 className="text-xl font-semibold">Situação Atual</h2>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span>Gastos Fixos</span>
                        <span className="font-semibold">{formatCurrency(currentGroups.fixedTotal)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Gastos Variáveis</span>
                        <span className="font-semibold">{formatCurrency(currentGroups.variableTotal)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Investimentos</span>
                        <span className="font-semibold">{formatCurrency(currentTotals.investments)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Gasto Total</span>
                        <span className="font-semibold">{formatCurrency(currentTotals.total)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Renda Total</span>
                        <span className="font-semibold">{formatCurrency(currentTotals.income)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saldo</span>
                        <span className={`font-semibold ${currentTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(currentTotals.balance)}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Situação Sugerida */}
                  <Card className="border rounded-lg overflow-hidden">
                    <div className="bg-[#0c2461] text-white p-4">
                      <h2 className="text-xl font-semibold">Situação Sugerida</h2>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span>Gastos Fixos</span>
                        <span className="font-semibold">{formatCurrency(suggestedGroups.fixedTotal)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Gastos Variáveis</span>
                        <span className="font-semibold">{formatCurrency(suggestedGroups.variableTotal)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Investimentos</span>
                        <span className="font-semibold">{formatCurrency(suggestedTotals.investments)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Gasto Total</span>
                        <span className="font-semibold">{formatCurrency(suggestedTotals.total)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Renda Total</span>
                        <span className="font-semibold">{formatCurrency(suggestedTotals.income)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saldo</span>
                        <span className={`font-semibold ${suggestedTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(suggestedTotals.balance)}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Meta Mensal */}
                  <Card className="border rounded-lg overflow-hidden">
                    <div className="bg-[#0c2461] text-white p-4">
                      <h2 className="text-xl font-semibold">Meta Mensal</h2>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold text-[#0c2461] mb-2">
                        {formatCurrency(monthlySavingGoal)}
                      </div>
                      <p className="text-gray-500 text-center mb-6">Meta de economia mensal</p>
                      
                      <div className="w-full space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Meta diária</span>
                          <span className="font-semibold">{formatCurrency(dailySavingGoal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Meta anual</span>
                          <span className="font-semibold">{formatCurrency(annualSavingGoal)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Comparação de Orçamento (Gráfico) */}
                <Card className="border rounded-lg overflow-hidden">
                  <div className="bg-[#0c2461] text-white p-4">
                    <h2 className="text-xl font-semibold">Comparação de Orçamento</h2>
                  </div>
                  <div className="p-4 h-80">
                    <BarChart data={chartData} />
                  </div>
                </Card>

                {/* Fluxos de Caixa Detalhados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fluxo de Caixa Real */}
                  <Card className="border rounded-lg overflow-hidden">
                    <div className="bg-[#0c2461] text-white p-4">
                      <h2 className="text-xl font-semibold">Fluxo de Caixa Real</h2>
                    </div>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="w-[50%]">Descrição</TableHead>
                            <TableHead>Valor (R$)</TableHead>
                            <TableHead>%</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Renda */}
                          <TableRow className="border-b bg-gray-50">
                            <TableCell className="font-semibold">Renda</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          {currentCashFlow?.income?.map((income, idx) => (
                            <TableRow key={`income-current-${idx}`}>
                              <TableCell>{income.description}</TableCell>
                              <TableCell>{formatCurrency(income.amount)}</TableCell>
                              <TableCell>{((income.amount / currentTotals.income) * 100).toFixed(0)}%</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-semibold bg-gray-50">
                            <TableCell>Total</TableCell>
                            <TableCell>{formatCurrency(currentTotals.income)}</TableCell>
                            <TableCell>100%</TableCell>
                          </TableRow>
                          
                          {/* Investimentos */}
                          <TableRow className="border-b bg-gray-50">
                            <TableCell className="font-semibold">Investimentos</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Previdência Privada</TableCell>
                            <TableCell>{formatCurrency(currentTotals.investments)}</TableCell>
                            <TableCell>{((currentTotals.investments / currentTotals.income) * 100).toFixed(0)}%</TableCell>
                          </TableRow>
                          <TableRow className="font-semibold bg-gray-50">
                            <TableCell>Total</TableCell>
                            <TableCell>{formatCurrency(currentTotals.investments)}</TableCell>
                            <TableCell>{((currentTotals.investments / currentTotals.income) * 100).toFixed(0)}%</TableCell>
                          </TableRow>
                          
                          {/* Gastos Fixos */}
                          <TableRow className="border-b bg-gray-50">
                            <TableCell className="font-semibold">Gastos Fixos</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          {currentGroups.fixed.map((expense, idx) => (
                            <TableRow key={`fixed-current-${idx}`}>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell>{formatCurrency(expense.amount)}</TableCell>
                              <TableCell>{((expense.amount / currentTotals.income) * 100).toFixed(0)}%</TableCell>
                            </TableRow>
                          ))}
                          
                          {/* Gastos Variáveis */}
                          <TableRow className="border-b bg-gray-50">
                            <TableCell className="font-semibold">Gastos Variáveis</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          {currentGroups.variable.map((expense, idx) => (
                            <TableRow key={`variable-current-${idx}`}>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell>{formatCurrency(expense.amount)}</TableCell>
                              <TableCell>{((expense.amount / currentTotals.income) * 100).toFixed(0)}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Fluxo de Caixa Sugerido */}
                  <Card className="border rounded-lg overflow-hidden">
                    <div className="bg-[#0c2461] text-white p-4">
                      <h2 className="text-xl font-semibold">Fluxo de Caixa Sugerido</h2>
                    </div>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="w-[50%]">Descrição</TableHead>
                            <TableHead>Valor (R$)</TableHead>
                            <TableHead>%</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Renda */}
                          <TableRow className="border-b bg-gray-50">
                            <TableCell className="font-semibold">Renda</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          {suggestedCashFlow?.income?.map((income, idx) => (
                            <TableRow key={`income-suggested-${idx}`}>
                              <TableCell>{income.description}</TableCell>
                              <TableCell>{formatCurrency(income.amount)}</TableCell>
                              <TableCell>{((income.amount / suggestedTotals.income) * 100).toFixed(0)}%</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-semibold bg-gray-50">
                            <TableCell>Total</TableCell>
                            <TableCell>{formatCurrency(suggestedTotals.income)}</TableCell>
                            <TableCell>100%</TableCell>
                          </TableRow>
                          
                          {/* Investimentos */}
                          <TableRow className="border-b bg-gray-50">
                            <TableCell className="font-semibold">Investimentos</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Previdência Privada</TableCell>
                            <TableCell>{formatCurrency(suggestedTotals.investments * 0.5)}</TableCell>
                            <TableCell>{((suggestedTotals.investments * 0.5 / suggestedTotals.income) * 100).toFixed(0)}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Investimentos</TableCell>
                            <TableCell>{formatCurrency(suggestedTotals.investments * 0.5)}</TableCell>
                            <TableCell>{((suggestedTotals.investments * 0.5 / suggestedTotals.income) * 100).toFixed(0)}%</TableCell>
                          </TableRow>
                          <TableRow className="font-semibold bg-gray-50">
                            <TableCell>Total</TableCell>
                            <TableCell>{formatCurrency(suggestedTotals.investments)}</TableCell>
                            <TableCell>{((suggestedTotals.investments / suggestedTotals.income) * 100).toFixed(0)}%</TableCell>
                          </TableRow>
                          
                          {/* Gastos Fixos */}
                          <TableRow className="border-b bg-gray-50">
                            <TableCell className="font-semibold">Gastos Fixos</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          {suggestedGroups.fixed.map((expense, idx) => (
                            <TableRow key={`fixed-suggested-${idx}`}>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell>{formatCurrency(expense.amount)}</TableCell>
                              <TableCell>{((expense.amount / suggestedTotals.income) * 100).toFixed(0)}%</TableCell>
                            </TableRow>
                          ))}
                          
                          {/* Gastos Variáveis */}
                          <TableRow className="border-b bg-gray-50">
                            <TableCell className="font-semibold">Gastos Variáveis</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          {suggestedGroups.variable.map((expense, idx) => (
                            <TableRow key={`variable-suggested-${idx}`}>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell>{formatCurrency(expense.amount)}</TableCell>
                              <TableCell>{((expense.amount / suggestedTotals.income) * 100).toFixed(0)}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="edicao">
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-finance-navy">Edição de Orçamento</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button onClick={saveClientData}>
                          <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Receitas</h3>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEditIncome)}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Despesas</h3>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(totalEditExpenses)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Investimentos</h3>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalEditInvestments)}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Saldo</h3>
                        <p className={`text-2xl font-bold ${monthlyEditBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(monthlyEditBalance)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="receitas">
                  <TabsList className="mb-6">
                    <TabsTrigger value="receitas">Receitas</TabsTrigger>
                    <TabsTrigger value="despesas-fixas">Despesas Fixas</TabsTrigger>
                    <TabsTrigger value="despesas-variaveis">Despesas Variáveis</TabsTrigger>
                    <TabsTrigger value="investimentos">Investimentos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="receitas">
                    <Card>
                      <CardHeader>
                        <CardTitle>Receitas Mensais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">Descrição</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {income.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateDescription('income', item.id, e.target.value)}
                                    placeholder="Descrição da receita"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={item.amount || ''}
                                    onChange={(e) => updateAmount('income', item.id, e.target.value)}
                                    placeholder="0,00"
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem('income', item.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm" onClick={() => addItem('income')}>
                            <Plus className="mr-1 h-4 w-4" /> Adicionar Receita
                          </Button>
                          
                          <div className="text-right">
                            <span className="text-sm text-gray-500">Total:</span>
                            <span className="ml-2 font-bold">{formatCurrency(totalEditIncome)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="despesas-fixas">
                    <Card>
                      <CardHeader>
                        <CardTitle>Despesas Fixas Mensais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">Descrição</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead>Essencial?</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fixedExpenses.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateDescription('fixed', item.id, e.target.value)}
                                    placeholder="Descrição da despesa"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={item.amount || ''}
                                    onChange={(e) => updateAmount('fixed', item.id, e.target.value)}
                                    placeholder="0,00"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant={item.isEssential ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleEssential('fixed', item.id)}
                                  >
                                    {item.isEssential ? "Sim" : "Não"}
                                  </Button>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem('fixed', item.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm" onClick={() => addItem('fixed')}>
                            <Plus className="mr-1 h-4 w-4" /> Adicionar Despesa Fixa
                          </Button>
                          
                          <div className="text-right">
                            <span className="text-sm text-gray-500">Total:</span>
                            <span className="ml-2 font-bold">{formatCurrency(totalEditFixedExpenses)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="despesas-variaveis">
                    <Card>
                      <CardHeader>
                        <CardTitle>Despesas Variáveis Mensais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">Descrição</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead>Essencial?</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {variableExpenses.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateDescription('variable', item.id, e.target.value)}
                                    placeholder="Descrição da despesa"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={item.amount || ''}
                                    onChange={(e) => updateAmount('variable', item.id, e.target.value)}
                                    placeholder="0,00"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant={item.isEssential ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleEssential('variable', item.id)}
                                  >
                                    {item.isEssential ? "Sim" : "Não"}
                                  </Button>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem('variable', item.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm" onClick={() => addItem('variable')}>
                            <Plus className="mr-1 h-4 w-4" /> Adicionar Despesa Variável
                          </Button>
                          
                          <div className="text-right">
                            <span className="text-sm text-gray-500">Total:</span>
                            <span className="ml-2 font-bold">{formatCurrency(totalEditVariableExpenses)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="investimentos">
                    <Card>
                      <CardHeader>
                        <CardTitle>Investimentos Mensais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">Descrição</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {investments.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateDescription('investments', item.id, e.target.value)}
                                    placeholder="Descrição do investimento"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={item.amount || ''}
                                    onChange={(e) => updateAmount('investments', item.id, e.target.value)}
                                    placeholder="0,00"
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem('investments', item.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm" onClick={() => addItem('investments')}>
                            <Plus className="mr-1 h-4 w-4" /> Adicionar Investimento
                          </Button>
                          
                          <div className="text-right">
                            <span className="text-sm text-gray-500">Total:</span>
                            <span className="ml-2 font-bold">{formatCurrency(totalEditInvestments)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
