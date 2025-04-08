import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ArrowLeft, AreaChart, LineChart, PieChart, BarChart3, TrendingUp, 
  TrendingDown, BarChart, Clock, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { ClientOverview } from "@/components/Dashboard/ClientOverview";
import { ClientFinancialSummary } from "@/components/Dashboard/ClientFinancialSummary";
import { ClientInsuranceStatus } from "@/components/Dashboard/ClientInsuranceStatus";
import { BudgetSummary } from "@/components/Dashboard/BudgetSummary";
import { CashFlowComparison } from "@/components/Dashboard/CashFlowComparison";
import { useClient } from '@/context/ClientContext';
import { getClientById } from '@/services/clientService';
import { 
  createFinancialPlanFromClient, 
  calculateFinancialHealth, 
  createInvestmentProjection,
  analyzeDebts
} from '@/services/financialService';
import type { FinancialPlan, FinancialHealth, InvestmentProjection, DebtAnalysis } from '@/lib/types';

const FinancialMetricCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend = 0,
  isCurrency = false
}: { 
  title: string; 
  value: number | string; 
  description: string; 
  icon: React.ReactNode; 
  trend?: number;
  isCurrency?: boolean;
}) => {
  const trendIcon = trend > 0 ? (
    <TrendingUp className="h-4 w-4 text-green-500" />
  ) : trend < 0 ? (
    <TrendingDown className="h-4 w-4 text-red-500" />
  ) : null;

  const formattedValue = typeof value === 'number' && isCurrency 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : value;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </span>
          {trendIcon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{formattedValue}</div>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};

const ClientDashboard = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { currentClient, setCurrentClient } = useClient();
  const [loading, setLoading] = useState(true);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);
  const [financialHealth, setFinancialHealth] = useState<FinancialHealth | null>(null);
  const [investmentProjection, setInvestmentProjection] = useState<InvestmentProjection | null>(null);
  const [debtAnalysis, setDebtAnalysis] = useState<DebtAnalysis | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!clientId) {
        navigate('/clients');
        return;
      }

      const client = getClientById(clientId);
      if (!client) {
        setLoading(false);
        return;
      }

      setCurrentClient(client);
      
      try {
        const plan = createFinancialPlanFromClient(client);
        setFinancialPlan(plan);
        
        console.log("Renda do cliente:", client.monthlyNetIncome || client.income || "Não definida");
        console.log("Plano financeiro com renda:", plan.currentCashFlow.income);
        
        const health = calculateFinancialHealth(client, plan);
        setFinancialHealth(health);
        
        const projection = createInvestmentProjection(client, plan);
        setInvestmentProjection(projection);
        
        const debtAnalysisResults = analyzeDebts(client, plan);
        setDebtAnalysis(debtAnalysisResults);
      } catch (error) {
        console.error("Erro ao processar dados financeiros:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [clientId, navigate, setCurrentClient]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-center items-center h-64">
            <p>Carregando dashboard financeiro...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentClient || !financialPlan) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Cliente não encontrado</h2>
              <p className="text-gray-500 mb-4">Não foi possível encontrar os dados deste cliente.</p>
              <Button onClick={() => navigate('/clients')}>
                Voltar para lista de clientes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-finance-navy">Dashboard Financeiro</h1>
            <p className="text-gray-600">Análise detalhada para {currentClient.name}</p>
          </div>
          
          <Button variant="outline" onClick={() => navigate(`/clients/${currentClient.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cliente
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <ClientOverview client={currentClient} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FinancialMetricCard 
            title="Saúde Financeira" 
            value={`${financialHealth?.overallScore || 0}/100`} 
            description={financialHealth?.overallStatus || 'Não avaliado'} 
            icon={<BarChart className="h-5 w-5 text-blue-500" />}
            trend={financialHealth?.scoreTrend || 0}
          />
          
          <FinancialMetricCard 
            title="Patrimônio Total" 
            value={financialHealth?.netWorth || 0} 
            description="Ativos totais menos d��vidas" 
            icon={<AreaChart className="h-5 w-5 text-green-500" />}
            isCurrency={true}
          />
          
          <FinancialMetricCard 
            title="Tempo p/ Aposentadoria" 
            value={investmentProjection?.yearsToRetirement || 0} 
            description={`Meta: R$ ${investmentProjection?.targetAmount?.toLocaleString('pt-BR') || 0}`} 
            icon={<Clock className="h-5 w-5 text-purple-500" />}
          />
        </div>
        
        {financialHealth?.emergencyFundStatus === 'insufficient' && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Reserva de Emergência Insuficiente</AlertTitle>
            <AlertDescription>
              A reserva atual cobre apenas {financialHealth.emergencyFundMonths} meses de despesas. 
              Recomendamos ter entre 3 e 6 meses de despesas guardados.
            </AlertDescription>
          </Alert>
        )}
        
        {debtAnalysis?.highInterestDebts && debtAnalysis.highInterestDebts.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Dívidas com Juros Altos</AlertTitle>
            <AlertDescription>
              {debtAnalysis.highInterestDebts.length} dívidas com taxas acima de 15% ao ano. 
              Considere renegociar ou quitar com prioridade.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="cash-flow" className="w-full mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="cash-flow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="budget">Orçamento</TabsTrigger>
            <TabsTrigger value="goals">Objetivos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cash-flow">
            <CashFlowComparison 
              currentCashFlow={financialPlan.currentCashFlow} 
              suggestedCashFlow={financialPlan.suggestedCashFlow} 
            />
          </TabsContent>
          
          <TabsContent value="budget">
            <BudgetSummary
              currentExpenses={financialPlan.currentCashFlow.expenses}
              suggestedExpenses={financialPlan.suggestedCashFlow.expenses}
            />
          </TabsContent>
          
          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Objetivos Financeiros</CardTitle>
                <CardDescription>
                  Acompanhamento do progresso de cada objetivo financeiro
                </CardDescription>
              </CardHeader>
              <CardContent>
                {financialPlan.financialGoals.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Nenhum objetivo financeiro definido</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {financialPlan.financialGoals.map((goal, index) => {
                      const progress = goal.currentSavings / goal.targetAmount * 100;
                      const targetDate = new Date(goal.targetDate);
                      const today = new Date();
                      const monthsLeft = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                        (targetDate.getMonth() - today.getMonth());
                      
                      return (
                        <div key={index} className="border p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{goal.description}</h3>
                              <p className="text-sm text-gray-500">
                                Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.targetAmount)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                {monthsLeft <= 0 ? 'Prazo vencido' : `${monthsLeft} meses restantes`}
                              </span>
                              <p className="text-sm text-gray-500">
                                Data alvo: {targetDate.toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div 
                              className={`h-2.5 rounded-full ${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'}`} 
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span>
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.currentSavings)} 
                              acumulado
                            </span>
                            <span>
                              {progress.toFixed(0)}% completo
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 text-blue-500 mr-2" />
                Composição de Ativos
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex flex-col h-full justify-center items-center">
                {financialPlan.assets.length === 0 ? (
                  <p className="text-gray-500">Nenhum ativo registrado</p>
                ) : (
                  <div className="w-full">
                    {financialPlan.assets.map((asset, index) => {
                      const percentage = asset.currentValue / 
                        financialPlan.assets.reduce((sum, a) => sum + a.currentValue, 0) * 100;
                      
                      return (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span>{asset.description}</span>
                            <span>
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(asset.currentValue)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-blue-600" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 text-green-500 mr-2" />
                Projeção de Patrimônio
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex flex-col h-full justify-center items-center">
                {investmentProjection ? (
                  <div className="w-full">
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Em 5 anos:</h3>
                      <p className="text-2xl font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investmentProjection.projectedValue5Years)}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Em 10 anos:</h3>
                      <p className="text-2xl font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investmentProjection.projectedValue10Years)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Em 20 anos:</h3>
                      <p className="text-2xl font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investmentProjection.projectedValue20Years)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Dados insuficientes para projeção</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
