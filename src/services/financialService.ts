import { Client, FinancialPlan, FinancialGoal, Asset, Debt, CashFlow, FinancialHealth, InvestmentProjection, DebtAnalysis, RetirementPlan } from '@/lib/types';

// Função principal para criar um plano financeiro a partir dos dados do cliente
export const createFinancialPlanFromClient = (client: Client): FinancialPlan => {
  // Extrair metas financeiras
  const financialGoals = extractFinancialGoals(client);
  
  // Extrair ativos
  const assets = extractAssets(client);
  
  // Extrair dívidas
  const debts = extractDebts(client);
  
  // Extrair fluxo de caixa atual
  const currentCashFlow = extractCashFlow(client);
  
  // Gerar fluxo de caixa sugerido
  const suggestedCashFlow = generateSuggestedCashFlow(currentCashFlow, client);
  
  // Calcular fundo de emergência
  const emergencyFundTarget = calculateEmergencyFundTarget(currentCashFlow, client);
  const emergencyFund = client.emergencyFund?.currentAmount || 0;
  
  return {
    financialGoals,
    assets,
    debts,
    currentCashFlow,
    suggestedCashFlow,
    emergencyFund,
    emergencyFundTarget
  };
};

// Extrair metas financeiras do cliente
const extractFinancialGoals = (client: Client): FinancialGoal[] => {
  const goals: FinancialGoal[] = [];
  
  // Adicionar meta de aposentadoria se existir
  if (client.retirement) {
    goals.push({
      description: 'Aposentadoria',
      targetAmount: client.retirement.estimatedAmountNeeded || 0,
      currentSavings: client.totalInvestments || 0,
      targetDate: client.retirement.targetDate || '',
      priority: 'high'
    });
  }
  
  // Adicionar outras metas se existirem
  if (client.otherGoals && client.otherGoals.length > 0) {
    client.otherGoals.forEach((goal, index) => {
      goals.push({
        description: goal.description,
        targetAmount: goal.amountNeeded,
        currentSavings: 0, // Assumimos que ainda não há poupança específica para esta meta
        targetDate: goal.deadline,
        priority: index === 0 ? 'high' : (index === 1 ? 'medium' : 'low')
      });
    });
  }
  
  return goals;
};

// Extrair ativos do cliente
const extractAssets = (client: Client): Asset[] => {
  const assets: Asset[] = [];
  
  // Adicionar imóvel se existir
  if (client.hasProperty) {
    assets.push({
      description: 'Imóvel',
      currentValue: client.propertyMarketValue || 0,
      acquisitionDate: new Date().toISOString().split('T')[0], // Data atual como fallback
      type: 'real_estate'
    });
  }
  
  // Adicionar carro se existir
  if (client.hasCar) {
    assets.push({
      description: 'Veículo',
      currentValue: client.carMarketValue || 0,
      acquisitionDate: new Date().toISOString().split('T')[0], // Data atual como fallback
      type: 'vehicle'
    });
  }
  
  // Adicionar investimentos como um ativo
  if (client.hasInvestments && client.totalInvestments) {
    assets.push({
      description: 'Investimentos',
      currentValue: client.totalInvestments,
      acquisitionDate: new Date().toISOString().split('T')[0], // Data atual como fallback
      type: 'investment',
      expectedReturn: 0.08 // 8% como taxa de retorno padrão
    });
  }
  
  return assets;
};

