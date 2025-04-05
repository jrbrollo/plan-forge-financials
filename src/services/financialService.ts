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
import { createInvestmentsFromClient } from './investmentService';

export const createFinancialPlanFromClient = (client: Client): FinancialPlan => {
  const monthlyIncome = client.monthlyNetIncome || client.income || 0;
  let monthlyExpensesTotal = 0;
  const expenses = [];

  // Collecting expenses from client data
  if (client.propertyMonthlyPayment) {
    expenses.push({
      description: "Financiamento imobiliário",
      amount: client.propertyMonthlyPayment,
      category: "Moradia",
      isEssential: true,
      percentage: (client.propertyMonthlyPayment / monthlyIncome) * 100
    });
    monthlyExpensesTotal += client.propertyMonthlyPayment;
  }

  if (client.carMonthlyPayment) {
    expenses.push({
      description: "Financiamento de veículo",
      amount: client.carMonthlyPayment,
      category: "Transporte",
      isEssential: false,
      percentage: (client.carMonthlyPayment / monthlyIncome) * 100
    });
    monthlyExpensesTotal += client.carMonthlyPayment;
  }

  if (client.creditCardBillAverage) {
    expenses.push({
      description: "Cartão de crédito",
      amount: client.creditCardBillAverage,
      category: "Diversos",
      isEssential: false,
      percentage: (client.creditCardBillAverage / monthlyIncome) * 100
    });
    monthlyExpensesTotal += client.creditCardBillAverage;
  }

  if (client.debts) {
    client.debts.forEach(debt => {
      if (debt.monthlyPayment) {
        expenses.push({
          description: `Pagamento de dívida: ${debt.reason}`,
          amount: debt.monthlyPayment,
          category: "Dívidas",
          isEssential: true,
          percentage: (debt.monthlyPayment / monthlyIncome) * 100
        });
        monthlyExpensesTotal += debt.monthlyPayment;
      }
    });
  }

  // Estimated expenses for health insurance
  if (client.hasHealthInsurance) {
    const healthInsuranceEstimate = monthlyIncome * 0.08;
    expenses.push({
      description: "Plano de saúde",
      amount: healthInsuranceEstimate,
      category: "Saúde",
      isEssential: true,
      percentage: 8
    });
    monthlyExpensesTotal += healthInsuranceEstimate;
  }

  // Add estimated grocery expenses if not already added
  if (!expenses.some(e => e.category === "Alimentação")) {
    const groceryEstimate = Math.min(monthlyIncome * 0.15, 1500);
    expenses.push({
      description: "Supermercado",
      amount: groceryEstimate,
      category: "Alimentação",
      isEssential: true,
      percentage: (groceryEstimate / monthlyIncome) * 100
    });
    monthlyExpensesTotal += groceryEstimate;
  }

  // Add basic utility expenses if not already added
  if (!expenses.some(e => e.category === "Utilidades")) {
    const utilitiesEstimate = Math.min(monthlyIncome * 0.1, 800);
    expenses.push({
      description: "Utilidades (água, luz, internet)",
      amount: utilitiesEstimate,
      category: "Utilidades",
      isEssential: true,
      percentage: (utilitiesEstimate / monthlyIncome) * 100
    });
    monthlyExpensesTotal += utilitiesEstimate;
  }

  // Add monthly savings/investments if client has saving habit
  let monthlySavings = 0;
  if (client.hasSavingHabit) {
    monthlySavings = client.monthlySavingsAverage || monthlyIncome * 0.1;
    expenses.push({
      description: "Economia/Investimentos",
      amount: monthlySavings,
      category: "Investimentos",
      isEssential: false,
      percentage: (monthlySavings / monthlyIncome) * 100
    });
    monthlyExpensesTotal += monthlySavings;
  }

  // If total reported expenses are less than 80% of income, add estimated discretionary expenses
  if (monthlyExpensesTotal < monthlyIncome * 0.8) {
    const discretionaryEstimate = monthlyIncome * 0.8 - monthlyExpensesTotal;
    expenses.push({
      description: "Despesas diversas",
      amount: discretionaryEstimate,
      category: "Lazer/Diversos",
      isEssential: false,
      percentage: (discretionaryEstimate / monthlyIncome) * 100
    });
    monthlyExpensesTotal += discretionaryEstimate;
  }

  // Create current cash flow from client data
  const currentCashFlow: CashFlow = {
    income: [{
      description: "Renda principal",
      amount: monthlyIncome,
      frequency: "monthly"
    }],
    expenses
  };

  // Create suggested cash flow (optimized version)
  // This is a simplified optimization - a real financial advisor would provide more tailored advice
  const suggestedExpenses = [...expenses];
  
  // Try to reduce non-essential expenses by 15%
  suggestedExpenses.forEach(expense => {
    if (!expense.isEssential && expense.category !== "Investimentos") {
      expense.amount *= 0.85;  // 15% reduction
    }
  });

  // Increase savings/investments if possible
  const currentSavingExpense = suggestedExpenses.find(e => e.category === "Investimentos");
  const suggestedSavingAmount = monthlyIncome * 0.15;  // Target 15% savings rate
  
  if (currentSavingExpense) {
    if (currentSavingExpense.amount < suggestedSavingAmount) {
      currentSavingExpense.amount = suggestedSavingAmount;
    }
  } else {
    suggestedExpenses.push({
      description: "Economia/Investimentos (recomendado)",
      amount: suggestedSavingAmount,
      category: "Investimentos",
      isEssential: false,
      percentage: 15
    });
  }

  const suggestedCashFlow: CashFlow = {
    income: currentCashFlow.income,
    expenses: suggestedExpenses
  };

  // Create assets from client data
  const assets: Asset[] = [];
  
  if (client.hasProperty && client.propertyMarketValue) {
    assets.push({
      description: "Imóvel",
      currentValue: client.propertyMarketValue,
      acquisitionDate: new Date().toISOString().split('T')[0],  // Simplified - ideally we'd have actual date
      type: "real_estate"
    });
  }
  
  if (client.hasCar && client.carMarketValue) {
    assets.push({
      description: "Veículo",
      currentValue: client.carMarketValue,
      acquisitionDate: new Date().toISOString().split('T')[0],
      type: "vehicle"
    });
  }
  
  // Add investment assets
  if (client.hasInvestments && client.totalInvestments) {
    // Get detailed investment data
    const investments = createInvestmentsFromClient(client);
    
    // Create assets from investments
    investments.forEach(investment => {
      assets.push({
        description: investment.name,
        currentValue: investment.currentValue,
        acquisitionDate: investment.investmentDate.toISOString().split('T')[0],
        type: "investment",
        expectedReturn: investment.annualReturn
      });
    });
  }

  // Parse client financial goals
  const financialGoals: FinancialGoal[] = [];
  
  // Retirement goal
  if (client.retirement) {
    financialGoals.push({
      description: "Aposentadoria",
      targetAmount: client.retirement.estimatedAmountNeeded || 0,
      currentSavings: client.hasInvestments ? (client.totalInvestments || 0) * 0.25 : 0,  // Assuming 25% of investments are for retirement
      targetDate: new Date(new Date().getFullYear() + 25, 0).toISOString().split('T')[0],  // Default to 25 years from now
      priority: "high"
    });
  }
  
  // Additional goals
  if (client.otherGoals && client.otherGoals.length > 0) {
    client.otherGoals.forEach(goal => {
      const deadlineYears = parseInt(goal.deadline) || 5;
      financialGoals.push({
        description: goal.description,
        targetAmount: goal.amountNeeded,
        currentSavings: 0,  // We don't have this information from the client data
        targetDate: new Date(new Date().getFullYear() + deadlineYears, 0).toISOString().split('T')[0],
        priority: "medium"
      });
    });
  }

  // Calculate emergency fund target (3-6 months of essential expenses)
  const essentialMonthlyExpenses = expenses
    .filter(exp => exp.isEssential)
    .reduce((sum, exp) => sum + exp.amount, 0);
    
  const emergencyFundTarget = essentialMonthlyExpenses * 6;
  
  // Estimate current emergency fund (if they have investments)
  let emergencyFund = 0;
  if (client.hasInvestments && client.totalInvestments) {
    emergencyFund = client.totalInvestments * 0.2;  // Assume 20% of investments are emergency fund
  }

  // Convert client's debt format to match the Debt interface
  const convertedDebts: Debt[] = client.debts ? client.debts.map(debt => ({
    description: debt.reason,
    currentValue: debt.value,
    interestRate: 0.15, // Default interest rate if not provided
    monthlyPayment: debt.monthlyPayment,
    remainingMonths: Math.ceil(debt.value / debt.monthlyPayment) // Estimate remaining months
  })) : [];

  return {
    financialGoals,
    assets,
    debts: convertedDebts,
    currentCashFlow,
    suggestedCashFlow,
    emergencyFund,
    emergencyFundTarget
  };
};

