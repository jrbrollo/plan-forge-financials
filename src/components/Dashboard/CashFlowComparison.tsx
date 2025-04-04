
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { CashFlow } from '@/lib/types';

interface CashFlowComparisonProps {
  currentCashFlow: CashFlow;
  suggestedCashFlow: CashFlow;
}

export function CashFlowComparison({ currentCashFlow, suggestedCashFlow }: CashFlowComparisonProps) {
  const COLORS = ['#0A1C45', '#6C81AC', '#38A169'];

  const currentData = [
    { name: 'Fixed Expenses', value: currentCashFlow.expenses.filter(e => e.category === 'fixed').reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Variable Expenses', value: currentCashFlow.expenses.filter(e => e.category === 'variable').reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Investments', value: currentCashFlow.investments },
  ];

  const suggestedData = [
    { name: 'Fixed Expenses', value: suggestedCashFlow.expenses.filter(e => e.category === 'fixed').reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Variable Expenses', value: suggestedCashFlow.expenses.filter(e => e.category === 'variable').reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Investments', value: suggestedCashFlow.investments },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="finance-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-finance-navy">Current Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between py-1">
              <span>Total Income:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(currentCashFlow.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Total Expenses:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(currentCashFlow.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-t">
              <span>Balance:</span>
              <span className={`font-semibold ${currentCashFlow.balance >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(currentCashFlow.balance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="finance-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-finance-navy">Suggested Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={suggestedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {suggestedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between py-1">
              <span>Total Income:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(suggestedCashFlow.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Total Expenses:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(suggestedCashFlow.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-t">
              <span>Balance:</span>
              <span className={`font-semibold ${suggestedCashFlow.balance >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(suggestedCashFlow.balance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
