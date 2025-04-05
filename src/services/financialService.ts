import { 
  Client, 
  FinancialPlan, 
  CashFlow, 
  Asset, 
  Debt, 
  FinancialGoal,
  FinancialHealth,
  InvestmentProjection,
  DebtAnalysis
} from '@/lib/types';

// Função para criar um plano financeiro com base nos dados do cliente
export const createFinancialPlanFromClient = (client: Client): FinancialPlan => {
  // Valores padrão para o plano financeiro
  const clientIncome = client?.monthlyNetIncome || client?.income || 5000;
  const defaultIncome = [
    {
      description: 'Salário',
      amount: clientIncome,
      frequency: 'monthly' as const
    }
  ];

  // Despesas estimadas com base na renda
  const estimatedExpenses = clientIncome * 0.7;
  
  // Gerar despesas padrão
  const generateDefaultExpenses = (total: number) => {
    return [
      {
        description: 'Moradia',
        amount: total * 0.3,
        category: 'Moradia',
        isEssential: true
      },
      {
        description: 'Alimentação',
        amount: total * 0.2,
        category: 'Alimentação',
        isEssential: true
      },
      {
        description: 'Transporte',
        amount: total * 0.15,
        category: 'Transporte',
        isEssential: true
      },
      {
        description: 'Saúde',
        amount: total * 0.1,
        category: 'Saúde',
        isEssential: true
      },
      {
        description: 'Lazer',
        amount: total * 0.1,
        category: 'Lazer',
        isEssential: false
      },
      {
        description: 'Educação',
        amount: total * 0.05,
        category: 'Educação',
        isEssential: true
      },
      {
        description: 'Outros',
        amount: total * 0.1,
        category: 'Outros',
        isEssential: false
      }
    ];
  };

  // Gerar fluxo de caixa atual baseado no cliente
  const currentCashFlow: CashFlow = {
    income: defaultIncome,
    expenses: generateDefaultExpenses(estimatedExpenses)
  };

  // Calcular despesas otimizadas (redução de 15% em não essenciais)
  const suggestedExpenses = currentCashFlow.expenses.map(expense => {
    if (!expense.isEssential) {
      return {
        ...expense,
        amount: expense.amount * 0.85 // Redução de 15% nas despesas não essenciais
      };
    }
    return expense;
  });

  // Fluxo de caixa sugerido
  const suggestedCashFlow: CashFlow = {
    income: currentCashFlow.income,
    expenses: suggestedExpenses
  };

  // Gerar ativos padrão
  const defaultAssets: Asset[] = [];
  
  // Se o cliente tem um perfil financeiro, gerar ativos mais específicos
  if (client.financialProfile) {
    // Adicionar imóvel se a idade for maior que 30
    if (client.age > 30) {
      defaultAssets.push({
        description: 'Imóvel residencial',
        currentValue: clientIncome * 36,
        acquisitionDate: new Date(new Date().getFullYear() - 5, 0, 1).toISOString(),
        type: 'real_estate'
      });
    }
    
    // Adicionar carro
    defaultAssets.push({
      description: 'Veículo',
      currentValue: clientIncome * 6,
      acquisitionDate: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
      type: 'vehicle'
    });
    
    // Adicionar investimentos baseados no perfil de risco
    if (client.financialProfile.investmentExperience !== 'none') {
      defaultAssets.push({
        description: 'Investimentos em Renda Fixa',
        currentValue: clientIncome * 12,
        acquisitionDate: new Date(new Date().getFullYear() - 3, 0, 1).toISOString(),
        type: 'investment',
        expectedReturn: 0.08
      });
      
      if (client.financialProfile.riskTolerance === 'high') {
        defaultAssets.push({
          description: 'Investimentos em Renda Variável',
          currentValue: clientIncome * 8,
          acquisitionDate: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
          type: 'investment',
          expectedReturn: 0.12
        });
      }
    }
  }

  // Gerar dívidas padrão
  const defaultDebts: Debt[] = [];
  
  // Se o cliente tem um perfil financeiro, gerar dívidas mais específicas
  if (client.financialProfile) {
    // Adicionar financiamento imobiliário se tiver imóvel
    if (defaultAssets.some(asset => asset.type === 'real_estate')) {
      defaultDebts.push({
        description: 'Financiamento imobiliário',
        currentValue: clientIncome * 24,
        interestRate: 0.08,
        monthlyPayment: clientIncome * 0.3,
        remainingMonths: 240
      });
    }
    
    // Adicionar financiamento de veículo se tiver carro
    if (defaultAssets.some(asset => asset.type === 'vehicle')) {
      defaultDebts.push({
        description: 'Financiamento de veículo',
        currentValue: clientIncome * 3,
        interestRate: 0.12,
        monthlyPayment: clientIncome * 0.15,
        remainingMonths: 36
      });
    }
    
    // Adicionar empréstimo pessoal
    if (Math.random() > 0.5) {
      defaultDebts.push({
        description: 'Empréstimo pessoal',
        currentValue: clientIncome * 1.5,
        interestRate: 0.18,
        monthlyPayment: clientIncome * 0.1,
        remainingMonths: 18
      });
    }
  }

  // Gerar objetivos financeiros padrão
  const defaultGoals: FinancialGoal[] = [];
  
  // Se o cliente tem um perfil financeiro, gerar objetivos mais específicos
  if (client.financialProfile) {
    // Objetivo de reserva de emergência
    defaultGoals.push({
      description: 'Reserva de emergência',
      targetAmount: clientIncome * 6,
      currentSavings: clientIncome * 2,
      targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      priority: 'high'
    });
    
    // Objetivo de aposentadoria
    if (client.financialProfile.retirementAge) {
      const yearsToRetirement = client.financialProfile.retirementAge - (client.age || 30);
      defaultGoals.push({
        description: 'Aposentadoria',
        targetAmount: clientIncome * 300,
        currentSavings: clientIncome * 10,
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + yearsToRetirement)).toISOString(),
        priority: 'medium'
      });
    }
    
    // Objetivo de viagem
    defaultGoals.push({
      description: 'Viagem internacional',
      targetAmount: clientIncome * 3,
      currentSavings: clientIncome * 0.5,
      targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
      priority: 'low'
    });
  }

  // Calcular fundo de emergência alvo (6x despesas mensais)
  const totalMonthlyExpenses = currentCashFlow.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const emergencyFundTarget = totalMonthlyExpenses * 6;
  
  // Estimar fundo de emergência atual
  const emergencyFund = defaultGoals.find(goal => goal.description === 'Reserva de emergência')?.currentSavings || 0;

  // Montar o plano financeiro
  const financialPlan: FinancialPlan = {
    financialGoals: defaultGoals,
    assets: defaultAssets,
    debts: defaultDebts,
    currentCashFlow,
    suggestedCashFlow,
    emergencyFund,
    emergencyFundTarget
  };

  return financialPlan;
};