// Extrair dívidas do cliente
const extractDebts = (client: Client): Debt[] => {
  const debts: Debt[] = [];
  
  // Adicionar financiamento do imóvel se existir
  if (client.hasProperty && !client.isPropertyPaidOff) {
    // Estimar o valor total restante baseado na parcela mensal e no tempo restante
    const remainingMonths = estimateRemainingMonths(client.propertyPaymentRemaining || '');
    
    debts.push({
      description: 'Financiamento Imobiliário',
      currentValue: client.propertyMonthlyPayment ? client.propertyMonthlyPayment * remainingMonths : 0,
      interestRate: 0.08, // Taxa de juros estimada para financiamento imobiliário
      monthlyPayment: client.propertyMonthlyPayment || 0,
      remainingMonths: remainingMonths
    });
  }
  
  // Adicionar financiamento do carro se existir
  if (client.hasCar && !client.isCarPaidOff) {
    // Estimar o valor total restante baseado na parcela mensal e no tempo restante
    const remainingMonths = estimateRemainingMonths(client.carPaymentRemaining || '');
    
    debts.push({
      description: 'Financiamento de Veículo',
      currentValue: client.carMonthlyPayment ? client.carMonthlyPayment * remainingMonths : 0,
      interestRate: 0.12, // Taxa de juros estimada para financiamento de veículo
      monthlyPayment: client.carMonthlyPayment || 0,
      remainingMonths: remainingMonths
    });
  }
  
  // Adicionar outras dívidas se existirem
  if (client.debts && client.debts.length > 0) {
    client.debts.forEach(debt => {
      // Estimar o número de meses restantes
      const remainingMonths = debt.value / debt.monthlyPayment;
      
      debts.push({
        description: debt.reason,
        currentValue: debt.value,
        interestRate: 0.15, // Taxa de juros estimada para outras dívidas
        monthlyPayment: debt.monthlyPayment,
        remainingMonths: Math.ceil(remainingMonths)
      });
    });
  }
  
  return debts;
};

// Extrair fluxo de caixa do cliente
const extractCashFlow = (client: Client): CashFlow => {
  const income = [];
  const expenses = [];
  
  // Adicionar renda principal
  if (client.monthlyNetIncome) {
    income.push({
      description: 'Renda Principal',
      amount: client.monthlyNetIncome,
      frequency: 'monthly'
    });
  }
  
  // Adicionar despesas fixas
  if (client.fixedMonthlyExpenses) {
    // Tentar extrair despesas de uma string formatada
    const fixedExpenses = parseExpensesString(client.fixedMonthlyExpenses);
    expenses.push(...fixedExpenses);
  }
  
  // Adicionar despesas variáveis
  if (client.variableExpenses) {
    // Tentar extrair despesas de uma string formatada
    const variableExpenses = parseExpensesString(client.variableExpenses, false);
    expenses.push(...variableExpenses);
  }
  
  // Adicionar parcela do imóvel como despesa se existir
  if (client.hasProperty && !client.isPropertyPaidOff && client.propertyMonthlyPayment) {
    expenses.push({
      description: 'Financiamento Imobiliário',
      amount: client.propertyMonthlyPayment,
      category: 'Moradia',
      isEssential: true
    });
  }
  
  // Adicionar parcela do carro como despesa se existir
  if (client.hasCar && !client.isCarPaidOff && client.carMonthlyPayment) {
    expenses.push({
      description: 'Financiamento de Veículo',
      amount: client.carMonthlyPayment,
      category: 'Transporte',
      isEssential: true
    });
  }
  
  return { income, expenses };
};

// Função auxiliar para estimar o número de meses restantes a partir de uma string
const estimateRemainingMonths = (remainingString: string): number => {
  // Tentar extrair números da string
  const numbers = remainingString.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 24; // Valor padrão se não conseguir extrair
  
  const value = parseInt(numbers[0]);
  
  // Verificar se a string contém palavras-chave para determinar a unidade
  if (remainingString.toLowerCase().includes('ano')) {
    return value * 12; // Converter anos para meses
  } else {
    return value; // Assumir que já está em meses
  }
};

