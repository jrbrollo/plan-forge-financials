
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense, Income } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BudgetDashboardProps {
  incomes: Income[];
  expenses: Expense[];
}

export function BudgetDashboard({ incomes, expenses }: BudgetDashboardProps) {
  // Calcular totais
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Dados para o gráfico de despesas por categoria
  const expensesByCategory = expenses.map(expense => ({
    name: expense.description,
    value: expense.amount,
    percentage: expense.percentage
  }));

  // Cores para o gráfico
  const EXPENSE_COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#8AC926', '#1982C4', '#6A4C93', '#F4A261', '#E76F51', '#457B9D',
    '#84A98C', '#D62828', '#588157'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Resumo do Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Receitas Totais:</span>
              <span className="font-bold text-green-600">
                R$ {totalIncome.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Despesas Totais:</span>
              <span className="font-bold text-red-600">
                R$ {totalExpenses.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span>Saldo:</span>
              <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {balance.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span>Percentual Economizado:</span>
              <span className="font-bold">
                {balance > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribuição de Despesas</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} 
                labelFormatter={(name) => `${name}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