// Função para calcular a saúde financeira com base no cliente e no plano
export const calculateFinancialHealth = (client: Client, plan: FinancialPlan): FinancialHealth => {
  // Calcular patrimônio líquido
  const totalAssets = plan.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDebts = plan.debts.reduce((sum, debt) => sum + debt.currentValue, 0);
  const netWorth = totalAssets - totalDebts;
  
  // Calcular renda total mensal
  const monthlyIncome = plan.currentCashFlow.income.reduce((sum, income) => {
    if (income.frequency === 'monthly') {
      return sum + income.amount;
    } else if (income.frequency === 'annual') {
      return sum + (income.amount / 12);
    } else {
      return sum;
    }
  }, 0);
  
  // Calcular despesas mensais
  const monthlyExpenses = plan.currentCashFlow.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calcular taxa de poupança
  const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome * 100;
  
  // Calcular relação dívida/renda
  const monthlyDebtPayments = plan.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  const debtToIncomeRatio = monthlyDebtPayments / monthlyIncome;
  
  // Calcular meses de fundo de emergência
  const emergencyFundMonths = plan.emergencyFund / monthlyExpenses;
  
  // Determinar status do fundo de emergência
  let emergencyFundStatus: 'insufficient' | 'sufficient' | 'excessive' = 'insufficient';
  if (emergencyFundMonths >= 3 && emergencyFundMonths <= 6) {
    emergencyFundStatus = 'sufficient';
  } else if (emergencyFundMonths > 6) {
    emergencyFundStatus = 'excessive';
  }
  
  // Calcular pontuação de saúde financeira (0-100)
  let score = 0;
  
  // Pontuação baseada no fundo de emergência (0-20 pontos)
  score += Math.min(emergencyFundMonths * 3.33, 20);
  
  // Pontuação baseada na taxa de poupança (0-25 pontos)
  score += Math.min(savingsRate * 1.25, 25);
  
  // Pontuação baseada na relação dívida/renda (0-25 pontos)
  score += Math.max(25 - (debtToIncomeRatio * 100), 0);
  
  // Pontuação baseada no patrimônio líquido (0-30 pontos)
  const yearlyIncome = monthlyIncome * 12;
  if (netWorth >= yearlyIncome * 5) {
    score += 30;
  } else if (netWorth >= yearlyIncome * 3) {
    score += 25;
  } else if (netWorth >= yearlyIncome) {
    score += 20;
  } else if (netWorth >= 0) {
    score += 15;
  } else {
    score += Math.max(15 + (netWorth / yearlyIncome * 15), 0);
  }
  
  // Determinar status com base na pontuação
  let overallStatus: string;
  if (score >= 80) {
    overallStatus = 'Excelente';
  } else if (score >= 60) {
    overallStatus = 'Boa';
  } else if (score >= 40) {
    overallStatus = 'Regular';
  } else {
    overallStatus = 'Precisa de atenção';
  }
  
  // Determinar tendência (simulada)
  const scoreTrend = savingsRate > 20 ? 1 : (savingsRate > 0 ? 0 : -1);
  
  return {
    overallScore: Math.round(score),
    overallStatus,
    scoreTrend,
    netWorth,
    debtToIncomeRatio,
    emergencyFundMonths,
    emergencyFundStatus,
    savingsRate
  };
};