// Função auxiliar para analisar uma string de despesas
const parseExpensesString = (expensesString: string, isEssential: boolean = true): { description: string, amount: number, category: string, isEssential: boolean }[] => {
  const expenses = [];
  
  // Dividir por linhas ou por vírgulas
  const expenseItems = expensesString.split(/[,\n]/);
  
  for (const item of expenseItems) {
    // Tentar extrair o valor monetário
    const valueMatch = item.match(/R\$\s*([\d.,]+)|(\d+[\d.,]*)/);
    if (!valueMatch) continue;
    
    // Limpar e converter o valor para número
    const valueStr = valueMatch[1] || valueMatch[2];
    const amount = parseFloat(valueStr.replace(/\./g, '').replace(',', '.'));
    
    // Extrair a descrição (tudo antes do valor)
    let description = item.substring(0, item.indexOf(valueMatch[0])).trim();
    if (!description) {
      description = 'Despesa não especificada';
    }
    
    // Determinar a categoria com base na descrição
    const category = determineExpenseCategory(description);
    
    expenses.push({
      description,
      amount,
      category,
      isEssential
    });
  }
  
  return expenses;
};

// Função auxiliar para determinar a categoria da despesa
const determineExpenseCategory = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('aluguel') || lowerDesc.includes('moradia') || lowerDesc.includes('casa') || lowerDesc.includes('condomínio')) {
    return 'Moradia';
  } else if (lowerDesc.includes('alimentação') || lowerDesc.includes('comida') || lowerDesc.includes('mercado') || lowerDesc.includes('supermercado')) {
    return 'Alimentação';
  } else if (lowerDesc.includes('transporte') || lowerDesc.includes('combustível') || lowerDesc.includes('gasolina') || lowerDesc.includes('ônibus')) {
    return 'Transporte';
  } else if (lowerDesc.includes('saúde') || lowerDesc.includes('médico') || lowerDesc.includes('remédio') || lowerDesc.includes('plano de saúde')) {
    return 'Saúde';
  } else if (lowerDesc.includes('educação') || lowerDesc.includes('escola') || lowerDesc.includes('faculdade') || lowerDesc.includes('curso')) {
    return 'Educação';
  } else if (lowerDesc.includes('lazer') || lowerDesc.includes('entretenimento') || lowerDesc.includes('viagem')) {
    return 'Lazer';
  } else if (lowerDesc.includes('vestuário') || lowerDesc.includes('roupa') || lowerDesc.includes('calçado')) {
    return 'Vestuário';
  } else if (lowerDesc.includes('comunicação') || lowerDesc.includes('telefone') || lowerDesc.includes('internet') || lowerDesc.includes('celular')) {
    return 'Comunicação';
  } else if (lowerDesc.includes('dívida') || lowerDesc.includes('empréstimo') || lowerDesc.includes('financiamento')) {
    return 'Dívidas';
  } else {
    return 'Outros';
  }
};

// Gerar fluxo de caixa sugerido
const generateSuggestedCashFlow = (currentCashFlow: CashFlow, client: Client): CashFlow => {
  // Copiar o fluxo de caixa atual
  const suggestedCashFlow: CashFlow = {
    income: [...currentCashFlow.income],
    expenses: []
  };
  
  // Calcular a renda total mensal
  const totalMonthlyIncome = currentCashFlow.income.reduce((sum, income) => sum + income.amount, 0);
  
  // Calcular o total de despesas atuais
  const totalCurrentExpenses = currentCashFlow.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calcular a diferença (quanto sobra ou falta)
  const surplus = totalMonthlyIncome - totalCurrentExpenses;
  
  // Ajustar as despesas com base em proporções recomendadas
  const recommendedProportions = {
    'Moradia': 0.30,
    'Alimentação': 0.15,
    'Transporte': 0.10,
    'Saúde': 0.10,
    'Educação': 0.10,
    'Lazer': 0.05,
    'Vestuário': 0.05,
    'Comunicação': 0.05,
    'Dívidas': 0.10,
    'Outros': 0.05,
    'Investimentos': 0.15
  };
  
  // Agrupar despesas por categoria
  const expensesByCategory: Record<string, number> = {};
  currentCashFlow.expenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });
  
  // Criar despesas sugeridas com base nas proporções recomendadas
  Object.entries(recommendedProportions).forEach(([category, proportion]) => {
    const recommendedAmount = totalMonthlyIncome * proportion;
    const currentAmount = expensesByCategory[category] || 0;
    
    // Adicionar a despesa sugerida
    suggestedCashFlow.expenses.push({
      description: `${category} (Sugerido)`,
      amount: recommendedAmount,
      category,
      isEssential: ['Moradia', 'Alimentação', 'Saúde', 'Educação', 'Dívidas'].includes(category)
    });
  });
  
  // Adicionar uma linha para investimentos se não existir
  if (!expensesByCategory['Investimentos']) {
    const recommendedInvestmentAmount = totalMonthlyIncome * recommendedProportions['Investimentos'];
    
    suggestedCashFlow.expenses.push({
      description: 'Investimentos (Sugerido)',
      amount: recommendedInvestmentAmount,
      category: 'Investimentos',
      isEssential: true
    });
  }
  
  return suggestedCashFlow;
};

