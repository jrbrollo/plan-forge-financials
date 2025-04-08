import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowLeft, Calculator, RefreshCw, AlertCircle, TrendingUp, Calendar, DollarSign, Plus, Trash } from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RetirementPlan, LiquidityEvent, Client } from '@/lib/types';

const Retirement = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { currentClient, isLoading, error, loadClientById } = useClient();
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estados para os campos de input
  const [initialInvestment, setInitialInvestment] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(3000);
  const [contributionIncreaseRate, setContributionIncreaseRate] = useState<number>(0); // Aumento anual do aporte em %
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(8); // 8% ao ano
  const [inflationRate, setInflationRate] = useState<number>(4); // 4% ao ano
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState<number>(20000);
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  
  // Estado para o plano de aposentadoria calculado
  const [retirementPlan, setRetirementPlan] = useState<RetirementPlan | null>(null);
  const [liquidityEvents, setLiquidityEvents] = useState<LiquidityEvent[]>([]);

  // Carrega dados do cliente se disponível
  useEffect(() => {
    const loadClientData = async () => {
      if (clientId) {
        setLoading(true);
        const client = await loadClientById(clientId);
        
        if (client) {
          // Preencher dados iniciais com base no cliente
          if (client.age) setCurrentAge(client.age);
          if (client.financialProfile?.retirementAge) setRetirementAge(client.financialProfile.retirementAge);
          if (client.monthlyNetIncome) setTargetMonthlyIncome(client.monthlyNetIncome * 0.7); // 70% da renda atual
          
          // Verificar se o cliente tem investimentos
          if (client.totalInvestments) {
            setInitialInvestment(client.totalInvestments);
          }
          
          // Estimar aporte mensal baseado na renda atual
          if (client.monthlyNetIncome) {
            setMonthlyContribution(client.monthlyNetIncome * 0.15); // 15% da renda atual
          }
        }
        
        setLoading(false);
      }
      
      // Calcula o plano de aposentadoria inicialmente
      calculateRetirementPlan();
    };

    loadClientData();
  }, [clientId]);

  // Função para adicionar um evento de liquidez
  const addLiquidityEvent = () => {
    const currentYear = new Date().getFullYear();
    const defaultEventYear = currentYear + 5;
    const defaultEventAge = currentAge + 5;
    
    const newEvent: LiquidityEvent = {
      description: '',
      amount: 0,
      date: `${defaultEventYear}-01-01`,
      year: defaultEventYear,
      age: defaultEventAge
    };
    
    setLiquidityEvents([...liquidityEvents, newEvent]);
  };
  
  // Função para remover um evento de liquidez
  const removeLiquidityEvent = (index: number) => {
    const updatedEvents = [...liquidityEvents];
    updatedEvents.splice(index, 1);
    setLiquidityEvents(updatedEvents);
  };
  
  // Função para atualizar um evento de liquidez
  const updateLiquidityEvent = (index: number, field: keyof LiquidityEvent, value: string | number) => {
    const updatedEvents = [...liquidityEvents];
    const event = {...updatedEvents[index]};
    
    if (field === 'date') {
      const date = new Date(value as string);
      const year = date.getFullYear();
      const age = currentAge + (year - new Date().getFullYear());
      
      event.date = value as string;
      event.year = year;
      event.age = age;
    } else if (field === 'amount') {
      event.amount = value as number;
    } else if (field === 'description') {
      event.description = value as string;
    }
    
    updatedEvents[index] = event;
    setLiquidityEvents(updatedEvents);
  };

  // Função para calcular o plano de aposentadoria
  const calculateRetirementPlan = () => {
    // Cálculos para o plano de aposentadoria
    const yearsToRetirement = retirementAge - currentAge;
    const remainingLifespan = lifeExpectancy - retirementAge;
    
    // Taxa de retorno real (descontando a inflação)
    const realReturnRate = ((1 + expectedReturnRate / 100) / (1 + inflationRate / 100) - 1) * 100;
    
    // Capital necessário para gerar a renda desejada (regra dos 4%)
    // Fórmula: rendaMensal * 12 / (taxa de retirada segura de 4%)
    const requiredCapital = (targetMonthlyIncome * 12) / 0.04;
    
    let currentSavings = initialInvestment;
    let financialIndependenceAge = currentAge;
    let financialIndependenceReached = false;
    let currentMonthlyContribution = monthlyContribution;
    
    // Ordenar eventos de liquidez por data
    const sortedLiquidityEvents = [...liquidityEvents].sort((a, b) => a.year - b.year);
    
    // Criar projeção ano a ano
    const projectedYearlyData = [];
    
    for (let year = 0; year <= lifeExpectancy - currentAge; year++) {
      const age = currentAge + year;
      const yearNumber = new Date().getFullYear() + year;
      
      // Verificar se há eventos de liquidez neste ano
      const eventsThisYear = sortedLiquidityEvents.filter(event => event.year === yearNumber);
      const liquidityAmount = eventsThisYear.reduce((sum, event) => sum + event.amount, 0);
      
      // Se estiver antes da aposentadoria, adiciona contribuições mensais
      if (age < retirementAge) {
        // Retorno anual dos investimentos (sem considerar aportes)
        const annualReturn = currentSavings * (expectedReturnRate / 100);
        
        // Soma dos aportes mensais durante o ano
        const annualContribution = currentMonthlyContribution * 12;
        
        // Atualiza o saldo considerando retorno, aportes e eventos de liquidez
        currentSavings = currentSavings + annualReturn + annualContribution + liquidityAmount;
        
        // Aumenta o aporte mensal conforme a taxa de aumento definida
        if (contributionIncreaseRate > 0) {
          currentMonthlyContribution *= (1 + contributionIncreaseRate / 100);
        }
      } else {
        // Após a aposentadoria, retira a renda mensal e considera apenas o retorno sobre o saldo restante
        const annualWithdrawal = targetMonthlyIncome * 12;
        const annualReturn = currentSavings * (expectedReturnRate / 100);
        
        // Atualiza o saldo considerando retorno, retiradas e eventos de liquidez
        currentSavings = currentSavings + annualReturn - annualWithdrawal + liquidityAmount;
      }
      
      // Calcula o potencial de retirada mensal usando a regra dos 4%
      const withdrawalPotential = (currentSavings * 0.04) / 12;
      
      // Verifica se alcançou a independência financeira
      if (!financialIndependenceReached && withdrawalPotential >= targetMonthlyIncome) {
        financialIndependenceAge = age;
        financialIndependenceReached = true;
      }
      
      // Adiciona dados do ano à projeção
      projectedYearlyData.push({
        age,
        year: yearNumber,
        savingsBalance: Math.max(0, currentSavings),
        contributionsToDate: year > 0 
          ? projectedYearlyData[year - 1].contributionsToDate + (age < retirementAge ? currentMonthlyContribution * 12 / (1 + contributionIncreaseRate / 100) : 0)
          : initialInvestment + (age < retirementAge ? currentMonthlyContribution * 12 : 0),
        returnToDate: Math.max(0, currentSavings) - (year > 0 
          ? projectedYearlyData[year - 1].contributionsToDate + (age < retirementAge ? currentMonthlyContribution * 12 / (1 + contributionIncreaseRate / 100) : 0)
          : initialInvestment + (age < retirementAge ? currentMonthlyContribution * 12 : 0)),
        withdrawalPotential,
        monthlyContribution: currentMonthlyContribution
      });
      
      // Se o saldo ficar negativo após a aposentadoria, interrompe a projeção
      if (currentSavings <= 0 && age >= retirementAge) {
        break;
      }
    }
    
    // Cria o objeto do plano de aposentadoria
    const plan: RetirementPlan = {
      initialInvestment,
      monthlyContribution,
      contributionIncreaseRate,
      expectedReturnRate,
      inflationRate,
      currentAge,
      retirementAge,
      lifeExpectancy,
      targetMonthlyIncome,
      currentSavings: initialInvestment,
      projectedSavings: projectedYearlyData[retirementAge - currentAge]?.savingsBalance || 0,
      yearsToRetirement,
      financialIndependenceAge,
      liquidityEvents: sortedLiquidityEvents,
      projectedYearlyData
    };
    
    setRetirementPlan(plan);
  };
  
  // Calcula plano quando os inputs mudam
  useEffect(() => {
    calculateRetirementPlan();
  }, [
    initialInvestment, 
    monthlyContribution,
    contributionIncreaseRate, 
    expectedReturnRate, 
    inflationRate,
    targetMonthlyIncome,
    currentAge,
    retirementAge,
    lifeExpectancy,
    liquidityEvents
  ]);
  
  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Formatar porcentagem
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2461]">Planejamento de Aposentadoria</h1>
            <p className="text-gray-600">Planeje e acompanhe os objetivos de aposentadoria do cliente.</p>
          </div>
          
          {clientId && (
            <Button variant="outline" size="sm" onClick={() => navigate(`/clients/${clientId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Cliente
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="simulation" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="simulation">Simulação</TabsTrigger>
            <TabsTrigger value="inputs">Dados de Entrada</TabsTrigger>
            <TabsTrigger value="projection">Projeção Anual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Resumo do Plano de Aposentadoria */}
              <Card className="border rounded-lg overflow-hidden">
                <div className="bg-[#0c2461] text-white p-4">
                  <h2 className="text-xl font-semibold">Resumo do Plano</h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between mb-2">
                        <span>Progresso até o objetivo</span>
                        <span>
                          {retirementPlan && 
                            ((retirementPlan.currentSavings / retirementPlan.projectedSavings) * 100).toFixed(1)
                          }%
                        </span>
                      </div>
                      <Progress 
                        value={
                          retirementPlan ? 
                            Math.min(100, (retirementPlan.currentSavings / retirementPlan.projectedSavings) * 100) : 
                            0
                        } 
                        className="h-2 bg-gray-200" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Poupança Atual</p>
                        <p className="text-2xl font-bold text-[#0c2461]">
                          {formatCurrency(initialInvestment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Capital Necessário</p>
                        <p className="text-2xl font-bold">
                          {retirementPlan && formatCurrency(retirementPlan.projectedSavings)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Anos até a Aposentadoria</p>
                        <p className="text-2xl font-bold">
                          {retirementPlan && retirementPlan.yearsToRetirement} anos
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Renda Mensal Desejada</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(targetMonthlyIncome)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">Contribuição Mensal</p>
                      <p className="text-xl font-semibold">
                        {formatCurrency(monthlyContribution)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Indicadores de Independência Financeira */}
              <Card className="border rounded-lg overflow-hidden">
                <div className="bg-[#0c2461] text-white p-4">
                  <h2 className="text-xl font-semibold">Independência Financeira</h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {retirementPlan && retirementPlan.financialIndependenceAge < lifeExpectancy ? (
                      <>
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-gray-500 mb-2">Idade para Independência Financeira</p>
                            <div className="text-5xl font-bold text-[#0c2461]">
                              {retirementPlan?.financialIndependenceAge}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              anos
                            </p>
                          </div>
                        </div>
                        
                        <Alert variant="default" className="bg-green-50 border-green-200">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-800">Objetivo Alcançável</AlertTitle>
                          <AlertDescription className="text-green-700">
                            Com seu plano atual, você alcançará sua renda passiva desejada 
                            {retirementPlan?.financialIndependenceAge < retirementPlan?.retirementAge ? 
                              ` ${retirementPlan?.retirementAge - retirementPlan?.financialIndependenceAge} anos antes da aposentadoria planejada.` : 
                              ` aos ${retirementPlan?.financialIndependenceAge} anos.`
                            }
                          </AlertDescription>
                        </Alert>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-gray-500 mb-2">Renda Mensal Estimada na Aposentadoria</p>
                            <div className="text-4xl font-bold text-amber-600">
                              {retirementPlan && formatCurrency(retirementPlan.projectedYearlyData[retirementAge - currentAge]?.withdrawalPotential || 0)}
                            </div>
                            <p className="text-sm text-amber-600 mt-2">
                              ({retirementPlan && 
                                Math.round(
                                  (retirementPlan.projectedYearlyData[retirementAge - currentAge]?.withdrawalPotential || 0) / 
                                  targetMonthlyIncome * 100
                                )
                              }% do objetivo)
                            </p>
                          </div>
                        </div>
                        
                        <Alert className="bg-amber-50 border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertTitle className="text-amber-800">Ajustes Necessários</AlertTitle>
                          <AlertDescription className="text-amber-700">
                            Com o plano atual, você não atingirá sua renda passiva desejada até a aposentadoria. 
                            Considere aumentar seu aporte mensal ou o aporte inicial.
                          </AlertDescription>
                        </Alert>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Aporte Mensal Necessário</span>
                        <span className="text-sm font-semibold">
                          {retirementPlan && formatCurrency(
                            // Cálculo aproximado do aporte mensal necessário para atingir o objetivo
                            (((targetMonthlyIncome * 12) / 0.04) - initialInvestment) / 
                            (retirementAge - currentAge) / 12
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Aporte Inicial Adicional Necessário</span>
                        <span className="text-sm font-semibold">
                          {retirementPlan && formatCurrency(
                            Math.max(0, ((targetMonthlyIncome * 12) / 0.04) - initialInvestment - (monthlyContribution * 12 * (retirementAge - currentAge)))
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Gráfico de Projeção */}
            <Card className="border rounded-lg overflow-hidden mb-6">
              <div className="bg-[#0c2461] text-white p-4">
                <h2 className="text-xl font-semibold">Projeção de Poupança para Aposentadoria</h2>
              </div>
              <CardContent className="p-4">
                <div className="h-80">
                  {retirementPlan && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={retirementPlan.projectedYearlyData.filter(
                          d => d.age <= retirementAge + 5 && d.age >= currentAge
                        )}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="age" 
                          label={{ value: 'Idade', position: 'insideBottomRight', offset: -10 }} 
                        />
                        <YAxis 
                          tickFormatter={(value) => `${value / 1000000}M`}
                          label={{ value: 'R$', angle: -90, position: 'insideLeft' }} 
                        />
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))} 
                          labelFormatter={(value) => `Idade: ${value} anos`}
                        />
                        <Legend />
                        <ReferenceLine
                          x={retirementPlan.retirementAge}
                          stroke="red"
                          strokeDasharray="3 3"
                          label={{ value: 'Aposentadoria', position: 'insideTopRight' }}
                        />
                        <ReferenceLine
                          x={retirementPlan.financialIndependenceAge}
                          stroke="green"
                          strokeDasharray="3 3"
                          label={{ value: 'Independência', position: 'insideTopLeft' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="savingsBalance" 
                          stroke="#2B4C91" 
                          name="Saldo Projetado" 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="contributionsToDate" 
                          stroke="#38A169" 
                          name="Total Contribuído" 
                          strokeWidth={1}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inputs">
            <Card className="border rounded-lg overflow-hidden mb-6">
              <div className="bg-[#0c2461] text-white p-4">
                <h2 className="text-xl font-semibold">Parâmetros de Simulação</h2>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {/* Parâmetros Financeiros */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Parâmetros Financeiros</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="initial-investment">Aporte Inicial (R$)</Label>
                            <span className="text-sm font-medium">{formatCurrency(initialInvestment)}</span>
                          </div>
                          <Input 
                            id="initial-investment"
                            type="number"
                            value={initialInvestment}
                            onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="monthly-contribution">Aporte Mensal (R$)</Label>
                            <span className="text-sm font-medium">{formatCurrency(monthlyContribution)}</span>
                          </div>
                          <Input 
                            id="monthly-contribution"
                            type="number"
                            value={monthlyContribution}
                            onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="contribution-increase">Aumento Anual do Aporte (% a.a.)</Label>
                            <span className="text-sm font-medium">{formatPercentage(contributionIncreaseRate)}</span>
                          </div>
                          <div className="pt-2">
                            <Slider 
                              id="contribution-increase"
                              value={[contributionIncreaseRate]} 
                              min={0} 
                              max={20} 
                              step={0.5}
                              onValueChange={(value) => setContributionIncreaseRate(value[0])}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="expected-return">Rentabilidade Esperada (% a.a.)</Label>
                            <span className="text-sm font-medium">{formatPercentage(expectedReturnRate)}</span>
                          </div>
                          <div className="pt-2">
                            <Slider 
                              id="expected-return"
                              value={[expectedReturnRate]} 
                              min={0} 
                              max={15} 
                              step={0.1}
                              onValueChange={(value) => setExpectedReturnRate(value[0])}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="inflation-rate">Inflação Esperada (% a.a.)</Label>
                            <span className="text-sm font-medium">{formatPercentage(inflationRate)}</span>
                          </div>
                          <div className="pt-2">
                            <Slider 
                              id="inflation-rate"
                              value={[inflationRate]} 
                              min={0} 
                              max={10} 
                              step={0.1}
                              onValueChange={(value) => setInflationRate(value[0])}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="target-income">Renda Mensal Desejada (R$)</Label>
                            <span className="text-sm font-medium">{formatCurrency(targetMonthlyIncome)}</span>
                          </div>
                          <Input 
                            id="target-income"
                            type="number"
                            value={targetMonthlyIncome}
                            onChange={(e) => setTargetMonthlyIncome(Math.max(0, Number(e.target.value)))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Parâmetros de Idade */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Parâmetros de Idade</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="current-age">Idade Atual</Label>
                            <span className="text-sm font-medium">{currentAge} anos</span>
                          </div>
                          <Input 
                            id="current-age"
                            type="number"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(Math.max(18, Math.min(retirementAge - 1, Number(e.target.value))))}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="retirement-age">Idade de Aposentadoria</Label>
                            <span className="text-sm font-medium">{retirementAge} anos</span>
                          </div>
                          <Input 
                            id="retirement-age"
                            type="number"
                            value={retirementAge}
                            onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Math.min(lifeExpectancy - 1, Number(e.target.value))))}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="life-expectancy">Expectativa de Vida</Label>
                            <span className="text-sm font-medium">{lifeExpectancy} anos</span>
                          </div>
                          <Input 
                            id="life-expectancy"
                            type="number"
                            value={lifeExpectancy}
                            onChange={(e) => setLifeExpectancy(Math.max(retirementAge + 1, Number(e.target.value)))}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="pt-6">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-blue-800 font-medium flex items-center gap-2">
                              <Calculator size={16} />
                              Retorno Real Esperado
                            </h4>
                            <p className="text-blue-700 text-sm mt-1">
                              Considerando uma inflação de {formatPercentage(inflationRate)} e rentabilidade de {formatPercentage(expectedReturnRate)}, 
                              o retorno real esperado é de aproximadamente{' '}
                              <strong>
                                {formatPercentage(((1 + expectedReturnRate / 100) / (1 + inflationRate / 100) - 1) * 100)}
                              </strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Eventos de Liquidez</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Adicione eventos futuros de entrada ou saída de valores significativos (venda de imóveis, recebimento de bônus, herança, etc.)
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    {liquidityEvents.length === 0 ? (
                      <div className="text-center p-6 border border-dashed rounded-lg">
                        <p className="text-gray-500">Nenhum evento de liquidez adicionado</p>
                      </div>
                    ) : (
                      liquidityEvents.map((event, index) => (
                        <div key={index} className="flex gap-4 items-center p-4 border rounded-lg">
                          <div className="flex-1">
                            <Label htmlFor={`event-desc-${index}`} className="mb-1 block">Descrição</Label>
                            <Input
                              id={`event-desc-${index}`}
                              value={event.description}
                              onChange={(e) => updateLiquidityEvent(index, 'description', e.target.value)}
                              placeholder="Ex: Venda de imóvel"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <Label htmlFor={`event-amount-${index}`} className="mb-1 block">Valor (R$)</Label>
                            <Input
                              id={`event-amount-${index}`}
                              type="number"
                              value={event.amount}
                              onChange={(e) => updateLiquidityEvent(index, 'amount', Number(e.target.value))}
                              placeholder="Valor"
                              className={event.amount < 0 ? 'text-red-500' : 'text-green-500'}
                            />
                          </div>
                          
                          <div className="flex-1">
                            <Label htmlFor={`event-date-${index}`} className="mb-1 block">Data</Label>
                            <Input
                              id={`event-date-${index}`}
                              type="date"
                              value={event.date}
                              onChange={(e) => updateLiquidityEvent(index, 'date', e.target.value)}
                            />
                          </div>
                          
                          <div className="flex-initial flex items-end">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeLiquidityEvent(index)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={addLiquidityEvent}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Evento de Liquidez
                  </Button>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    className="bg-[#0c2461] hover:bg-[#163a8a]"
                    onClick={calculateRetirementPlan}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recalcular Projeção
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border rounded-lg overflow-hidden mb-6">
              <div className="bg-[#0c2461] text-white p-4">
                <h2 className="text-xl font-semibold">Informações para o Planejador</h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Essas informações auxiliam o planejador a orientar o cliente sobre seu plano de aposentadoria.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 border border-blue-100 bg-blue-50">
                      <h3 className="font-medium text-blue-800 flex items-center gap-2">
                        <Calendar size={16} />
                        Tempo para Independência Financeira
                      </h3>
                      <p className="text-2xl font-bold text-blue-700 mt-2">
                        {retirementPlan && retirementPlan.financialIndependenceAge - currentAge} anos
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        (aos {retirementPlan?.financialIndependenceAge} anos de idade)
                      </p>
                    </Card>
                    
                    <Card className="p-4 border border-green-100 bg-green-50">
                      <h3 className="font-medium text-green-800 flex items-center gap-2">
                        <DollarSign size={16} />
                        Capital Total Necessário
                      </h3>
                      <p className="text-2xl font-bold text-green-700 mt-2">
                        {retirementPlan && formatCurrency((targetMonthlyIncome * 12) / 0.04)}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        (usando a regra dos 4% de retirada)
                      </p>
                    </Card>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Recomendações para o Cliente:</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      {retirementPlan && retirementPlan.financialIndependenceAge > retirementPlan.retirementAge && (
                        <li className="text-amber-800">
                          Aumente o aporte mensal para pelo menos {formatCurrency(
                            ((targetMonthlyIncome * 12) / 0.04 - initialInvestment) / 
                            ((Math.pow(1 + expectedReturnRate/100, retirementAge - currentAge) - 1) / 
                            (expectedReturnRate/100)) / 12
                          )} para alcançar a independência financeira na idade desejada.
                        </li>
                      )}
                      
                      {retirementPlan && expectedReturnRate < 8 && (
                        <li>
                          Considere diversificar seus investimentos para buscar um retorno real maior que {formatPercentage(expectedReturnRate)}.
                        </li>
                      )}
                      
                      {retirementPlan && monthlyContribution < (targetMonthlyIncome * 0.3) && (
                        <li>
                          Se possível, aumente suas contribuições mensais para pelo menos {formatCurrency(targetMonthlyIncome * 0.3)} para acelerar seu progresso.
                        </li>
                      )}
                      
                      {retirementPlan && (retirementAge - currentAge) < 20 && (
                        <li>
                          Com um horizonte de {retirementAge - currentAge} anos até a aposentadoria, considere aumentar significativamente seus aportes ou reavaliar sua renda desejada.
                        </li>
                      )}
                      
                      <li>
                        Faça uma revisão anual do seu plano para ajustar seus aportes conforme sua situação financeira evolui.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projection">
            <Card className="border rounded-lg overflow-hidden">
              <div className="bg-[#0c2461] text-white p-4">
                <h2 className="text-xl font-semibold">Projeção Anual</h2>
              </div>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="text-sm text-gray-700">
                        <th className="py-3 px-4 font-medium text-left">Idade</th>
                        <th className="py-3 px-4 font-medium text-left">Ano</th>
                        <th className="py-3 px-4 font-medium text-right">Saldo</th>
                        <th className="py-3 px-4 font-medium text-right">Aportes Acumulados</th>
                        <th className="py-3 px-4 font-medium text-right">Rendimentos Acumulados</th>
                        <th className="py-3 px-4 font-medium text-right">Renda Mensal Potencial</th>
                        <th className="py-3 px-4 font-medium text-right">Eventos de Liquidez</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {retirementPlan?.projectedYearlyData.map((item, index) => {
                        // Verificar se existem eventos de liquidez neste ano
                        const eventsThisYear = liquidityEvents.filter(event => event.year === item.year);
                        const hasEvents = eventsThisYear.length > 0;
                        
                        return (
                          <tr 
                            key={index} 
                            className={`
                              text-sm 
                              ${item.age === retirementAge ? 'bg-blue-50 font-semibold' : ''}
                              ${item.age === retirementPlan.financialIndependenceAge && item.withdrawalPotential >= targetMonthlyIncome ? 'bg-green-50' : ''}
                              ${hasEvents ? 'bg-amber-50' : ''}
                            `}
                          >
                            <td className="py-3 px-4">
                              {item.age}
                              {item.age === retirementAge && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">
                                  Aposentadoria
                                </span>
                              )}
                              {item.age === retirementPlan.financialIndependenceAge && item.withdrawalPotential >= targetMonthlyIncome && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                                  Independência
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">{item.year}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(item.savingsBalance)}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(item.contributionsToDate)}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(item.returnToDate)}</td>
                            <td className="py-3 px-4 text-right">
                              {formatCurrency(item.withdrawalPotential)}
                              {item.withdrawalPotential >= targetMonthlyIncome && (
                                <span className="ml-2 text-xs text-green-600">✓</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {hasEvents ? (
                                <div>
                                  {eventsThisYear.map((event, idx) => (
                                    <div key={idx} className={`text-xs ${event.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {event.description}: {formatCurrency(event.amount)}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Retirement;
