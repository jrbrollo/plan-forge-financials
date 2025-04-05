import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import type { CashFlow } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BudgetSummaryProps {
  currentExpenses: CashFlow['expenses'];
  suggestedExpenses: CashFlow['expenses'];
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  currentExpenses,
  suggestedExpenses
}) => {
  // Agrupar despesas por categoria
  const groupByCategory = (expenses: CashFlow['expenses']) => {
    const grouped: Record<string, { total: number; items: CashFlow['expenses'] }> = {};
    
    expenses.forEach(expense => {
      // Determinar a categoria a partir da propriedade category ou isEssential
      const categoryKey = expense.category || (expense.isEssential ? 'Essencial' : 'Não Essencial');
      
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = { total: 0, items: [] };
      }
      
      grouped[categoryKey].total += expense.amount;
      grouped[categoryKey].items.push(expense);
    });
    
    return grouped;
  };
  
  const currentGrouped = groupByCategory(currentExpenses);
  const suggestedGrouped = groupByCategory(suggestedExpenses);
  
  // Calcular totais
  const totalCurrent = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSuggested = suggestedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Obter todas as categorias únicas
  const allCategories = Array.from(new Set([
    ...Object.keys(currentGrouped),
    ...Object.keys(suggestedGrouped)
  ])).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Resumo do Orçamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Atual: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCurrent)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Sugerido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSuggested)}</span>
          </div>
        </div>
        
        {totalCurrent > totalSuggested && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Potencial de economia identificado</AlertTitle>
            <AlertDescription>
              Você pode economizar até {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCurrent - totalSuggested)} 
              ou {((totalCurrent - totalSuggested) / totalCurrent * 100).toFixed(1)}% 
              dos seus gastos mensais.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          {allCategories.map(category => {
            const currentAmount = currentGrouped[category]?.total || 0;
            const suggestedAmount = suggestedGrouped[category]?.total || 0;
            
            const currentPercentage = (currentAmount / totalCurrent * 100).toFixed(1);
            const suggestedPercentage = (suggestedAmount / totalSuggested * 100).toFixed(1);
            
            const difference = currentAmount - suggestedAmount;
            const potentialSavings = difference > 0;
            
            return (
              <div key={category} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{category}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">
                        Atual: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentAmount)} 
                        <span className="text-xs ml-1">({currentPercentage}%)</span>
                      </span>
                      
                      <span className="text-sm text-gray-500">
                        Sugerido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(suggestedAmount)}
                        <span className="text-xs ml-1">({suggestedPercentage}%)</span>
                      </span>
                    </div>
                  </div>
                  
                  {potentialSavings && (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <ChevronDown className="h-3 w-3" />
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(difference)}
                    </Badge>
                  )}
                  
                  {difference < 0 && (
                    <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                      <ChevronUp className="h-3 w-3" />
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(difference))}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 flex items-center">
                    <div 
                      className="h-2 bg-blue-500 rounded-l-full" 
                      style={{ width: `${currentPercentage}%` }}
                    ></div>
                    <div 
                      className="h-2 bg-green-500 rounded-r-full" 
                      style={{ width: `${suggestedPercentage}%` }}
                    ></div>
                  </div>
                  
                  {potentialSavings && (
                    <p className="text-xs text-gray-600">
                      Potencial de economia de {(difference / currentAmount * 100).toFixed(1)}% em {category}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
