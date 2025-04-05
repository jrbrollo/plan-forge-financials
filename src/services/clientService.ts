import { Client } from "@/lib/types";
import { clientStorage } from "./storageService";

// Reexportar funções do storage para manter compatibilidade
export const getClients = clientStorage.getAll.bind(clientStorage);
export const getClientById = clientStorage.getById.bind(clientStorage);
export const saveClient = clientStorage.save.bind(clientStorage);
export const saveClients = clientStorage.saveAll.bind(clientStorage);
export const deleteClient = clientStorage.delete.bind(clientStorage);

// Funções adicionais para operações relacionadas a clientes

/**
 * Verifica se um cliente tem dados completos
 */
export const isClientProfileComplete = (client: Client): boolean => {
  // Verificar campos básicos de contato
  const hasBasicInfo = Boolean(client.name && client.age && client.email && client.phone);
  
  // Verificar se pelo menos alguns dados adicionais foram preenchidos
  const hasAdditionalInfo = Boolean(
    client.maritalStatus || 
    client.profession || 
    client.workMotivation || 
    client.moneyProfile || 
    client.hasInvestments || 
    client.monthlyNetIncome || 
    (client.debts && client.debts.length > 0) ||
    client.hasProperty ||
    client.hasCar
  );
  
  // Cliente está completo se tem informações básicas e pelo menos uma informação adicional
  return hasBasicInfo && hasAdditionalInfo;
};

/**
 * Obtém os clientes com perfil completo
 */
export const getClientsWithCompleteProfile = (): Client[] => {
  const clients = getClients();
  return clients.filter(isClientProfileComplete);
};

/**
 * Obtém os clientes com perfil incompleto
 */
export const getClientsWithIncompleteProfile = (): Client[] => {
  const clients = getClients();
  return clients.filter(client => !isClientProfileComplete(client));
};

/**
 * Busca clientes por texto
 */
export const searchClients = (searchTerm: string): Client[] => {
  if (!searchTerm) return getClients();
  
  const term = searchTerm.toLowerCase().trim();
  
  return getClients().filter(client => {
    // Buscar em campos comuns
    return (
      (client.name && client.name.toLowerCase().includes(term)) ||
      (client.email && client.email.toLowerCase().includes(term)) ||
      (client.phone && client.phone.toLowerCase().includes(term)) ||
      (client.profession && client.profession.toLowerCase().includes(term))
    );
  });
};

/**
 * Filtrar clientes por critérios
 */
export const filterClients = (criteria: {
  hasInvestments?: boolean,
  hasProperty?: boolean,
  hasCar?: boolean,
  hasDebts?: boolean,
  hasInsurance?: boolean,
  ageRange?: [number, number]
}): Client[] => {
  let filteredClients = getClients();
  
  if (criteria.hasInvestments !== undefined) {
    filteredClients = filteredClients.filter(client => 
      Boolean(client.hasInvestments) === criteria.hasInvestments
    );
  }
  
  if (criteria.hasProperty !== undefined) {
    filteredClients = filteredClients.filter(client => 
      Boolean(client.hasProperty) === criteria.hasProperty
    );
  }
  
  if (criteria.hasCar !== undefined) {
    filteredClients = filteredClients.filter(client => 
      Boolean(client.hasCar) === criteria.hasCar
    );
  }
  
  if (criteria.hasDebts !== undefined) {
    filteredClients = filteredClients.filter(client => 
      (criteria.hasDebts ? (client.debts && client.debts.length > 0) : (!client.debts || client.debts.length === 0))
    );
  }
  
  if (criteria.hasInsurance !== undefined) {
    filteredClients = filteredClients.filter(client => 
      (criteria.hasInsurance ? 
        (client.hasHealthInsurance || client.hasLifeInsurance || client.hasAssetInsurance) : 
        (!client.hasHealthInsurance && !client.hasLifeInsurance && !client.hasAssetInsurance))
    );
  }
  
  if (criteria.ageRange) {
    const [minAge, maxAge] = criteria.ageRange;
    filteredClients = filteredClients.filter(client => 
      client.age >= minAge && client.age <= maxAge
    );
  }
  
  return filteredClients;
};

/**
 * Adiciona um cliente de teste para desenvolvimento
 */
