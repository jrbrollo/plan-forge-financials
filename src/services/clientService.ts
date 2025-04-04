
import { Client } from "@/lib/types";

// Salvar os clientes no localStorage
export const saveClients = (clients: Client[]): void => {
  try {
    localStorage.setItem('clients', JSON.stringify(clients));
  } catch (error) {
    console.error("Erro ao salvar clientes:", error);
  }
};

// Obter os clientes do localStorage
export const getClients = (): Client[] => {
  try {
    const clientsData = localStorage.getItem('clients');
    return clientsData ? JSON.parse(clientsData) : [];
  } catch (error) {
    console.error("Erro ao recuperar clientes:", error);
    return [];
  }
};

// Obter um cliente específico pelo ID
export const getClientById = (clientId: string): Client | undefined => {
  try {
    const clients = getClients();
    return clients.find(client => client.id === clientId);
  } catch (error) {
    console.error("Erro ao obter cliente por ID:", error);
    return undefined;
  }
};

// Salvar um cliente (novo ou atualizado)
export const saveClient = (client: Client): void => {
  try {
    const clients = getClients();
    const index = clients.findIndex(c => c.id === client.id);
    
    if (index !== -1) {
      // Atualizar cliente existente
      clients[index] = client;
    } else {
      // Adicionar novo cliente
      clients.push(client);
    }
    
    saveClients(clients);
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
  }
};

// Deletar um cliente pelo ID
export const deleteClient = (clientId: string): void => {
  try {
    const clients = getClients();
    const updatedClients = clients.filter(client => client.id !== clientId);
    saveClients(updatedClients);
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
  }
};