// Função para calcular projeção de investimentos
export const calculateInvestmentProjection = (client: Client, plan: FinancialPlan): InvestmentProjection => {
  // Obter ativos de investimento
  const investments = plan.assets.filter(asset => asset.type === 'investment');
  
  // Calcular investimento inicial total
  const initialInvestment = investments.reduce((sum, investment) => sum + investment.currentValue, 0);
  
  // Estimar contribuição mensal com base no fluxo de caixa sugerido
  const suggestedIncome = plan.suggestedCashFlow.income.reduce((sum, income) => {
    if (income.frequency === 'monthly') {
      return sum + income.amount;
    } else if (income.frequency === 'annual') {
      return sum + (income.amount / 12);
    } else {
      return sum;
    }
  }, 0);
  
  const suggestedExpenses = plan.suggestedCashFlow.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlySurplus = suggestedIncome - suggestedExpenses;
  
  // Assumir que 50% do superávit vai para investimentos
  const monthlyContribution = Math.max(monthlySurplus * 0.5, 0);
  
  // Determinar taxa de retorno esperada com base no perfil de risco
  let expectedReturnRate = 0.06; // Padrão de 6% ao ano
  
  if (client.financialProfile?.riskTolerance === 'high') {
    expectedReturnRate = 0.10; // 10% para perfil arrojado
  } else if (client.financialProfile?.riskTolerance === 'medium') {
    expectedReturnRate = 0.08; // 8% para perfil moderado
  }
  
  // Calcular valores futuros
  const calculateFutureValue = (initialAmount: number, monthlyContribution: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    
    // Fórmula para calcular valor futuro com aportes mensais
    const futureValueOfInitial = initialAmount * Math.pow(1 + monthlyRate, months);
    const futureValueOfContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return futureValueOfInitial + futureValueOfContributions;
  };
  
  const projectedValue5Years = calculateFutureValue(initialInvestment, monthlyContribution, expectedReturnRate, 5);
  const projectedValue10Years = calculateFutureValue(initialInvestment, monthlyContribution, expectedReturnRate, 10);
  const projectedValue20Years = calculateFutureValue(initialInvestment, monthlyContribution, expectedReturnRate, 20);
  
  // Calcular meta de aposentadoria
  const retirementGoal = plan.financialGoals.find(goal => goal.description === 'Aposentadoria');
  const targetAmount = retirementGoal?.targetAmount || suggestedIncome * 300; // 25 anos de renda
  
  // Calcular anos até a aposentadoria
  let yearsToRetirement = 30; // Valor padrão
  
  if (client.financialProfile?.retirementAge && client.age) {
    yearsToRetirement = client.financialProfile.retirementAge - client.age;
  }
  
  return {
    initialInvestment,
    monthlyContribution,
    expectedReturnRate,
    targetAmount,
    yearsToRetirement,
    projectedValue5Years,
    projectedValue10Years,
    projectedValue20Years
  };
};

