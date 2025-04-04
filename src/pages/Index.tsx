
import React from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { ClientOverview } from "@/components/Dashboard/ClientOverview";
import { CashFlowComparison } from "@/components/Dashboard/CashFlowComparison";
import { BudgetSummary } from "@/components/Dashboard/BudgetSummary";
import { FinancialPlan } from '@/lib/types';

// Sample data for the dashboard
const sampleFinancialPlan: FinancialPlan = {
  client: {
    id: "1",
    name: "João Silva",
    age: 35,
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321"
  },
  currentCashFlow: {
    incomes: [
      { source: "Salário", amount: 26525, frequency: "monthly", percentage: 85 },
      { source: "Consultoria", amount: 4500, frequency: "monthly", percentage: 15 }
    ],
    expenses: [
      { category: "fixed", description: "Aluguel/Financiamento", amount: 5800, percentage: 19 },
      { category: "fixed", description: "Condomínio", amount: 1400, percentage: 5 },
      { category: "fixed", description: "IPTU", amount: 200, percentage: 1 },
      { category: "fixed", description: "Energia", amount: 500, percentage: 2 },
      { category: "fixed", description: "Diarista", amount: 800, percentage: 3 },
      { category: "fixed", description: "Celular", amount: 500, percentage: 2 },
      { category: "fixed", description: "Assinaturas", amount: 200, percentage: 1 },
      { category: "fixed", description: "Personal", amount: 1300, percentage: 4 },
      { category: "fixed", description: "Psicólogo", amount: 600, percentage: 2 },
      { category: "fixed", description: "Médico", amount: 220, percentage: 1 },
      { category: "variable", description: "Alimentação", amount: 3500, percentage: 11 },
      { category: "variable", description: "Lazer", amount: 2500, percentage: 8 },
      { category: "variable", description: "Transporte", amount: 1200, percentage: 4 },
      { category: "variable", description: "Roupas", amount: 1000, percentage: 3 },
      { category: "variable", description: "Presentes", amount: 800, percentage: 3 },
      { category: "variable", description: "Outros", amount: 1549, percentage: 5 }
    ],
    investments: 2175,
    totalIncome: 31025,
    totalExpenses: 22069,
    balance: 8956
  },
  suggestedCashFlow: {
    incomes: [
      { source: "Salário", amount: 26525, frequency: "monthly", percentage: 85 },
      { source: "Consultoria", amount: 4500, frequency: "monthly", percentage: 15 }
    ],
    expenses: [
      { category: "fixed", description: "Aluguel/Financiamento", amount: 5746, percentage: 19 },
      { category: "fixed", description: "Condomínio", amount: 1414, percentage: 5 },
      { category: "fixed", description: "IPTU", amount: 200, percentage: 1 },
      { category: "fixed", description: "Energia", amount: 500, percentage: 2 },
      { category: "fixed", description: "Diarista", amount: 800, percentage: 3 },
      { category: "fixed", description: "Celular", amount: 500, percentage: 2 },
      { category: "fixed", description: "Assinaturas", amount: 292, percentage: 1 },
      { category: "fixed", description: "Personal", amount: 1440, percentage: 5 },
      { category: "fixed", description: "Psicólogo", amount: 750, percentage: 2 },
      { category: "fixed", description: "Médico", amount: 220, percentage: 1 },
      { category: "variable", description: "Alimentação", amount: 2800, percentage: 9 },
      { category: "variable", description: "Lazer", amount: 2000, percentage: 6 },
      { category: "variable", description: "Transporte", amount: 1000, percentage: 3 },
      { category: "variable", description: "Roupas", amount: 800, percentage: 3 },
      { category: "variable", description: "Presentes", amount: 700, percentage: 2 },
      { category: "variable", description: "Outros", amount: 0, percentage: 0 }
    ],
    investments: 4675,
    totalIncome: 31025,
    totalExpenses: 19162,
    balance: 11863
  },
  investments: [
    {
      name: "Reserva de emergência",
      type: "emergency_fund",
      initialValue: 10000,
      currentValue: 10000,
      annualReturn: 14.15,
      investmentDate: new Date("2025-03-23")
    },
    {
      name: "Previdência",
      type: "retirement",
      initialValue: 50000,
      currentValue: 55000,
      annualReturn: 10,
      investmentDate: new Date("2023-01-15")
    }
  ],
  debts: [
    {
      description: "Financiamento do carro",
      outstandingBalance: 45000,
      monthlyPayment: 1200,
      interestRate: 12,
      remainingInstallments: 48
    }
  ],
  assets: [
    {
      description: "Apartamento",
      currentValue: 500000,
      acquisitionValue: 450000,
      acquisitionDate: new Date("2019-06-10")
    },
    {
      description: "Carro",
      currentValue: 90000,
      acquisitionValue: 110000,
      acquisitionDate: new Date("2022-03-15")
    }
  ],
  protections: [
    {
      type: "Seguro de Vida",
      provider: "Seguradora XYZ",
      coverageAmount: 500000,
      monthlyPremium: 120,
      expirationDate: new Date("2025-12-31")
    }
  ],
  financialGoals: [
    {
      description: "Comprar casa",
      targetAmount: 700000,
      targetDate: new Date("2028-01-01"),
      currentSavings: 150000,
      monthlyContribution: 3000
    },
    {
      description: "Trocar carro",
      targetAmount: 100000,
      targetDate: new Date("2027-01-01"),
      currentSavings: 15000,
      monthlyContribution: 1000
    }
  ],
  emergencyFundTarget: 120000,
  emergencyFundCurrent: 10000
};

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-finance-navy">Financial Planning Dashboard</h1>
          <p className="text-gray-600">Overview of the current financial situation and recommendations.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <ClientOverview client={sampleFinancialPlan.client} />
        </div>
        
        <div className="mb-6">
          <CashFlowComparison 
            currentCashFlow={sampleFinancialPlan.currentCashFlow} 
            suggestedCashFlow={sampleFinancialPlan.suggestedCashFlow} 
          />
        </div>
        
        <div className="mb-6">
          <BudgetSummary
            currentExpenses={sampleFinancialPlan.currentCashFlow.expenses}
            suggestedExpenses={sampleFinancialPlan.suggestedCashFlow.expenses}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
