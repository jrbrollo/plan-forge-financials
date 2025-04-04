
import React from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense } from '@/lib/types';

// Sample expenses data
const currentFixedExpenses: Expense[] = [
  { category: "fixed", description: "Aluguel/Financiamento", amount: 5800, percentage: 19 },
  { category: "fixed", description: "Condomínio", amount: 1400, percentage: 5 },
  { category: "fixed", description: "IPTU", amount: 200, percentage: 1 },
  { category: "fixed", description: "Energia", amount: 500, percentage: 2 },
  { category: "fixed", description: "Diarista", amount: 800, percentage: 3 },
  { category: "fixed", description: "Celular", amount: 500, percentage: 2 },
  { category: "fixed", description: "Assinaturas", amount: 200, percentage: 1 },
  { category: "fixed", description: "Personal", amount: 1300, percentage: 4 },
  { category: "fixed", description: "Psicólogo", amount: 600, percentage: 2 },
  { category: "fixed", description: "Médico", amount: 220, percentage: 1 }
];

const currentVariableExpenses: Expense[] = [
  { category: "variable", description: "Alimentação", amount: 3500, percentage: 11 },
  { category: "variable", description: "Lazer", amount: 2500, percentage: 8 },
  { category: "variable", description: "Transporte", amount: 1200, percentage: 4 },
  { category: "variable", description: "Roupas", amount: 1000, percentage: 3 },
  { category: "variable", description: "Presentes", amount: 800, percentage: 3 },
  { category: "variable", description: "Outros", amount: 1549, percentage: 5 }
];

const suggestedFixedExpenses: Expense[] = [
  { category: "fixed", description: "Aluguel/Financiamento", amount: 5746, percentage: 19 },
  { category: "fixed", description: "Condomínio", amount: 1414, percentage: 5 },
  { category: "fixed", description: "IPTU", amount: 200, percentage: 1 },
  { category: "fixed", description: "Energia", amount: 500, percentage: 2 },
  { category: "fixed", description: "Diarista", amount: 800, percentage: 3 },
  { category: "fixed", description: "Celular", amount: 500, percentage: 2 },
  { category: "fixed", description: "Assinaturas", amount: 292, percentage: 1 },
  { category: "fixed", description: "Personal", amount: 1440, percentage: 5 },
  { category: "fixed", description: "Psicólogo", amount: 750, percentage: 2 },
  { category: "fixed", description: "Médico", amount: 220, percentage: 1 }
];

