
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { CashFlow } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CashFlowComparisonProps {
  currentCashFlow?: CashFlow;
  suggestedCashFlow?: CashFlow;
}

export const CashFlowComparison: React.FC<CashFlowComparisonProps> = ({
  currentCashFlow,
  suggestedCashFlow
}) => {
  const calculateTotals = (cashFlow?: CashFlow) => {
    if (!cashFlow) {
      return { income: 0, expenses: 0, balance: 0, savingsRate: 0 };
    }
    
    const totalIncome = cashFlow.income?.reduce((sum, inc) => sum + inc.amount, 0) || 0;
    const totalExpenses = cashFlow.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    
    return { income: totalIncome, expenses: totalExpenses, balance, savingsRate };
  };
  
  const essentialExpenses = (cashFlow?: CashFlow) => {
    if (!cashFlow) return { total: 0, percentage: 0, items: [] };
    
    const essentialItems = cashFlow.expenses?.filter(exp => 
      exp.isEssential || exp.category === 'Essencial' || exp.category === 'Moradia'
    ) || [];
    
    const total = essentialItems.reduce((sum, exp) => sum + exp.amount, 0);
    const allExpenses = cashFlow.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const percentage = allExpenses > 0 ? (total / allExpenses) * 100 : 0;
    
    return { total, percentage, items: essentialItems };
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const currentTotals = calculateTotals(currentCashFlow);
  const suggestedTotals = calculateTotals(suggestedCashFlow);
  
  const currentEssential = essentialExpenses(currentCashFlow);
  const suggestedEssential = essentialExpenses(suggestedCashFlow);
  
  // Verificar se há dados para exibir
  if (!currentCashFlow && !suggestedCashFlow) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Não há dados de fluxo de caixa disponíveis.</p>
        </CardContent>
      </Card>
    );
  }
  
  const CashFlowVisualizer = ({ title, totals, essential, cashFlow }: { 
    title: string, 
    totals: ReturnType<typeof calculateTotals>, 
    essential: ReturnType<typeof essentialExpenses>,
    cashFlow?: CashFlow
  }) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span>Receita Total</span>
          <span className="font-semibold">{formatCurrency(totals.income)}</span>
        </div>
        <Progress value={100} className="h-2 bg-green-100" />
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span>Despesas Essenciais</span>
          <span className="font-semibold">{formatCurrency(essential.total)}</span>
        </div>
        <Progress 
          value={totals.income > 0 ? (essential.total / totals.income) * 100 : 0} 
          className="h-2 bg-amber-100" 
        />
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span>Despesas Não Essenciais</span>
          <span className="font-semibold">{formatCurrency(totals.expenses - essential.total)}</span>
        </div>
        <Progress 
          value={totals.income > 0 ? ((totals.expenses - essential.total) / totals.income) * 100 : 0} 
          className="h-2 bg-red-100" 
        />
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span>Saldo</span>
          <span className={`font-semibold ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totals.balance)}
          </span>
        </div>
        <Progress 
          value={Math.min(Math.max(totals.balance > 0 ? (totals.balance / totals.income) * 100 : 0, 0), 100)} 
          className="h-2" 
        />
      </div>
      
      <div className="pt-4 border-t">
        <h4 className="font-medium mb-2">Detalhamento de Receitas</h4>
        <div className="space-y-2">
          {cashFlow?.income && cashFlow.income.length > 0 ? (
            cashFlow.income.map((income, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{income.description}</span>
                <span>{formatCurrency(income.amount)}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">Nenhuma receita registrada</div>
          )}
        </div>
      </div>
      
      {cashFlow?.expenses && cashFlow.expenses.length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Detalhamento de Despesas</h4>
          <div className="space-y-2">
            {cashFlow.expenses.map((expense, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{expense.description}</span>
                <span>{formatCurrency(expense.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Fluxo de Caixa</span>
          <Badge variant={currentTotals.balance >= 0 ? "outline" : "destructive"}>
            Taxa de Poupança: {currentTotals.savingsRate.toFixed(1)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CashFlowVisualizer 
            title="Fluxo Atual" 
            totals={currentTotals} 
            essential={currentEssential} 
            cashFlow={currentCashFlow}
          />
          
          {suggestedCashFlow && (
            <>
              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-gray-400" />
              </div>
              
              <CashFlowVisualizer 
                title="Fluxo Sugerido" 
                totals={suggestedTotals} 
                essential={suggestedEssential} 
                cashFlow={suggestedCashFlow}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
