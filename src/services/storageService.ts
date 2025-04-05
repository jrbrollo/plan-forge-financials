import { Client, FinancialPlan, Investment, Protection } from "@/lib/types";

// Prefixo para as chaves no localStorage
const STORAGE_KEYS = {
  CLIENTS: 'clients',
  FINANCIAL_PLANS: 'plan_forge_financial_plans',
  INVESTMENTS: 'plan_forge_investments',
  PROTECTIONS: 'plan_forge_protections',
  BACKUP: 'plan_forge_backup',
  LAST_BACKUP: 'plan_forge_last_backup'
};

// Interface para objetos que podem ser armazenados
interface StorageItem {
  id: string;
  [key: string]: any;
}

/**
 * Serviço genérico para armazenamento de dados
 */
class StorageService<T extends StorageItem> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // Obter todos os itens
  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Erro ao obter dados de ${this.storageKey}:`, error);
      return [];
    }
  }

  // Obter um item pelo ID
  getById(id: string): T | undefined {
    try {
      const items = this.getAll();
      return items.find(item => item.id === id);
    } catch (error) {
      console.error(`Erro ao obter item por ID de ${this.storageKey}:`, error);
      return undefined;
    }
  }

  // Salvar ou atualizar um item
  save(item: T): void {
    try {
      const items = this.getAll();
      const index = items.findIndex(i => i.id === item.id);
      
      if (index !== -1) {
        // Atualizar item existente
        items[index] = item;
      } else {
        // Adicionar novo item
        items.push(item);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      this.createBackup(); // Criar backup após cada modificação
    } catch (error) {
      console.error(`Erro ao salvar item em ${this.storageKey}:`, error);
    }
  }

  // Salvar vários itens
  saveAll(items: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      this.createBackup(); // Criar backup após cada modificação
    } catch (error) {
      console.error(`Erro ao salvar itens em ${this.storageKey}:`, error);
    }
  }

  // Deletar um item pelo ID
  delete(id: string): void {
    try {
      const items = this.getAll();
      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedItems));
      this.createBackup(); // Criar backup após cada modificação
    } catch (error) {
      console.error(`Erro ao deletar item de ${this.storageKey}:`, error);
    }
  }

  // Limpar todos os itens
  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error(`Erro ao limpar ${this.storageKey}:`, error);
    }
  }

  // Criar backup dos dados
  private createBackup(): void {
    try {
      // Armazenar data do último backup
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, now);
      
      // Dados de backup
      const backup = {
        timestamp: now,
        [this.storageKey]: localStorage.getItem(this.storageKey)
      };
      
      // Obter backups existentes ou criar um novo array
      const existingBackup = localStorage.getItem(STORAGE_KEYS.BACKUP);
      const backups = existingBackup ? JSON.parse(existingBackup) : [];
      
      // Adicionar novo backup (manter apenas os 5 mais recentes)
      backups.push(backup);
      if (backups.length > 5) {
        backups.shift(); // Remover o backup mais antigo
      }
      
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backups));
    } catch (error) {
      console.error('Erro ao criar backup:', error);
    }
  }

  // Restaurar dados do último backup
  restoreFromBackup(): boolean {
    try {
      const backups = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backups) return false;
      
      const backupArray = JSON.parse(backups);
      if (backupArray.length === 0) return false;
      
      // Obter o backup mais recente
      const latestBackup = backupArray[backupArray.length - 1];
      
      // Restaurar dados
      if (latestBackup[this.storageKey]) {
        localStorage.setItem(this.storageKey, latestBackup[this.storageKey]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }

  // Exportar dados para JSON
  exportData(): string {
    try {
      const data = this.getAll();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error(`Erro ao exportar dados de ${this.storageKey}:`, error);
      return "[]";
    }
  }

  // Importar dados de JSON
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as T[];
      this.saveAll(data);
      return true;
    } catch (error) {
      console.error(`Erro ao importar dados para ${this.storageKey}:`, error);
      return false;
    }
  }
}

// Estendendo os tipos para adicionar IDs quando necessário
interface FinancialPlanWithId extends FinancialPlan, StorageItem {
  id: string;
}

interface InvestmentWithId extends Investment, StorageItem {
  id: string;
}

interface ProtectionWithId extends Protection, StorageItem {
  id: string;
}

// Instâncias para cada tipo de dado
export const clientStorage = new StorageService<Client>(STORAGE_KEYS.CLIENTS);
export const financialPlanStorage = new StorageService<FinancialPlanWithId>(STORAGE_KEYS.FINANCIAL_PLANS);
export const investmentStorage = new StorageService<InvestmentWithId>(STORAGE_KEYS.INVESTMENTS);
export const protectionStorage = new StorageService<ProtectionWithId>(STORAGE_KEYS.PROTECTIONS);

// Funções para manter compatibilidade com o código existente
export const getClients = (): Client[] => clientStorage.getAll();
export const getClientById = (id: string): Client | undefined => clientStorage.getById(id);
export const saveClient = (client: Client): void => clientStorage.save(client);
export const saveClients = (clients: Client[]): void => clientStorage.saveAll(clients);
export const deleteClient = (id: string): void => clientStorage.delete(id);

// Função de utilidade para exportar todos os dados do aplicativo
export const exportAllData = (): string => {
  try {
    const appData = {
      clients: clientStorage.getAll(),
      financialPlans: financialPlanStorage.getAll(),
      investments: investmentStorage.getAll(),
      protections: protectionStorage.getAll(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(appData, null, 2);
  } catch (error) {
    console.error('Erro ao exportar todos os dados:', error);
    return "{}";
  }
};

// Função de utilidade para importar todos os dados do aplicativo
export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.clients) clientStorage.saveAll(data.clients);
    if (data.financialPlans) financialPlanStorage.saveAll(data.financialPlans);
    if (data.investments) investmentStorage.saveAll(data.investments);
    if (data.protections) protectionStorage.saveAll(data.protections);
    
    return true;
  } catch (error) {
    console.error('Erro ao importar todos os dados:', error);
    return false;
  }
}; 