const suggestedVariableExpenses: Expense[] = [
  { category: "variable", description: "Alimentação", amount: 2800, percentage: 9 },
  { category: "variable", description: "Lazer", amount: 2000, percentage: 6 },
  { category: "variable", description: "Transporte", amount: 1000, percentage: 3 },
  { category: "variable", description: "Roupas", amount: 800, percentage: 3 },
  { category: "variable", description: "Presentes", amount: 700, percentage: 2 }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const Budget = () => {
  // Prepare chart data
  const chartData = [
    {
      name: "Gastos Fixos",
      Atual: currentFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0),
      Sugerido: suggestedFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0)
    },
    {
      name: "Gastos Variáveis",
      Atual: currentVariableExpenses.reduce((acc, curr) => acc + curr.amount, 0),
      Sugerido: suggestedVariableExpenses.reduce((acc, curr) => acc + curr.amount, 0)
    },
    {
      name: "Investimentos",
      Atual: 2175,
      Sugerido: 4675
    }
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-finance-navy">Orçamento</h1>
          <p className="text-gray-600">Compare o orçamento atual com o sugerido.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2 bg-finance-navy text-white">
              <CardTitle>Situação Atual</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gastos Fixos</span>
                  <span className="font-semibold">
                    {formatCurrency(currentFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gastos Variáveis</span>
                  <span className="font-semibold">
                    {formatCurrency(currentVariableExpenses.reduce((acc, curr) => acc + curr.amount, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Investimentos</span>
                  <span className="font-semibold">
                    {formatCurrency(2175)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Gasto Total</span>
                  <span>
                    {formatCurrency(currentFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 
                      currentVariableExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 2175)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Renda Total</span>
                  <span className="font-semibold">
                    {formatCurrency(31025)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Saldo</span>
                  <span className="text-finance-green">
                    {formatCurrency(31025 - (currentFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 
                      currentVariableExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 2175))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 bg-finance-navy text-white">
              <CardTitle>Situação Sugerida</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gastos Fixos</span>
                  <span className="font-semibold">
                    {formatCurrency(suggestedFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gastos Variáveis</span>
                  <span className="font-semibold">
                    {formatCurrency(suggestedVariableExpenses.reduce((acc, curr) => acc + curr.amount, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Investimentos</span>
                  <span className="font-semibold">
                    {formatCurrency(4675)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Gasto Total</span>
                  <span>
                    {formatCurrency(suggestedFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 
                      suggestedVariableExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 4675)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Renda Total</span>
                  <span className="font-semibold">
                    {formatCurrency(31025)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Saldo</span>
                  <span className="text-finance-green">
                    {formatCurrency(31025 - (suggestedFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 
                      suggestedVariableExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 4675))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 bg-finance-navy text-white">
              <CardTitle>Meta Mensal</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-finance-blue">
                      {formatCurrency(7300)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Meta de economia mensal
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Meta diária</span>
                    <span className="font-semibold">
                      {formatCurrency(7300 / 30)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meta anual</span>
                    <span className="font-semibold">
                      {formatCurrency(7300 * 12)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardHeader className="bg-finance-darkblue text-white">
              <CardTitle>Comparação de Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="Atual" fill="#0A1C45" />
                    <Bar dataKey="Sugerido" fill="#6C81AC" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-finance-navy text-white">
              <CardTitle>Fluxo de Caixa Real</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor (R$)</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="font-semibold">Renda</td>
                  </tr>
                  <tr>
                    <td>Salário</td>
                    <td>{formatCurrency(26525)}</td>
                    <td>85%</td>
                  </tr>
                  <tr>
                    <td>Consultoria</td>
                    <td>{formatCurrency(4500)}</td>
                    <td>15%</td>
                  </tr>
                  <tr className="font-semibold">
                    <td>Total</td>
                    <td>{formatCurrency(31025)}</td>
                    <td>100%</td>
                  </tr>
                  
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="font-semibold">Investimentos</td>
                  </tr>
                  <tr>
                    <td>Previdência Privada</td>
                    <td>{formatCurrency(2175)}</td>
                    <td>7%</td>
                  </tr>
                  <tr className="font-semibold">
                    <td>Total</td>
                    <td>{formatCurrency(2175)}</td>
                    <td>7%</td>
                  </tr>
                  
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="font-semibold">Gastos Fixos</td>
                  </tr>
                  {currentFixedExpenses.map((expense, index) => (
                    <tr key={index}>
                      <td>{expense.description}</td>
                      <td>{formatCurrency(expense.amount)}</td>
                      <td>{expense.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-finance-navy text-white">
              <CardTitle>Fluxo de Caixa Sugerido</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor (R$)</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="font-semibold">Renda</td>
                  </tr>
                  <tr>
                    <td>Salário</td>
                    <td>{formatCurrency(26525)}</td>
                    <td>85%</td>
                  </tr>
                  <tr>
                    <td>Consultoria</td>
                    <td>{formatCurrency(4500)}</td>
                    <td>15%</td>
                  </tr>
                  <tr className="font-semibold">
                    <td>Total</td>
                    <td>{formatCurrency(31025)}</td>
                    <td>100%</td>
                  </tr>
                  
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="font-semibold">Investimentos</td>
                  </tr>
                  <tr>
                    <td>Previdência Privada</td>
                    <td>{formatCurrency(2175)}</td>
                    <td>7%</td>
                  </tr>
                  <tr>
                    <td>Investimentos</td>
                    <td>{formatCurrency(2500)}</td>
                    <td>8%</td>
                  </tr>
                  <tr className="font-semibold">
                    <td>Total</td>
                    <td>{formatCurrency(4675)}</td>
                    <td>15%</td>
                  </tr>
                  
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="font-semibold">Gastos Fixos</td>
                  </tr>
                  {suggestedFixedExpenses.map((expense, index) => (
                    <tr key={index}>
                      <td>{expense.description}</td>
                      <td>{formatCurrency(expense.amount)}</td>
                      <td>{expense.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Budget;
