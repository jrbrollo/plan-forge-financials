
import { Client, Investment } from "@/lib/types";

/**
 * Cria investimentos com base nas informações do cliente
 */
export const createInvestmentsFromClient = (client: Client): Investment[] => {
  const investments: Investment[] = [];
  const monthlyIncome = client.monthlyNetIncome || client.income || 5000;
  
  if (client.hasInvestments) {
    const totalInvestments = client.totalInvestments || 0;
    
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
    
    // Adicionar investimentos específicos se o cliente tiver uma descrição
    if (client.investmentsDescription) {
      const description = client.investmentsDescription.toLowerCase();
      
      if (description.includes("tesouro") || description.includes("título")) {
        investments.push({
          name: "Tesouro Direto",
          type: "fixed_income",
          initialValue: totalInvestments * 0.15,
          currentValue: totalInvestments * 0.16,
          annualReturn: 11.5,
          investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 4))
        });
      }
      
      if (description.includes("ação") || description.includes("açoes") || description.includes("bolsa")) {
        investments.push({
          name: "Carteira de Ações",
          type: "variable_income",
          initialValue: totalInvestments * 0.2,
          currentValue: totalInvestments * 0.22,
          annualReturn: 15.0,
          investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 9))
        });
      }
      
      if (description.includes("previdência") || description.includes("aposentadoria")) {
        investments.push({
          name: "Previdência Privada",
          type: "retirement",
          initialValue: totalInvestments * 0.25,
          currentValue: totalInvestments * 0.26,
          annualReturn: 9.5,
          investmentDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3))
        });
      }
    }
  } else {
    // Para clientes sem investimentos, criar exemplos de sugestões
    investments.push({
      name: "Reserva de emergência (sugerida)",
      type: "emergency_fund",
      initialValue: monthlyIncome * 6,
      currentValue: monthlyIncome * 6,
      annualReturn: 8.5,
      investmentDate: new Date()
    });
    
    investments.push({
      name: "Renda Fixa (sugerida)",
      type: "fixed_income",
      initialValue: monthlyIncome * 12,
      currentValue: monthlyIncome * 12,
      annualReturn: 12.0,
      investmentDate: new Date()
    });
  }
  
  return investments;
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