// Calcular o valor alvo do fundo de emergência
const calculateEmergencyFundTarget = (cashFlow: CashFlow, client: Client): number => {
  // Calcular o total de despesas essenciais mensais
  const essentialExpenses = cashFlow.expenses
    .filter(expense => expense.isEssential)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Multiplicar pelo número de meses recomendado (padrão: 6 meses)
  const targetMonths = client.emergencyFund?.targetMonths || 6;
  
  return essentialExpenses * targetMonths;
};

// Calcular a saúde financeira do cliente
export const calculateFinancialHealth = (client: Client, financialPlan: FinancialPlan): FinancialHealth => {
  // Calcular patrimônio líquido (ativos - dívidas)
  const totalAssets = financialPlan.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDebts = financialPlan.debts.reduce((sum, debt) => sum + debt.currentValue, 0);
  const netWorth = totalAssets - totalDebts;
  
  // Calcular relação dívida/renda
  const monthlyIncome = client.monthlyNetIncome || 0;
  const debtToIncomeRatio = monthlyIncome > 0 ? totalDebts / (monthlyIncome * 12) : 0;
  
  // Calcular meses de fundo de emergência
  const monthlyEssentialExpenses = financialPlan.currentCashFlow.expenses
    .filter(expense => expense.isEssential)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const emergencyFundMonths = monthlyEssentialExpenses > 0 
    ? (financialPlan.emergencyFund / monthlyEssentialExpenses) 
    : 0;
  
  // Determinar status do fundo de emergência
  let emergencyFundStatus: 'insufficient' | 'sufficient' | 'excessive' = 'insufficient';
  if (emergencyFundMonths >= 6) {
    emergencyFundStatus = 'sufficient';
  }
  if (emergencyFundMonths >= 12) {
    emergencyFundStatus = 'excessive';
  }
  
  // Calcular taxa de poupança
  const totalIncome = financialPlan.currentCashFlow.income.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = financialPlan.currentCashFlow.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
  
  // Calcular pontuação geral (0-100)
  let overallScore = 0;
  
  // Pontos para patrimônio líquido positivo (0-20)
  overallScore += netWorth > 0 ? Math.min(20, (netWorth / (monthlyIncome * 12)) * 10) : 0;
  
  // Pontos para relação dívida/renda (0-20)
  overallScore += debtToIncomeRatio < 0.4 ? 20 - (debtToIncomeRatio * 50) : 0;
  
  // Pontos para fundo de emergência (0-20)
  overallScore += Math.min(20, emergencyFundMonths * 3);
  
  // Pontos para taxa de poupança (0-20)
  overallScore += Math.min(20, savingsRate * 100);
  
  // Pontos para diversificação de investimentos (0-20)
  overallScore += client.hasDiversifiedPortfolio ? 20 : (client.hasInvestments ? 10 : 0);
  
  // Determinar status geral
  let overallStatus = 'Crítico';
  if (overallScore >= 30) overallStatus = 'Preocupante';
  if (overallScore >= 50) overallStatus = 'Regular';
  if (overallScore >= 70) overallStatus = 'Bom';
  if (overallScore >= 85) overallStatus = 'Excelente';
  
  // Tendência (baseada em hábitos de poupança e planejamento)
  const scoreTrend = (client.hasSavingHabit ? 1 : -1) * (client.hasFinancialPlanning ? 1 : 0.5);
  
  return {
    overallScore,
    overallStatus,
    scoreTrend,
    netWorth,
    debtToIncomeRatio,
    emergencyFundMonths,
    emergencyFundStatus,
    savingsRate
  };
};

