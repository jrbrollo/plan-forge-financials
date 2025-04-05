import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, InfoIcon } from 'lucide-react';
import { getClientById } from '@/services/clientService';
import { createFinancialPlanFromClient } from '@/services/financialService';
import type { FinancialPlan, Client, Income, Expense, CashFlow } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { BarChart } from '@/components/Charts/BarChart';

export default function Budget() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);
  const [currentCashFlow, setCurrentCashFlow] = useState<CashFlow | null>(null);
  const [suggestedCashFlow, setSuggestedCashFlow] = useState<CashFlow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadClientData = async () => {
      if (clientId) {
        setLoading(true);
        const clientData = await getClientById(clientId);
        
        if (clientData) {
          setClient(clientData);
          const plan = createFinancialPlanFromClient(clientData);
          setFinancialPlan(plan);
          setCurrentCashFlow(plan.currentCashFlow);
          setSuggestedCashFlow(plan.suggestedCashFlow);
        }
        
        setLoading(false);
      }
    };

    loadClientData();
  }, [clientId]);

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Orçamento</h1>
            <p className="text-gray-500">Compare o orçamento atual com o sugerido.</p>
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
        ) : !client || !financialPlan || !currentCashFlow || !suggestedCashFlow ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os dados financeiros do cliente.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
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
                    <span className="font-semibold text-green-600">{formatCurrency(currentTotals.balance)}</span>
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
                    <span className="font-semibold text-green-600">{formatCurrency(suggestedTotals.balance)}</span>
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
                      {currentCashFlow.income.map((income, idx) => (
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
                      {suggestedCashFlow.income.map((income, idx) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
