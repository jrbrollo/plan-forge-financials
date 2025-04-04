
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, BarChart3, PiggyBank, TrendingUp, Shield, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientOverview } from "@/components/Dashboard/ClientOverview";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Layout/Sidebar";
import { useClient } from '@/context/ClientContext';
import { getClientById, deleteClient } from '@/services/clientService';
import { ClientForm } from '@/components/Forms/ClientForm';
import type { Client } from '@/lib/types';

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { currentClient, setCurrentClient, updateClient } = useClient();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (clientId) {
      const client = getClientById(clientId);
      if (client) {
        setCurrentClient(client);
      }
    }
    setLoading(false);
  }, [clientId, setCurrentClient]);

  const handleDelete = () => {
    if (!clientId) return;
    
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteClient(clientId);
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso."
      });
      navigate('/clients');
    }
  };

  const handleNavigateToModule = (module: string) => {
    if (!clientId) return;
    navigate(`/${module}/${clientId}`);
  };

  const handleSaveEdit = (clientData: Omit<Client, 'id'>) => {
    if (!currentClient) return;
    
    const updatedClient: Client = {
      ...clientData,
      id: currentClient.id,
    };
    
    updateClient(updatedClient);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <p>Carregando detalhes do cliente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentClient) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 container mx-auto p-6">
          <div className="flex flex-col gap-4 justify-center items-center h-64">
            <p className="text-lg">Cliente não encontrado</p>
            <Button onClick={() => navigate('/clients')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Clientes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/clients')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">{currentClient.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" /> {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Excluir
            </Button>
          </div>
        </div>

        {isEditing ? (
          <ClientForm 
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
            initialValues={currentClient}
          />
        ) : (
          <>
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

            <ClientOverview client={currentClient} />

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
                    <DataItem label="Nome completo" value={currentClient.name} />
                    <DataItem label="Idade" value={currentClient.age.toString()} />
                    <DataItem label="Email" value={currentClient.email} />
                    <DataItem label="Telefone" value={currentClient.phone} />
                    <DataItem 
                      label="Estado Civil" 
                      value={currentClient.maritalStatus || "Não informado"} 
                    />
                    <DataItem 
                      label="Filhos" 
                      value={currentClient.hasChildren ? `Sim (${currentClient.numberOfChildren || 0})` : "Não"} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="p-4 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Profissão e Trabalho</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataItem 
                      label="Profissão" 
                      value={currentClient.profession || "Não informado"} 
                    />
                    <DataItem 
                      label="Descrição do trabalho" 
                      value={currentClient.jobDescription || "Não informado"} 
                    />
                    <DataItem 
                      label="Motivação" 
                      value={currentClient.workMotivation || "Não informado"} 
                    />
                    <DataItem 
                      label="Tipo de contrato" 
                      value={currentClient.contractType || "Não informado"} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="p-4 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Perfil Financeiro</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataItem 
                      label="Perfil com dinheiro" 
                      value={currentClient.moneyProfile || "Não informado"} 
                    />
                    <DataItem 
                      label="Hábito de poupar" 
                      value={currentClient.hasSavingHabit ? "Sim" : "Não"} 
                    />
                    <DataItem 
                      label="Média de economia mensal" 
                      value={currentClient.monthlySavingsAverage ? 
                        `R$ ${currentClient.monthlySavingsAverage.toLocaleString('pt-BR')}` : 
                        "Não informado"} 
                    />
                    <DataItem 
                      label="Bancos utilizados" 
                      value={currentClient.banks ? currentClient.banks.join(", ") : "Não informado"} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="assets" className="p-4 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Bens e Dívidas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataItem 
                      label="Possui carro" 
                      value={currentClient.hasCar ? "Sim" : "Não"} 
                    />
                    {currentClient.hasCar && (
                      <>
                        <DataItem 
                          label="Financiado" 
                          value={!currentClient.isCarPaidOff ? "Sim" : "Não"} 
                        />
                        <DataItem 
                          label="Valor do carro" 
                          value={currentClient.carMarketValue ? 
                            `R$ ${currentClient.carMarketValue.toLocaleString('pt-BR')}` : 
                            "Não informado"} 
                        />
                      </>
                    )}
                    
                    <DataItem 
                      label="Possui imóvel" 
                      value={currentClient.hasProperty ? "Sim" : "Não"} 
                    />
                    {currentClient.hasProperty && (
                      <>
                        <DataItem 
                          label="Financiado" 
                          value={!currentClient.isPropertyPaidOff ? "Sim" : "Não"} 
                        />
                        <DataItem 
                          label="Valor do imóvel" 
                          value={currentClient.propertyMarketValue ? 
                            `R$ ${currentClient.propertyMarketValue.toLocaleString('pt-BR')}` : 
                            "Não informado"} 
                        />
                      </>
                    )}
                    
                    <DataItem 
                      label="Dívidas" 
                      value={currentClient.debts && currentClient.debts.length > 0 ? 
                        `${currentClient.debts.length} dívida(s) registrada(s)` : 
                        "Nenhuma dívida registrada"} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="investments" className="p-4 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Investimentos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataItem 
                      label="Já investe" 
                      value={currentClient.hasInvestments ? "Sim" : "Não"} 
                    />
                    <DataItem 
                      label="Total investido" 
                      value={currentClient.totalInvestments ? 
                        `R$ ${currentClient.totalInvestments.toLocaleString('pt-BR')}` : 
                        "Não informado"} 
                    />
                    <DataItem 
                      label="Carteira diversificada" 
                      value={currentClient.hasDiversifiedPortfolio ? "Sim" : "Não"} 
                    />
                    <DataItem 
                      label="Gerencia próprios investimentos" 
                      value={currentClient.selfManagesInvestments ? "Sim" : "Não"} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="goals" className="p-4 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Objetivos Financeiros</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataItem 
                      label="Plano de aposentadoria" 
                      value={currentClient.retirement?.plan || "Não informado"} 
                    />
                    <DataItem 
                      label="Valor desejado passivo" 
                      value={currentClient.retirement?.desiredPassiveIncome ? 
                        `R$ ${currentClient.retirement.desiredPassiveIncome.toLocaleString('pt-BR')}` : 
                        "Não informado"} 
                    />
                    
                    {currentClient.otherGoals && currentClient.otherGoals.length > 0 ? (
                      <div className="col-span-2">
                        <h3 className="text-md font-semibold mt-4 mb-2">Outros objetivos</h3>
                        {currentClient.otherGoals.map((goal, index) => (
                          <div key={index} className="mb-4 p-3 border rounded">
                            <DataItem label="Objetivo" value={goal.description} />
                            <DataItem 
                              label="Valor necessário" 
                              value={`R$ ${goal.amountNeeded.toLocaleString('pt-BR')}`} 
                            />
                            <DataItem label="Prazo" value={goal.deadline} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <DataItem 
                        label="Outros objetivos" 
                        value="Nenhum objetivo adicional registrado" 
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
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
