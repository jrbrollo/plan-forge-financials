
export interface Client {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  profession?: string;
  company?: string;
  birthDate?: string;
  income?: number;
  incomeFrequency?: 'monthly' | 'annual';
  address?: {
    street: string;
    number?: string;
    complement?: string;
    city: string;
    state?: string;
    zipcode?: string;
  };
  financialProfile?: {
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentExperience?: 'none' | 'beginner' | 'intermediate' | 'advanced';
    retirementAge?: number;
    hasFinancialGoals?: boolean;
    hasDependents?: boolean;
  };
  insuranceStatus?: {
    lifeInsurance: boolean;
    healthInsurance: boolean;
    homeInsurance: boolean;
    autoInsurance: boolean;
    disabilityInsurance: boolean;
  };
  createdAt: string;
  updatedAt: string;
  
  // Dados Pessoais
  maritalStatus?: "Solteiro(a)" | "Casado(a)" | "Divorciado(a)" | "Outro";
  hasChildren?: boolean;
  numberOfChildren?: number;
  childrenAges?: number[];
  personalComments?: string;
  
  // Profissão e Trabalho
  jobDescription?: string;
  workMotivation?: "Amor" | "Dinheiro" | "Ambos";
  contractType?: "CLT" | "PJ" | "Concursado" | "Outro";
  
  // Perfil Financeiro
  moneyProfile?: "Gastador" | "Meio-termo" | "Controlado";
  hasFinancialPlanning?: boolean;
  planningDescription?: string;
  hasSavingHabit?: boolean;
  savingHabitHistory?: string;
  monthlySavingsAverage?: number;
  financialProfileComments?: string;
  
  // Instituições Bancárias
  banks?: string[];
  paymentMethod?: "Cartão de crédito" | "Cartão de débito" | "Ambos";
  creditCards?: string[];
  creditCardBillAverage?: number;
  
  // Carro
  hasCar?: boolean;
  isCarPaidOff?: boolean;
  carMarketValue?: number;
  carMonthlyPayment?: number;
  carPaymentRemaining?: string;
  
  // Imóvel
  hasProperty?: boolean;
  isPropertyPaidOff?: boolean;
  propertyMarketValue?: number;
  propertyMonthlyPayment?: number;
  propertyPaymentRemaining?: string;
  
  // Outros bens
  otherAssets?: string;
  
  // Investimentos
  hasInvestments?: boolean;
  totalInvestments?: number;
  hasDiversifiedPortfolio?: boolean;
  investmentsDescription?: string;
  selfManagesInvestments?: boolean;
  
  // Dívidas
  debts?: {
    value: number;
    monthlyPayment: number;
    reason: string;
  }[];
  
  // Proteções
  hasHealthInsurance?: boolean;
  hasLifeInsurance?: boolean;
  hasAssetInsurance?: boolean;
  
  // Imposto de Renda
  taxDeclarationType?: "Simplificado" | "Completo";
  taxResult?: "Pagar" | "Restituir";
  
  // Receitas
  monthlyNetIncome?: number;
  additionalIncome?: string;
  
  // Despesas
  fixedMonthlyExpenses?: string;
  variableExpenses?: string;
  
  // Objetivos Financeiros
  retirement?: {
    plan: string;
    inssKnowledge: string;
    desiredPassiveIncome: number;
    estimatedAmountNeeded: number;
    targetDate: string;
    comments: string;
    retirementAge?: number;
    targetIncome?: number;
  };
  
  otherGoals?: {
    description: string;
    amountNeeded: number;
    deadline: string;
    comments: string;
  }[];
  
  planner_id: string;
  isActive: boolean;

  // Add emergencyFund property
  emergencyFund?: {
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
    targetMonths: number;
  };
}

export interface Income {
  source?: string;
  description: string;
  amount: number;
  frequency: "monthly" | "annual" | "one_time";
  percentage?: number;
}

export interface Expense {
  description: string;
  amount: number;
  category?: string;
  percentage?: number;
  isEssential?: boolean;
}

export interface Investment {
  name: string;
  type: string;
  initialValue: number;
  currentValue: number;
  annualReturn: number;
  investmentDate: Date;
}

export interface Debt {
  description: string;
  currentValue: number;
  interestRate: number;
  monthlyPayment: number;
  remainingMonths: number;
}

export interface Asset {
  description: string;
  currentValue: number;
  acquisitionDate: string;
  type: 'real_estate' | 'investment' | 'vehicle' | 'other';
  expectedReturn?: number;
}

export interface Protection {
  type: string;
  provider: string;
  coverageAmount: number;
  monthlyPremium: number;
  expirationDate?: Date;
}

export interface FinancialGoal {
  description: string;
  targetAmount: number;
  currentSavings: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CashFlow {
  income: {
    description: string;
    amount: number;
    frequency: 'monthly' | 'annual' | 'one_time';
  }[];
  expenses: {
    description: string;
    amount: number;
    category: string;
    isEssential: boolean;
  }[];
}

export interface FinancialPlan {
  financialGoals: FinancialGoal[];
  assets: Asset[];
  debts: Debt[];
  currentCashFlow: CashFlow;
  suggestedCashFlow: CashFlow;
  emergencyFund: number;
  emergencyFundTarget: number;
}

export interface FinancialHealth {
  overallScore: number;
  overallStatus: string;
  scoreTrend: number;
  netWorth: number;
  debtToIncomeRatio: number;
  emergencyFundMonths: number;
  emergencyFundStatus: 'sufficient' | 'insufficient' | 'excessive';
  savingsRate: number;
}

export interface InvestmentProjection {
  initialInvestment: number;
  monthlyContribution: number;
  expectedReturnRate: number;
  targetAmount: number;
  yearsToRetirement: number;
  projectedValue5Years: number;
  projectedValue10Years: number;
  projectedValue20Years: number;
}

export interface DebtAnalysis {
  highInterestDebts: Debt[];
  totalHighInterestDebt: number;
  totalDebt: number;
  debtToIncomeRatio: number;
  monthsToPayoff: number;
  interestPaid: number;
  debtFreeDate: string;
  hasHighInterestDebt: boolean;
  highInterestDebtCount: number;
}

export interface LiquidityEvent {
  description: string;
  amount: number;
  date: string;
  year: number;
  age: number;
}

export interface RetirementPlan {
  initialInvestment: number;
  monthlyContribution: number;
  contributionIncreaseRate: number;
  expectedReturnRate: number;
  inflationRate: number;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  targetMonthlyIncome: number;
  currentSavings: number;
  projectedSavings: number;
  yearsToRetirement: number;
  financialIndependenceAge: number;
  liquidityEvents: LiquidityEvent[];
  projectedYearlyData: {
    age: number;
    year: number;
    savingsBalance: number;
    contributionsToDate: number;
    returnToDate: number;
    withdrawalPotential: number;
    monthlyContribution: number;
  }[];
}

export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface Planner {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}
