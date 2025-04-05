
import { Client, Investment } from "@/lib/types";

/**
 * Cria investimentos com base nas informações do cliente
 */
export const createInvestmentsFromClient = (client: Client): Investment[] => {
  const investments: Investment[] = [];
  
  // Se o cliente não tem investimentos, retorne uma lista vazia
  if (!client.hasInvestments || !client.totalInvestments) {
    return [];
  }
  
  // Obter o valor total de investimentos do cliente
  const totalInvestments = client.totalInvestments || 0;
  
  // Analisar a descrição de investimentos para criar investimentos específicos
  if (client.investmentsDescription) {
    const description = client.investmentsDescription.toLowerCase();
    
    // Tesouro Direto
    if (description.includes("tesouro") || description.includes("título")) {
      const value = extractValueFromDescription(description, "tesouro", 0.45);
      investments.push({
        name: "Tesouro Direto",
        type: "fixed_income",
        initialValue: value,
        currentValue: value,
        annualReturn: 11.5,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 4))
      });
    }
    
    // Fundos de investimento
    if (description.includes("fundos") || description.includes("fundo")) {
      const value = extractValueFromDescription(description, "fundo", 0.3);
      investments.push({
        name: "Fundos de Investimento",
        type: "real_estate",
        initialValue: value,
        currentValue: value,
        annualReturn: 8.5,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 6))
      });
    }
    
    // Ações
    if (description.includes("ação") || description.includes("ações") || description.includes("bolsa")) {
      const value = extractValueFromDescription(description, "ações", 0.25);
      investments.push({
        name: "Carteira de Ações",
        type: "variable_income",
        initialValue: value,
        currentValue: value,
        annualReturn: 14.0,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 9))
      });
    }
    
    // Previdência
    if (description.includes("previdência") || description.includes("aposentadoria")) {
      const value = totalInvestments * 0.20; // 20% para previdência se não especificado
      investments.push({
        name: "Previdência Privada",
        type: "retirement",
        initialValue: value,
        currentValue: value,
        annualReturn: 9.5,
        investmentDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3))
      });
    }
  }
  
  // Se ainda não temos investimentos ou não temos o suficiente para cobrir o total
  // vamos criar investimentos padrão para cobrir o valor total
  if (investments.length === 0) {
    // Distribuir o total em diferentes investimentos com base nas preferências do cliente
    if (client.hasDiversifiedPortfolio) {
      // Carteira diversificada
      investments.push({
        name: "Reserva de emergência",
        type: "emergency_fund",
        initialValue: totalInvestments * 0.2,
        currentValue: totalInvestments * 0.2,
        annualReturn: 8.5,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 6))
      });
      
      investments.push({
        name: "Renda Fixa",
        type: "fixed_income",
        initialValue: totalInvestments * 0.3,
        currentValue: totalInvestments * 0.32,
        annualReturn: 12.0,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 12))
      });
      
      investments.push({
        name: "Previdência Privada",
        type: "retirement",
        initialValue: totalInvestments * 0.25,
        currentValue: totalInvestments * 0.26,
        annualReturn: 9.5,
        investmentDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2))
      });
      
      investments.push({
        name: "Ações",
        type: "variable_income",
        initialValue: totalInvestments * 0.15,
        currentValue: totalInvestments * 0.14,
        annualReturn: 14.5,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 8))
      });
      
      investments.push({
        name: "Fundos Imobiliários",
        type: "real_estate",
        initialValue: totalInvestments * 0.1,
        currentValue: totalInvestments * 0.08,
        annualReturn: 6.0,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 10))
      });
    } else {
      // Carteira não diversificada (mais concentrada)
      investments.push({
        name: "Reserva de emergência",
        type: "emergency_fund",
        initialValue: totalInvestments * 0.3,
        currentValue: totalInvestments * 0.3,
        annualReturn: 8.5,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 6))
      });
      
      investments.push({
        name: client.selfManagesInvestments ? "Renda Fixa" : "Poupança",
        type: "fixed_income",
        initialValue: totalInvestments * 0.7,
        currentValue: totalInvestments * 0.7,
        annualReturn: client.selfManagesInvestments ? 12.0 : 6.0,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 12))
      });
    }
  } else {
    // Verificar se o total dos investimentos criados corresponde ao total do cliente
    const currentTotal = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    if (currentTotal < totalInvestments) {
      // Adicionar reserva de emergência com o valor restante
      investments.push({
        name: "Reserva de emergência",
        type: "emergency_fund",
        initialValue: totalInvestments - currentTotal,
        currentValue: totalInvestments - currentTotal,
        annualReturn: 8.5,
        investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 6))
      });
    }
  }
  
  // Recalcular os valores para garantir que a soma está correta
  const generatedTotal = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  if (generatedTotal !== totalInvestments && investments.length > 0) {
    // Ajustar o último investimento para que a soma total seja exatamente igual ao totalInvestments
    const lastInvestment = investments[investments.length - 1];
    const difference = totalInvestments - (generatedTotal - lastInvestment.currentValue);
    lastInvestment.currentValue = difference;
    lastInvestment.initialValue = difference;
  }
  
  return investments;
};

/**
 * Extrai um valor de um texto de descrição com base em uma palavra-chave
 */
const extractValueFromDescription = (description: string, keyword: string, defaultPercentage: number): number => {
  const regex = new RegExp(`(R\\$\\s*[\\d.,]+|[\\d.,]+\\s*mil|[\\d.,]+)\\s*(em|de|para)?\\s*${keyword}`, 'i');
  const match = description.match(regex);
  
  if (match && match[1]) {
    const valueStr = match[1].trim().replace('R$', '').replace('.', '').replace(',', '.').replace('mil', '000');
    return parseFloat(valueStr);
  }
  
  // Se não encontrou um valor específico, use a porcentagem padrão
  const totalInvestmentsRegex = /R\$\s*([\d.,]+)/g;
  let totalMatch;
  let lastTotalMatch = null;
  
  while ((totalMatch = totalInvestmentsRegex.exec(description)) !== null) {
    lastTotalMatch = totalMatch;
  }
  
  if (lastTotalMatch) {
    const totalStr = lastTotalMatch[1].replace('.', '').replace(',', '.');
    const total = parseFloat(totalStr);
    if (!isNaN(total)) {
      return total * defaultPercentage;
    }
  }
  
  return 0;
};

/**
 * Calcula o total investido por um cliente
 */
export const calculateTotalInvestments = (client: Client): number => {
  if (!client.hasInvestments) return 0;
  return client.totalInvestments || 0;
};

/**
 * Determina se um cliente tem uma carteira diversificada
 */
export const hasPortfolioDiversification = (client: Client): boolean => {
  return Boolean(client.hasInvestments && client.hasDiversifiedPortfolio);
};