// Função para analisar dívidas
export const analyzeDebts = (client: Client, plan: FinancialPlan): DebtAnalysis => {
  const debts = plan.debts;
  
  // Calcular total da dívida
  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentValue, 0);
  
  // Calcular pagamentos mensais totais
  const monthlyDebtPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  
  // Identificar dívidas com juros altos (acima de 15% ao ano)
  const highInterestDebts = debts.filter(debt => debt.interestRate > 0.15);
  const hasHighInterestDebt = highInterestDebts.length > 0;
  const highInterestDebtCount = highInterestDebts.length;
  
  // Calcular data estimada para ficar livre de dívidas
  // Usamos a dívida mais longa como referência
  const longestDebtMonths = debts.reduce((max, debt) => Math.max(max, debt.remainingMonths), 0);
  const today = new Date();
  const debtFreeDate = new Date(today.setMonth(today.getMonth() + longestDebtMonths)).toISOString();
  
  // Gerar cronograma de amortização aproximado
  const amortizationSchedule = [];
  let remainingDebt = totalDebt;
  const monthlyPrincipalPayment = debts.reduce((sum, debt) => {
    // Estimativa simples da parte do principal no pagamento mensal
    const interestPayment = debt.currentValue * (debt.interestRate / 12);
    const principalPayment = debt.monthlyPayment - interestPayment;
    return sum + principalPayment;
  }, 0);
  
  // Gerar cronograma para os próximos 24 meses ou até quitar a dívida
  for (let i = 1; i <= Math.min(longestDebtMonths, 24); i++) {
    const month = new Date();
    month.setMonth(month.getMonth() + i);
    
    // Considerar juros aproximados de 1% ao mês em média
    remainingDebt = Math.max(0, remainingDebt - monthlyPrincipalPayment);
    
    amortizationSchedule.push({
      month: month.toISOString(),
      remainingDebt
    });
    
    if (remainingDebt <= 0) break;
  }
  
  // Recomendar estratégia de pagamento
  let recommendedPayoffStrategy = '';
  
  if (hasHighInterestDebt) {
    recommendedPayoffStrategy = 'Método de avalanche: Pague primeiro as dívidas com taxas de juros mais altas para economizar dinheiro a longo prazo.';
  } else if (debts.length > 1) {
    recommendedPayoffStrategy = 'Método da bola de neve: Pague primeiro as dívidas menores para ganhar motivação e então avance para as maiores.';
  } else if (debts.length === 1) {
    recommendedPayoffStrategy = 'Faça pagamentos adicionais quando possível para reduzir o tempo total e os juros pagos.';
  } else {
    recommendedPayoffStrategy = 'Você não possui dívidas registradas!';
  }
  
  return {
    totalDebt,
    monthlyDebtPayments,
    hasHighInterestDebt,
    highInterestDebtCount,
    debtFreeDate,
    amortizationSchedule,
    recommendedPayoffStrategy
  };
}; 