// Criar projeção de investimentos
export const createInvestmentProjection = (client: Client): InvestmentProjection => {
  // Valores iniciais
  const initialInvestment = client.totalInvestments || 0;
  const monthlyContribution = client.monthlySavingsAverage || 0;
  
  // Taxa de retorno esperada com base no perfil de risco
  let expectedReturnRate = 0.06; // 6% ao ano (padrão)
  
  if (client.moneyProfile === 'Controlado') {
    expectedReturnRate = 0.08; // 8% para perfil controlado
  } else if (client.moneyProfile === 'Gastador') {
    expectedReturnRate = 0.04; // 4% para perfil gastador
  }
  
  // Calcular valor alvo para aposentadoria
  const targetAmount = client.retirement?.estimatedAmountNeeded || 0;
  
  // Calcular anos até a aposentadoria
  const currentAge = client.age || 30;
  const retirementAge = client.retirement?.retirementAge || 65;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  
  // Projetar valores futuros
  const projectedValue5Years = projectInvestmentValue(initialInvestment, monthlyContribution, expectedReturnRate, 5);
  const projectedValue10Years = projectInvestmentValue(initialInvestment, monthlyContribution, expectedReturnRate, 10);
  const projectedValue20Years = projectInvestmentValue(initialInvestment, monthlyContribution, expectedReturnRate, 20);
  
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

// Função auxiliar para projetar valor futuro de investimentos
const projectInvestmentValue = (
  initialAmount: number, 
  monthlyContribution: number, 
  annualRate: number, 
  years: number
): number => {
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  
  // Fórmula para valor futuro com aportes mensais
  let futureValue = initialAmount * Math.pow(1 + monthlyRate, months);
  
  if (monthlyContribution > 0) {
    futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }
  
  return futureValue;
};

// Analisar dívidas do cliente
export const analyzeDebts = (client: Client, financialPlan: FinancialPlan): DebtAnalysis => {
  const debts = financialPlan.debts;
  const monthlyIncome = client.monthlyNetIncome || 0;
  
  // Identificar dívidas de alto custo (juros > 12% ao ano)
  const highInterestDebts = debts.filter(debt => debt.interestRate > 0.12);
  
  // Calcular o total de dívidas de alto custo
  const totalHighInterestDebt = highInterestDebts.reduce((sum, debt) => sum + debt.currentValue, 0);
  
  // Calcular o total de todas as dívidas
  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentValue, 0);
  
  // Calcular a relação dívida/renda
  const debtToIncomeRatio = monthlyIncome > 0 ? totalDebt / (monthlyIncome * 12) : 0;
  
  // Calcular o total de pagamentos mensais
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  
  // Estimar meses para quitar todas as dívidas (sem considerar juros)
  const monthsToPayoff = totalMonthlyPayments > 0 ? Math.ceil(totalDebt / totalMonthlyPayments) : 0;
  
  // Estimar juros pagos durante o período
  const interestPaid = debts.reduce((sum, debt) => {
    const totalPayments = debt.monthlyPayment * debt.remainingMonths;
    return sum + (totalPayments - debt.currentValue);
  }, 0);
  
  // Calcular data estimada para ficar livre de dívidas
  const today = new Date();
  const debtFreeDate = new Date(today.setMonth(today.getMonth() + monthsToPayoff));
  
  return {
    highInterestDebts,
    totalHighInterestDebt,
    totalDebt,
    debtToIncomeRatio,
    monthsToPayoff,
    interestPaid,
    debtFreeDate: debtFreeDate.toISOString().split('T')[0],
    hasHighInterestDebt: highInterestDebts.length > 0,
    highInterestDebtCount: highInterestDebts.length
  };
};

