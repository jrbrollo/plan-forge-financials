
export interface Client {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
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
