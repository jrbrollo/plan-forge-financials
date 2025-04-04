export interface Client {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  
  // Dados Pessoais
  maritalStatus?: "Solteiro(a)" | "Casado(a)" | "Divorciado(a)" | "Outro";
  hasChildren?: boolean;
  numberOfChildren?: number;
  childrenAges?: number[];
  personalComments?: string;
  
  // Profissão e Trabalho
  profession?: string;
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
  };
  
  otherGoals?: {
    description: string;
    amountNeeded: number;
    deadline: string;
    comments: string;
  }[];
}

export interface Income {
  source: string;
  amount: number;
  frequency: "monthly" | "annual";
  percentage: number;
}

export interface Expense {
  category: "fixed" | "variable";
  description: string;
  amount: number;
  percentage: number;
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
  outstandingBalance: number;
  monthlyPayment: number;
  interestRate: number;
  remainingInstallments: number;
}

export interface Asset {
  description: string;
  currentValue: number;
  acquisitionValue?: number;
  acquisitionDate?: Date;
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
  targetDate: Date;
  currentSavings: number;
  monthlyContribution: number;
}

export interface CashFlow {
  incomes: Income[];
  expenses: Expense[];
  investments: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface FinancialPlan {
  client: Client;
  currentCashFlow: CashFlow;
  suggestedCashFlow: CashFlow;
  investments: Investment[];
  debts: Debt[];
  assets: Asset[];
  protections: Protection[];
  financialGoals: FinancialGoal[];
  emergencyFundTarget: number;
  emergencyFundCurrent: number;
}