// Criar plano de aposentadoria
export const createRetirementPlan = (client: Client): RetirementPlan => {
  // Dados básicos
  const currentAge = client.age || 30;
  const retirementAge = client.retirement?.retirementAge || 65;
  const lifeExpectancy = 85; // Expectativa de vida padrão
  
  // Valores financeiros
  const initialInvestment = client.totalInvestments || 0;
  const monthlyContribution = client.monthlySavingsAverage || 0;
  const targetMonthlyIncome = client.retirement?.desiredPassiveIncome || (client.monthlyNetIncome ? client.monthlyNetIncome * 0.8 : 5000);
  
  // Taxas
  const expectedReturnRate = 0.08; // 8% ao ano
  const inflationRate = 0.04; // 4% ao ano
  const contributionIncreaseRate = 0.03; // 3% ao ano (aumento da contribuição mensal)
  
  // Calcular anos até a aposentadoria
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  
  // Projetar poupança na aposentadoria
  const projectedSavings = projectRetirementSavings(
    initialInvestment,
    monthlyContribution,
    expectedReturnRate,
    contributionIncreaseRate,
    yearsToRetirement
  );
  
  // Calcular idade de independência financeira
  const financialIndependenceAge = calculateFinancialIndependenceAge(
    initialInvestment,
    monthlyContribution,
    expectedReturnRate,
    contributionIncreaseRate,
    targetMonthlyIncome,
    currentAge
  );
  
  // Gerar eventos de liquidez
  const liquidityEvents = generateLiquidityEvents(client, currentAge);
  
  // Gerar dados anuais projetados
  const projectedYearlyData = generateProjectedYearlyData(
    initialInvestment,
    monthlyContribution,
    expectedReturnRate,
    contributionIncreaseRate,
    currentAge,
    retirementAge,
    targetMonthlyIncome
  );
  
  return {
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
    projectedSavings,
    yearsToRetirement,
    financialIndependenceAge,
    liquidityEvents,
    projectedYearlyData
  };
};

// Função auxiliar para projetar poupança na aposentadoria
const projectRetirementSavings = (
  initialAmount: number,
  monthlyContribution: number,
  annualReturnRate: number,
  contributionIncreaseRate: number,
  years: number
): number => {
  let balance = initialAmount;
  let currentContribution = monthlyContribution;
  
  for (let year = 1; year <= years; year++) {
    // Adicionar contribuições mensais para este ano
    for (let month = 1; month <= 12; month++) {
      balance += currentContribution;
      balance *= (1 + annualReturnRate / 12);
    }
    
    // Aumentar a contribuição mensal para o próximo ano
    currentContribution *= (1 + contributionIncreaseRate);
  }
  
  return balance;
};

// Função auxiliar para calcular idade de independência financeira
const calculateFinancialIndependenceAge = (
  initialAmount: number,
  monthlyContribution: number,
  annualReturnRate: number,
  contributionIncreaseRate: number,
  targetMonthlyIncome: number,
  currentAge: number
): number => {
  // Valor necessário para gerar a renda passiva desejada
  // Usando a regra dos 4% (25x a renda anual desejada)
  const targetAmount = targetMonthlyIncome * 12 * 25;
  
  let balance = initialAmount;
  let currentContribution = monthlyContribution;
  let years = 0;
  
  // Projetar até atingir o valor alvo
  while (balance < targetAmount && years < 50) { // Limite de 50 anos para evitar loop infinito
    years++;
    
    // Adicionar contribuições mensais para este ano
    for (let month = 1; month <= 12; month++) {
      balance += currentContribution;
      balance *= (1 + annualReturnRate / 12);
    }
    
    // Aumentar a contribuição mensal para o próximo ano
    currentContribution *= (1 + contributionIncreaseRate);
  }
  
  return currentAge + years;
};