export const calculateFinancialHealth = (client: Client, financialPlan: FinancialPlan): FinancialHealth => {
  // Calcular patrimônio líquido
  const totalAssets = financialPlan.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDebts = financialPlan.debts.reduce((sum, debt) => sum + debt.currentValue, 0);
  const netWorth = totalAssets - totalDebts;
  
  // Calcular renda total mensal
  const monthlyIncome = financialPlan.currentCashFlow.income.reduce((sum, income) => {
    if (income.frequency === 'monthly') {
      return sum + income.amount;
    } else if (income.frequency === 'annual') {
      return sum + (income.amount / 12);
    } else {
      return sum;
    }
  }, 0);
  
  // Calcular despesas mensais
  const monthlyExpenses = financialPlan.currentCashFlow.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calcular taxa de poupança
  const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome * 100;
  
  // Calcular relação dívida/renda
  const monthlyDebtPayments = financialPlan.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  const debtToIncomeRatio = monthlyDebtPayments / monthlyIncome;
  
  // Calcular meses de fundo de emergência
  const emergencyFundMonths = financialPlan.emergencyFund / monthlyExpenses;
  
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

export const calculateInvestmentProjection = (client: Client, financialPlan: FinancialPlan): InvestmentProjection => {
  // Obter ativos de investimento
  const investments = financialPlan.assets.filter(asset => asset.type === 'investment');
  
  // Calcular investimento inicial total
  const initialInvestment = investments.reduce((sum, investment) => sum + investment.currentValue, 0);
  
  // Estimar contribuição mensal com base no fluxo de caixa sugerido
  const suggestedIncome = financialPlan.suggestedCashFlow.income.reduce((sum, income) => {
    if (income.frequency === 'monthly') {
      return sum + income.amount;
    } else if (income.frequency === 'annual') {
      return sum + (income.amount / 12);
    } else {
      return sum;
    }
  }, 0);
  
  const suggestedExpenses = financialPlan.suggestedCashFlow.expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
  const retirementGoal = financialPlan.financialGoals.find(goal => goal.description === 'Aposentadoria');
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

export const analyzeDebts = (client: Client, financialPlan: FinancialPlan): DebtAnalysis => {
  const debts = financialPlan.debts;
  
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
