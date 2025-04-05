
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Landmark, 
  CreditCard, 
  TrendingUp, 
  BarChart, 
  PiggyBank, 
  ShieldAlert 
} from 'lucide-react';
import type { Client, FinancialPlan, FinancialHealth } from '@/lib/types';

interface ClientFinancialSummaryProps {
  client: Client;
  financialPlan?: FinancialPlan;
  financialHealth?: FinancialHealth;
}

export const ClientFinancialSummary: React.FC<ClientFinancialSummaryProps> = ({ 
  client, 
  financialPlan, 
  financialHealth 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Calcular totais
  const totalIncome = financialPlan?.currentCashFlow?.income?.reduce((sum, income) => sum + income.amount, 0) || 0;
  const totalAssets = financialPlan?.assets?.reduce((sum, asset) => sum + asset.currentValue, 0) || 0;
  const totalDebts = financialPlan?.debts?.reduce((sum, debt) => sum + debt.currentValue, 0) || 0;
  const totalExpenses = financialPlan?.currentCashFlow?.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  
  // Calcular métricas
  const debtToAssetRatio = totalAssets > 0 ? (totalDebts / totalAssets) * 100 : 0;
  const expenseToIncomeRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const emergencyFundProgress = financialPlan?.emergencyFundTarget > 0 
    ? (financialPlan?.emergencyFund / financialPlan?.emergencyFundTarget) * 100 
    : 0;

  // Classificar saúde financeira
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  // Status de alertas
  const hasHighDebtRatio = debtToAssetRatio > 50;
  const hasLowSavingsRate = financialHealth?.savingsRate < 10;
  const hasLowEmergencyFund = financialHealth?.emergencyFundMonths < 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Landmark className="h-5 w-5 text-blue-500 mr-2" />
          Resumo Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pontuação de Saúde Financeira */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center">
                <BarChart className="h-4 w-4 text-blue-500 mr-2" />
                Saúde Financeira
              </h3>
              <span className={`text-lg font-bold ${getScoreColor(financialHealth?.overallScore || 0)}`}>
                {financialHealth?.overallScore}/100
              </span>
            </div>
            <Progress 
              value={financialHealth?.overallScore || 0} 
              className="h-2 mb-2" 
            />
            <p className="text-sm text-gray-600">
              Sua saúde financeira está classificada como <span className="font-medium">{financialHealth?.overallStatus || "Não avaliada"}</span>
            </p>
          </div>

          {/* Patrimônio Líquido */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center">
                <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                Patrimônio Líquido
              </h3>
              <span className={`text-lg font-bold ${financialHealth?.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financialHealth?.netWorth || (totalAssets - totalDebts))}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Ativos</p>
                <p className="font-medium">{formatCurrency(totalAssets)}</p>
              </div>
              <div>
                <p className="text-gray-500">Dívidas</p>
                <p className="font-medium">{formatCurrency(totalDebts)}</p>
              </div>
            </div>
          </div>

          {/* Taxa de Poupança */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center">
                <PiggyBank className="h-4 w-4 text-purple-500 mr-2" />
                Taxa de Poupança
              </h3>
              <span className={`text-lg font-bold ${financialHealth?.savingsRate >= 15 ? 'text-green-600' : 
                financialHealth?.savingsRate >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                {(financialHealth?.savingsRate || ((totalIncome - totalExpenses) / totalIncome * 100) || 0).toFixed(1)}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Renda</p>
                <p className="font-medium">{formatCurrency(totalIncome || client.monthlyNetIncome || client.income || 0)}</p>
              </div>
              <div>
                <p className="text-gray-500">Despesas</p>
                <p className="font-medium">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
            <Progress 
              value={Math.min(financialHealth?.savingsRate * 2.5 || ((totalIncome - totalExpenses) / totalIncome * 100 * 2.5) || 0, 100)}
              className="h-1 mt-2" 
            />
          </div>

          {/* Reserva de Emergência */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center">
                <ShieldAlert className="h-4 w-4 text-amber-500 mr-2" />
                Reserva de Emergência
              </h3>
              <span className={`text-lg font-bold ${financialHealth?.emergencyFundMonths >= 3 ? 'text-green-600' : 'text-amber-600'}`}>
                {(financialHealth?.emergencyFundMonths || 0).toFixed(1)} meses
              </span>
            </div>
            <Progress 
              value={Math.min(financialHealth?.emergencyFundMonths * 100 / 6 || 0, 100)}
              className="h-2 mb-2" 
            />
            <p className="text-sm text-gray-600">
              Meta: 6 meses • Atual: {formatCurrency(financialPlan?.emergencyFund || 0)}
            </p>
          </div>

          {/* Proporção de Dívidas */}
          <div className="col-span-1 md:col-span-2 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium flex items-center">
                <CreditCard className="h-4 w-4 text-red-500 mr-2" />
                Dívidas
              </h3>
              <span className={`text-sm font-medium ${hasHighDebtRatio ? 'text-red-600' : 'text-green-600'}`}>
                {(financialHealth?.debtToIncomeRatio || (totalDebts / totalIncome) || 0).toFixed(2)}x da renda mensal
              </span>
            </div>
            
            {!financialPlan?.debts || financialPlan.debts.length === 0 ? (
              <p className="text-sm text-green-600">Você não possui dívidas registradas!</p>
            ) : (
              <div className="space-y-3">
                {financialPlan?.debts?.map((debt, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">{debt.description}</span>
                        {debt.interestRate > 0.15 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                            Juros altos
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(debt.currentValue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${debt.interestRate > 0.15 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${(debt.currentValue / totalDebts) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Pagamento: {formatCurrency(debt.monthlyPayment)}/mês</span>
                      <span>Taxa: {(debt.interestRate * 100).toFixed(1)}% a.a.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alertas */}
        {(hasHighDebtRatio || hasLowSavingsRate || hasLowEmergencyFund) && (
          <div className="mt-6 space-y-3">
            <h3 className="font-medium">Pontos de Atenção</h3>
            {hasHighDebtRatio && (
              <p className="text-sm text-red-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sua proporção de dívidas está acima do recomendado (50% dos ativos)
              </p>
            )}
            {hasLowSavingsRate && (
              <p className="text-sm text-amber-600 flex items-center">
                <PiggyBank className="h-4 w-4 mr-2" />
                Sua taxa de poupança está abaixo do recomendado (15% da renda)
              </p>
            )}
            {hasLowEmergencyFund && (
              <p className="text-sm text-amber-600 flex items-center">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Sua reserva de emergência está abaixo do recomendado (3-6 meses de despesas)
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
