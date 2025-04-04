
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from '@/lib/types';

interface BudgetSummaryProps {
  currentExpenses: Expense[];
  suggestedExpenses: Expense[];
}

export function BudgetSummary({ currentExpenses, suggestedExpenses }: BudgetSummaryProps) {
  // Calculate totals
  const currentTotal = currentExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const suggestedTotal = suggestedExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const difference = suggestedTotal - currentTotal;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="finance-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-finance-navy">Budget Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Current</th>
                <th>Suggested</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">Fixed Expenses</td>
                <td>{formatCurrency(currentExpenses.filter(e => e.category === 'fixed').reduce((acc, curr) => acc + curr.amount, 0))}</td>
                <td>{formatCurrency(suggestedExpenses.filter(e => e.category === 'fixed').reduce((acc, curr) => acc + curr.amount, 0))}</td>
                <td className={`${suggestedExpenses.filter(e => e.category === 'fixed').reduce((acc, curr) => acc + curr.amount, 0) - currentExpenses.filter(e => e.category === 'fixed').reduce((acc, curr) => acc + curr.amount, 0) < 0 ? 'text-finance-green' : 'text-finance-red'}`}>
                  {formatCurrency(suggestedExpenses.filter(e => e.category === 'fixed').reduce((acc, curr) => acc + curr.amount, 0) - currentExpenses.filter(e => e.category === 'fixed').reduce((acc, curr) => acc + curr.amount, 0))}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Variable Expenses</td>
                <td>{formatCurrency(currentExpenses.filter(e => e.category === 'variable').reduce((acc, curr) => acc + curr.amount, 0))}</td>
                <td>{formatCurrency(suggestedExpenses.filter(e => e.category === 'variable').reduce((acc, curr) => acc + curr.amount, 0))}</td>
                <td className={`${suggestedExpenses.filter(e => e.category === 'variable').reduce((acc, curr) => acc + curr.amount, 0) - currentExpenses.filter(e => e.category === 'variable').reduce((acc, curr) => acc + curr.amount, 0) < 0 ? 'text-finance-green' : 'text-finance-red'}`}>
                  {formatCurrency(suggestedExpenses.filter(e => e.category === 'variable').reduce((acc, curr) => acc + curr.amount, 0) - currentExpenses.filter(e => e.category === 'variable').reduce((acc, curr) => acc + curr.amount, 0))}
                </td>
              </tr>
              <tr className="font-semibold">
                <td>Total</td>
                <td>{formatCurrency(currentTotal)}</td>
                <td>{formatCurrency(suggestedTotal)}</td>
                <td className={`${difference < 0 ? 'text-finance-green' : 'text-finance-red'}`}>{formatCurrency(difference)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
