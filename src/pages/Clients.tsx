
import React, { useState } from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientForm } from "@/components/Forms/ClientForm";
import { Client } from "@/lib/types";
import { Plus, Edit, User } from "lucide-react";

// Alguns clientes de exemplo para demonstração
const sampleClients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    age: 35,
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321"
  },
  {
    id: "2",
    name: "Maria Oliveira",
    age: 42,
    email: "maria.oliveira@email.com",
    phone: "(11) 91234-5678"
  }
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [showForm, setShowForm] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
    if (currentClient) {
      // Atualizar cliente existente
      setClients(clients.map(client => 
        client.id === currentClient.id 
          ? { ...clientData, id: currentClient.id } 
          : client
      ));
    } else {
      // Adicionar novo cliente
      const newClient: Client = {
        ...clientData,
        id: `${clients.length + 1}`
      };
      setClients([...clients, newClient]);
    }
    
    setShowForm(false);
    setCurrentClient(null);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentClient(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-finance-navy">Gerenciamento de Clientes</h1>
            <p className="text-gray-600">Cadastre e gerencie seus clientes.</p>
          </div>
          
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} className="mr-1" /> Novo Cliente
            </Button>
          )}
        </div>

        {showForm ? (
          <ClientForm 
            onSave={handleSaveClient}
            onCancel={handleCancelForm}
            initialValues={currentClient || {}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <Card key={client.id} className="finance-card">
                <CardHeader className="pb-2 flex flex-row justify-between items-center">
                  <CardTitle className="text-lg text-finance-navy flex items-center">
                    <User size={18} className="mr-2" /> {client.name}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                    <Edit size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Idade</p>
                      <p className="font-medium">{client.age} anos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" onClick={() => alert(`Ver plano financeiro para ${client.name}`)}>
                    Ver Plano Financeiro
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