// Função auxiliar para gerar eventos de liquidez
const generateLiquidityEvents = (client: Client, currentAge: number): RetirementPlan['liquidityEvents'] => {
  const events: RetirementPlan['liquidityEvents'] = [];
  const currentYear = new Date().getFullYear();
  
  // Adicionar evento de aposentadoria
  if (client.retirement?.retirementAge) {
    const retirementYear = currentYear + (client.retirement.retirementAge - currentAge);
    events.push({
      description: 'Aposentadoria',
      amount: client.retirement.desiredPassiveIncome * 12, // Renda anual
      date: `${retirementYear}-01-01`,
      year: retirementYear,
      age: client.retirement.retirementAge
    });
  }
  
  // Adicionar eventos para outros objetivos financeiros
  if (client.otherGoals && client.otherGoals.length > 0) {
    client.otherGoals.forEach(goal => {
      // Tentar extrair o ano do prazo
      let targetYear = currentYear + 5; // Valor padrão
      
      if (goal.deadline) {
        const yearMatch = goal.deadline.match(/\d{4}/);
        if (yearMatch) {
          targetYear = parseInt(yearMatch[0]);
        } else {
          // Se não for um ano específico, tentar interpretar como "X anos"
          const yearsMatch = goal.deadline.match(/(\d+)\s*anos?/i);
          if (yearsMatch) {
            targetYear = currentYear + parseInt(yearsMatch[1]);
          }
        }
      }
      
      events.push({
        description: goal.description,
        amount: -goal.amountNeeded, // Valor negativo pois é uma saída
        date: `${targetYear}-01-01`,
        year: targetYear,
        age: currentAge + (targetYear - currentYear)
      });
    });
  }
  
  // Ordenar eventos por data
  return events.sort((a, b) => a.year - b.year);
};

// Função auxiliar para gerar dados anuais projetados
const generateProjectedYearlyData = (
  initialAmount: number,
  monthlyContribution: number,
  annualReturnRate: number,
  contributionIncreaseRate: number,
  currentAge: number,
  retirementAge: number,
  targetMonthlyIncome: number
): RetirementPlan['projectedYearlyData'] => {
  const yearlyData: RetirementPlan['projectedYearlyData'] = [];
  const currentYear = new Date().getFullYear();
  
  let balance = initialAmount;
  let currentContribution = monthlyContribution;
  let totalContributions = initialAmount;
  let totalReturn = 0;
  
  // Projetar até 5 anos após a aposentadoria
  const projectionYears = retirementAge - currentAge + 5;
  
  for (let year = 0; year <= projectionYears; year++) {
    const age = currentAge + year;
    const isRetired = age >= retirementAge;
    
    // Se aposentado, considerar saques mensais
    if (isRetired) {
      const monthlyWithdrawal = targetMonthlyIncome;
      
      // Simular um ano de saques e rendimentos
      for (let month = 1; month <= 12; month++) {
        balance -= monthlyWithdrawal;
        balance = Math.max(0, balance); // Evitar saldo negativo
        balance *= (1 + annualReturnRate / 12);
      }
    } 
    // Se não aposentado, considerar contribuições mensais
    else {
      // Simular um ano de contribuições e rendimentos
      for (let month = 1; month <= 12; month++) {
        const startBalance = balance;
        
        balance += currentContribution;
        totalContributions += currentContribution;
        
        balance *= (1 + annualReturnRate / 12);
        
        // Calcular o retorno deste mês
        totalReturn += balance - startBalance - currentContribution;
      }
      
      // Aumentar a contribuição mensal para o próximo ano
      currentContribution *= (1 + contributionIncreaseRate);
    }
    
    // Calcular potencial de retirada mensal (regra dos 4%)
    const withdrawalPotential = balance * 0.04 / 12;
    
    yearlyData.push({
      age,
      year: currentYear + year,
      savingsBalance: balance,
      contributionsToDate: totalContributions,
      returnToDate: totalReturn,
      withdrawalPotential,
      monthlyContribution: isRetired ? 0 : currentContribution
    });
  }
  
  return yearlyData;
};
