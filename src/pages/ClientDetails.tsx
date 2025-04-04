
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, BarChart3, PiggyBank, TrendingUp, Shield, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientOverview } from "@/components/Dashboard/ClientOverview";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import type { Client } from '@/lib/types';

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock function to fetch client data - in a real app, this would be an API call
  useEffect(() => {
    // Mock data retrieval from localStorage - in a real app, this would come from a database
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      const clients = JSON.parse(storedClients);
      const foundClient = clients.find((c: Client) => c.id === clientId);
      if (foundClient) {
        setClient(foundClient);
      }
    }
    setLoading(false);
  }, [clientId]);

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      // Mock deletion - in a real app, this would be an API call
      const storedClients = localStorage.getItem('clients');
      if (storedClients) {
        const clients = JSON.parse(storedClients);
        const updatedClients = clients.filter((c: Client) => c.id !== clientId);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso."
        });
        navigate('/clients');
      }
    }
  };

  const handleNavigateToModule = (module: string) => {
    navigate(`/${module}`, { state: { clientId } });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p>Carregando detalhes do cliente...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-4 justify-center items-center h-64">
          <p className="text-lg">Cliente não encontrado</p>
          <Button onClick={() => navigate('/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Clientes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">{client.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" /> Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="col-span-1 md:col-span-4 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Módulos Financeiros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleNavigateToModule('budget')}
              >
                <Wallet className="h-6 w-6" />
                <span>Orçamento</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleNavigateToModule('cash-flow')}
              >
                <TrendingUp className="h-6 w-6" />
                <span>Fluxo de Caixa</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleNavigateToModule('emergency-fund')}
              >
                <PiggyBank className="h-6 w-6" />
                <span>Fundo de Emergência</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleNavigateToModule('income-protection')}
              >
                <Shield className="h-6 w-6" />
                <span>Proteção de Renda</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleNavigateToModule('investments')}
              >
                <BarChart3 className="h-6 w-6" />
                <span>Investimentos</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleNavigateToModule('retirement')}
              >
                <PiggyBank className="h-6 w-6" />
                <span>Aposentadoria</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ClientOverview client={client} />

      <div className="mt-6">
        <Tabs defaultValue="personal">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="professional">Profissão</TabsTrigger>
            <TabsTrigger value="financial">Perfil Financeiro</TabsTrigger>
            <TabsTrigger value="assets">Bens e Dívidas</TabsTrigger>
            <TabsTrigger value="investments">Investimentos</TabsTrigger>
            <TabsTrigger value="goals">Objetivos</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataItem label="Nome completo" value={client.name} />
              <DataItem label="Idade" value={client.age.toString()} />
              <DataItem label="Email" value={client.email} />
              <DataItem label="Telefone" value={client.phone} />
              {/* Aqui seriam exibidos os dados adicionais do formulário detalhado */}
            </div>
          </TabsContent>

          <TabsContent value="professional" className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Profissão e Trabalho</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataItem label="Profissão" value="Dados ainda não disponíveis" />
              <DataItem label="Tipo de contrato" value="Dados ainda não disponíveis" />
            </div>
          </TabsContent>

          <TabsContent value="financial" className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Perfil Financeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataItem label="Perfil" value="Dados ainda não disponíveis" />
              <DataItem label="Hábito de poupar" value="Dados ainda não disponíveis" />
            </div>
          </TabsContent>

          <TabsContent value="assets" className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Bens e Dívidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataItem label="Carro" value="Dados ainda não disponíveis" />
              <DataItem label="Imóvel" value="Dados ainda não disponíveis" />
              <DataItem label="Dívidas" value="Dados ainda não disponíveis" />
            </div>
          </TabsContent>

          <TabsContent value="investments" className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Investimentos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataItem label="Já investe" value="Dados ainda não disponíveis" />
              <DataItem label="Carteira diversificada" value="Dados ainda não disponíveis" />
            </div>
          </TabsContent>

          <TabsContent value="goals" className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Objetivos Financeiros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataItem label="Aposentadoria" value="Dados ainda não disponíveis" />
              <DataItem label="Outros objetivos" value="Dados ainda não disponíveis" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Componente auxiliar para exibir dados
const DataItem = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-3">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
    <Separator className="mt-2" />
  </div>
);

export default ClientDetails;
