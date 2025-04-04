
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientForm } from "@/components/Forms/ClientForm";
import { toast } from "@/hooks/use-toast";
import type { Client } from '@/lib/types';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Load clients from localStorage on component mount
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  // Save clients to localStorage whenever the clients state changes
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const handleAddClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(), // Generate a simple ID
    };
    
    setClients([...clients, newClient]);
    setShowAddForm(false);
    toast({
      title: "Cliente adicionado",
      description: "O cliente foi adicionado com sucesso."
    });
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Clientes</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddForm(true)} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Cliente
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <ClientForm
            onSave={handleAddClient}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-gray-500 mb-4">Nenhum cliente cadastrado</p>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Cliente
              </Button>
            )}
          </CardContent>
        </Card>
      ) : filteredClients.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Nenhum cliente encontrado com o termo "{searchTerm}"</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.age}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/clients/${client.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> Detalhes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clients;