export const addTestClient = () => {
  const testClient = {
    id: "c-" + Date.now(),
    name: "João da Silva",
    email: "joao@example.com",
    phone: "(11) 98765-4321",
    age: 35,
    profession: "Engenheiro de Software",
    company: "Tech Solutions Ltda",
    birthDate: "1988-05-15",
    
    // Dados Pessoais
    maritalStatus: "Casado(a)",
    hasChildren: true,
    numberOfChildren: 2,
    childrenAges: [8, 5],
    personalComments: 'João é uma pessoa dedicada e quer garantir uma boa aposentadoria e faculdade para os filhos.',
    
    // Profissão e Trabalho
    jobDescription: 'Trabalha como desenvolvedor full-stack em uma empresa de tecnologia, com foco em JavaScript e TypeScript.',
    workMotivation: 'Ambos',
    contractType: 'CLT',
    
    // Perfil Financeiro
    moneyProfile: 'Meio-termo',
    hasFinancialPlanning: true,
    planningDescription: 'Faz planilha mensal de gastos e tenta economizar parte do salário todo mês.',
    hasSavingHabit: true,
    savingHabitHistory: 'Tem o hábito de poupar há cerca de 5 anos, mas nem sempre consegue manter a disciplina.',
    monthlySavingsAverage: 1500,
    financialProfileComments: 'Deseja ter mais disciplina financeira e aprender a investir melhor o dinheiro poupado.',
    
    // Instituições Bancárias
    banks: ['Nubank', 'Itaú', 'Banco do Brasil'],
    paymentMethod: 'Ambos',
    creditCards: ['Nubank', 'Itaú Platinum'],
    creditCardBillAverage: 2500,
    
    // Carro
    hasCar: true,
    isCarPaidOff: false,
    carMarketValue: 45000,
    carMonthlyPayment: 850,
    carPaymentRemaining: '18 meses',
    
    // Imóvel
    hasProperty: true,
    isPropertyPaidOff: false,
    propertyMarketValue: 450000,
    propertyMonthlyPayment: 2200,
    propertyPaymentRemaining: '15 anos',
    
    // Outros bens
    otherAssets: 'Possui uma moto Honda CB 500 quitada (R$ 25.000) e uma bicicleta elétrica (R$ 8.000).',
    
    // Investimentos
    hasInvestments: true,
    totalInvestments: 65000,
    hasDiversifiedPortfolio: true,
    investmentsDescription: 'Possui R$ 30.000 em Tesouro Direto, R$ 20.000 em fundos de investimento e R$ 15.000 em ações de empresas brasileiras.',
    selfManagesInvestments: true,
    
    // Dívidas
    debts: [
      {
        value: 12000,
        monthlyPayment: 500,
        reason: 'Empréstimo para reforma do apartamento'
      }
    ],
    
    // Proteções
    hasHealthInsurance: true,
    hasLifeInsurance: true,
    hasAssetInsurance: true,
    
    // Imposto de Renda
    taxDeclarationType: 'Completo',
    taxResult: 'Restituir',
    
    // Receitas
    income: 8500,
    incomeFrequency: "monthly" as const,
    monthlyNetIncome: 8500,
    additionalIncome: 'Ocasionalmente faz freelas de programação, com média de R$ 2.000 extras por trimestre.',
    
    // Despesas
    fixedMonthlyExpenses: 'Moradia (financiamento): R$ 2.200, Carro: R$ 850, Escola dos filhos: R$ 1.800, Plano de saúde: R$ 1.200, Supermercado: R$ 1.500',
    variableExpenses: 'Lazer: média de R$ 800, Alimentação fora: R$ 600, Despesas extras com filhos: cerca de R$ 500',
    
    // Objetivos Financeiros - Aposentadoria
    retirement: {
      plan: 'Deseja parar de trabalhar aos 60 anos com uma renda passiva suficiente para manter o padrão de vida atual.',
      inssKnowledge: 'Tem conhecimento básico, sabe que precisará complementar a aposentadoria do INSS.',
      desiredPassiveIncome: 10000,
      estimatedAmountNeeded: 2500000,
      targetDate: '25 anos',
      comments: 'Está preocupado se conseguirá acumular o patrimônio necessário para a aposentadoria desejada.'
    },
    
    // Objetivos Financeiros - Outros
    otherGoals: [
      {
        description: 'Faculdade dos filhos',
        amountNeeded: 200000,
        deadline: '10 anos',
        comments: 'Gostaria de garantir boa educação superior para os dois filhos.'
      },
      {
        description: 'Troca de carro',
        amountNeeded: 80000,
        deadline: '5 anos',
        comments: 'Deseja trocar o carro atual por um modelo mais moderno após quitar o financiamento.'
      }
    ],
    
    address: {
      street: "Av. Paulista",
      number: "1000",
      complement: "Apto 123",
      city: "São Paulo",
      state: "SP",
      zipcode: "01310-100"
    },
    
    financialProfile: {
      riskTolerance: "medium",
      investmentExperience: "intermediate",
      retirementAge: 65,
      hasFinancialGoals: true,
      hasDependents: true
    },
    
    insuranceStatus: {
      lifeInsurance: true,
      healthInsurance: true,
      homeInsurance: false,
      autoInsurance: true,
      disabilityInsurance: false
    },
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const clients = getClients();
  clients.push(testClient);
  saveClients(clients);
  return testClient;
};
