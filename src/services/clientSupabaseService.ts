
import { supabase } from "@/lib/supabase";
import { Client } from "@/lib/types";
import { Database } from "@/lib/database.types";

type ClientRecord = Database['public']['Tables']['clients']['Row'];

// Converter um registro do Supabase para nosso modelo Client
const convertToClient = (record: ClientRecord): Client => {
  const data = record.data as Record<string, any>;
  
  return {
    id: record.id,
    name: record.name,
    age: record.age,
    email: record.email,
    phone: record.phone,
    planner_id: record.planner_id,
    isActive: true,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    ...data
  };
};

// Converter nosso modelo Client para o formato do Supabase
const convertToRecord = (client: Client, plannerId: string): Omit<ClientRecord, 'id' | 'created_at'> & { data: any } => {
  const { id, name, age, email, phone, planner_id, isActive, createdAt, updatedAt, ...data } = client;
  
  return {
    name,
    age,
    email,
    phone,
    planner_id: plannerId,
    updated_at: new Date().toISOString(),
    data
  };
};

// Buscar todos os clientes do planejador
export const getClientsByPlannerId = async (plannerId: string): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('planner_id', plannerId);

  if (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }

  return (data || []).map(convertToClient);
};

// Buscar um cliente por ID
export const getClientById = async (clientId: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Não encontrado
      return null;
    }
    console.error('Erro ao buscar cliente:', error);
    throw error;
  }

  if (!data) return null;
  return convertToClient(data);
};

// Criar ou atualizar um cliente
export const saveClient = async (client: Client, plannerId: string): Promise<Client> => {
  const record = convertToRecord(client, plannerId);

  if (client.id) {
    // Atualizar cliente existente
    const { error } = await supabase
      .from('clients')
      .update(record)
      .eq('id', client.id);

    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }

    return { ...client, updatedAt: record.updated_at };
  } else {
    // Criar novo cliente
    const newId = `c-${Date.now()}`;
    const { error } = await supabase
      .from('clients')
      .insert({
        ...record,
        id: newId,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }

    return {
      ...client,
      id: newId,
      planner_id: plannerId,
      isActive: true,
      createdAt: record.updated_at,
      updatedAt: record.updated_at
    };
  }
};

// Excluir um cliente
export const deleteClient = async (clientId: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  if (error) {
    console.error('Erro ao excluir cliente:', error);
    throw error;
  }
};

// Adicionar cliente de teste (para desenvolvimento)
export const addTestClient = async (plannerId: string): Promise<Client> => {
  const testClient: Client = {
    id: `c-${Date.now()}`,
    name: "João da Silva",
    email: "joao@example.com",
    phone: "(11) 98765-4321",
    age: 35,
    planner_id: plannerId,
    isActive: true,
    profession: "Engenheiro de Software",
    company: "Tech Solutions Ltda",
    birthDate: "1988-05-15",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dados Pessoais
    maritalStatus: "Casado(a)",
    hasChildren: true,
    numberOfChildren: 2,
    childrenAges: [8, 5],
    personalComments: 'João é uma pessoa dedicada e quer garantir uma boa aposentadoria e faculdade para os filhos.',
    
    // Profissão e Trabalho
    jobDescription: 'Trabalha como desenvolvedor full-stack em uma empresa de tecnologia, com foco em JavaScript e TypeScript.',
    workMotivation: "Ambos",
    contractType: "CLT",
    
    // Perfil Financeiro
    moneyProfile: "Meio-termo",
    hasFinancialPlanning: true,
    planningDescription: 'Faz planilha mensal de gastos e tenta economizar parte do salário todo mês.',
    hasSavingHabit: true,
    savingHabitHistory: 'Tem o hábito de poupar há cerca de 5 anos, mas nem sempre consegue manter a disciplina.',
    monthlySavingsAverage: 1500,
    financialProfileComments: 'Deseja ter mais disciplina financeira e aprender a investir melhor o dinheiro poupado.',
    
    // Instituições Bancárias
    banks: ['Nubank', 'Itaú', 'Banco do Brasil'],
    paymentMethod: "Ambos",
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
    taxDeclarationType: "Completo",
    taxResult: "Restituir",
    
    // Receitas
    monthlyNetIncome: 8500,
    additionalIncome: 'Ocasionalmente recebe pela venda de cursos online que produziu (média R$ 1.200/mês).',
    
    // Despesas
    fixedMonthlyExpenses: 'Moradia: R$ 2.500, Alimentação: R$ 1.800, Transporte: R$ 800, Educação dos filhos: R$ 1.600',
    variableExpenses: 'Lazer: ~R$ 1.000, Vestuário: ~R$ 500, Presentes: ~R$ 300',
    
    // Objetivos Financeiros
    retirement: {
      plan: 'Previdência privada e investimentos em renda fixa e variável',
      inssKnowledge: 'Tem conhecimento básico das regras de aposentadoria pelo INSS',
      desiredPassiveIncome: 15000,
      estimatedAmountNeeded: 4000000,
      targetDate: '2045-01-01',
      comments: 'Deseja poder viajar com conforto e ajudar os filhos financeiramente'
    },
    
    otherGoals: [
      {
        description: 'Comprar casa de praia',
        amountNeeded: 600000,
        deadline: '2030-01-01',
        comments: 'Casa de praia no litoral norte de São Paulo'
      },
      {
        description: 'Faculdade dos filhos',
        amountNeeded: 350000,
        deadline: '2033-01-01',
        comments: 'Garantir educação superior de qualidade para os dois filhos'
      }
    ]
  };

  return await saveClient(testClient, plannerId);
};
