// Script para depurar o localStorage

// Função para imprimir o conteúdo atual dos clientes no localStorage
function printClients() {
  console.log("====== Clientes atuais no localStorage ======");
  try {
    const clientsData = localStorage.getItem('clients');
    if (clientsData) {
      const clients = JSON.parse(clientsData);
      console.log(`Total de clientes: ${clients.length}`);
      clients.forEach((client, index) => {
        console.log(`Cliente ${index + 1}: ${client.name} (ID: ${client.id})`);
        console.log(`Email: ${client.email}`);
        console.log(`Idade: ${client.age}`);
        console.log('-------------------');
      });
    } else {
      console.log("Nenhum cliente encontrado no localStorage");
    }
  } catch (error) {
    console.error("Erro ao recuperar clientes:", error);
  }
  console.log("============================================");
}

// Função para adicionar o cliente João de teste ao localStorage
function addTestClient() {
  const clienteJoao = {
    id: 'joao-' + Date.now().toString(),
    name: 'João da Silva',
    age: 35,
    email: 'joao.silva@example.com',
    phone: '(11) 98765-4321',
    
    // Dados Pessoais
    maritalStatus: 'Casado(a)',
    hasChildren: true,
    numberOfChildren: 2,
    childrenAges: [8, 5],
    personalComments: 'João é uma pessoa dedicada e quer garantir uma boa aposentadoria e faculdade para os filhos.',
    
    // Profissão e Trabalho
    profession: 'Programador',
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
    hasLifeInsurance: false,
    hasAssetInsurance: true,
    
    // Imposto de Renda
    taxDeclarationType: 'Completo',
    taxResult: 'Restituir',
    
    // Receitas
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
    ]
  };

  // Obter clientes existentes
  let clients = [];
  try {
    const existingClients = localStorage.getItem('clients');
    if (existingClients) {
      clients = JSON.parse(existingClients);
    }
  } catch (error) {
    console.error('Erro ao obter clientes existentes:', error);
  }
  
  // Verificar se é um array
  if (!Array.isArray(clients)) {
    clients = [];
  }
  
  // Adicionar o cliente
  clients.push(clienteJoao);
  
  // Salvar no localStorage
  localStorage.setItem('clients', JSON.stringify(clients));
  
  console.log('Cliente de teste João adicionado com sucesso!');
}

// Função para limpar todos os clientes
function clearAllClients() {
  localStorage.removeItem('clients');
  console.log('Todos os clientes foram removidos do localStorage');
}

// Mostra a ajuda
console.log(`
Para usar este script de depuração no console do navegador:
- printClients(): Mostra todos os clientes atuais no localStorage
- addTestClient(): Adiciona um cliente de teste (João)
- clearAllClients(): Remove todos os clientes do localStorage
`);

// Exportar funções para o objeto global (window) para acesso via console
window.printClients = printClients;
window.addTestClient = addTestClient;
window.clearAllClients = clearAllClients; 