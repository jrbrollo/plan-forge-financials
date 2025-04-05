import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, BarChart3, PiggyBank, TrendingUp, Shield, Wallet, Home, Briefcase, DollarSign, CreditCard, List, Target, ClipboardCheck, FileText, Calendar, PieChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientOverview } from "@/components/Dashboard/ClientOverview";
import { ClientFinancialSummary } from "@/components/Dashboard/ClientFinancialSummary";
import { ClientInsuranceStatus } from "@/components/Dashboard/ClientInsuranceStatus";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Layout/Sidebar";
import { useClient } from '@/context/ClientContext';
import { getClientById, deleteClient } from '@/services/clientService';
import { ClientFormToggle } from '@/components/Forms/ClientFormToggle';
import type { Client } from '@/lib/types';

// Função para verificar se um cliente tem dados completos
const isClientProfileComplete = (client: Client): boolean => {
  // Verificar campos básicos de contato
  const hasBasicInfo = Boolean(client.name && client.age && client.email && client.phone);
  
  // Verificar se pelo menos alguns dados adicionais foram preenchidos
  const hasAdditionalInfo = Boolean(
    client.maritalStatus || 
    client.profession || 
    client.workMotivation || 
    client.moneyProfile || 
    client.hasInvestments || 
    client.monthlyNetIncome || 
    (client.debts && client.debts.length > 0) ||
    client.hasProperty ||
    client.hasCar
  );
  
  // Cliente está completo se tem informações básicas e pelo menos uma informação adicional
  return hasBasicInfo && hasAdditionalInfo;
};

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { currentClient, setCurrentClient, updateClient } = useClient();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
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
    setIsCompletingProfile(false);
    
    toast({
      title: isCompletingProfile ? "Cadastro completado" : "Dados atualizados",
      description: isCompletingProfile 
        ? "O cadastro do cliente foi completado com sucesso." 
        : "Os dados do cliente foram atualizados com sucesso."
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCompletingProfile(false);
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

  const isProfileComplete = isClientProfileComplete(currentClient);

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
            {currentClient.profession && (
              <Badge variant="outline" className="ml-2">{currentClient.profession}</Badge>
            )}
            {!isProfileComplete && (
              <Badge variant="destructive" className="ml-2">Cadastro Incompleto</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {!isProfileComplete && !isEditing && !isCompletingProfile && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsCompletingProfile(true)}
              >
                <ClipboardCheck className="h-4 w-4 mr-2" /> Completar Cadastro
              </Button>
            )}
            {!isCompletingProfile && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="h-4 w-4 mr-2" /> {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            )}
            {!isEditing && !isCompletingProfile && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate(`/budget/${clientId}`)}>
              <FileText className="mr-2 h-4 w-4" /> Orçamento
            </Button>
            <Button variant="outline" onClick={() => navigate(`/cash-flow/${clientId}`)}>
              <Calendar className="mr-2 h-4 w-4" /> Fluxo de Caixa
            </Button>
            <Button variant="outline" onClick={() => navigate(`/dashboard/${clientId}`)}>
              <PieChart className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </div>
        </div>

        {isEditing || isCompletingProfile ? (
          <ClientFormToggle 
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            initialValues={currentClient}
            forceCompleteForm={isCompletingProfile}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <ClientOverview client={currentClient} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ClientFinancialSummary client={currentClient} />
                <ClientInsuranceStatus client={currentClient} />
              </div>
              
              <Card className="finance-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-finance-navy">Módulos Financeiros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                      onClick={() => handleNavigateToModule('dashboard')}
                    >
                      <PieChart className="h-6 w-6" />
                      <span>Dashboard</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="personal">
                <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
                  <TabsTrigger value="personal">
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span className="hidden md:inline">Dados Pessoais</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="professional">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden md:inline">Profissão</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="financial">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="hidden md:inline">Perfil Financeiro</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="assets">
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span className="hidden md:inline">Bens e Dívidas</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="investments">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden md:inline">Investimentos</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="goals">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span className="hidden md:inline">Objetivos</span>
                    </div>
                  </TabsTrigger>
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
                    
                    {currentClient.hasChildren && currentClient.childrenAges && currentClient.childrenAges.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Idade dos filhos</p>
                        <div className="flex flex-wrap gap-2">
                          {currentClient.childrenAges.map((age, index) => (
                            <Badge key={index} variant="outline">{age} anos</Badge>
                          ))}
                        </div>
                        <Separator className="mt-2" />
                      </div>
                    )}
                    
                    {currentClient.personalComments && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Comentários pessoais</p>
                        <p className="font-medium">{currentClient.personalComments}</p>
                        <Separator className="mt-2" />
                      </div>
                    )}
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
                      label="Tipo de contrato" 
                      value={currentClient.contractType || "Não informado"} 
                    />
                    <DataItem 
                      label="Motivação do trabalho" 
                      value={currentClient.workMotivation || "Não informado"} 
                    />
                    
                    {currentClient.jobDescription && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Descrição das atividades</p>
                        <p className="font-medium">{currentClient.jobDescription}</p>
                        <Separator className="mt-2" />
                      </div>
                    )}
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
                      label="Faz planejamento financeiro" 
                      value={currentClient.hasFinancialPlanning ? "Sim" : "Não"} 
                    />
                    
                    {currentClient.hasFinancialPlanning && currentClient.planningDescription && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Como faz o planejamento</p>
                        <p className="font-medium">{currentClient.planningDescription}</p>
                        <Separator className="mt-2" />
                      </div>
                    )}
                    
                    <DataItem 
                      label="Hábito de poupar" 
                      value={currentClient.hasSavingHabit ? "Sim" : "Não"} 
                    />
                    
                    {currentClient.hasSavingHabit && currentClient.savingHabitHistory && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Histórico de poupança</p>
                        <p className="font-medium">{currentClient.savingHabitHistory}</p>
                        <Separator className="mt-2" />
                      </div>
                    )}
                    
                    <DataItem 
                      label="Média mensal de economia" 
                      value={currentClient.monthlySavingsAverage ? 
                        `R$ ${currentClient.monthlySavingsAverage.toLocaleString('pt-BR')}` : 
                        "Não informado"} 
                    />
                    
                    <div className="col-span-2">
                      <h3 className="text-md font-semibold mt-4 mb-2">Bancos e Cartões</h3>
                      
                      <DataItem 
                        label="Bancos utilizados" 
                        value={currentClient.banks && currentClient.banks.length > 0 ? 
                          currentClient.banks.join(", ") : "Não informado"} 
                      />
                      
                      <DataItem 
                        label="Método de pagamento" 
                        value={currentClient.paymentMethod || "Não informado"} 
                      />
                      
                      <DataItem 
                        label="Cartões de crédito" 
                        value={currentClient.creditCards && currentClient.creditCards.length > 0 ? 
                          currentClient.creditCards.join(", ") : "Não informado"} 
                      />
                      
                      <DataItem 
                        label="Média da fatura do cartão" 
                        value={currentClient.creditCardBillAverage ? 
                          `R$ ${currentClient.creditCardBillAverage.toLocaleString('pt-BR')}` : 
                          "Não informado"} 
                      />
                    </div>
                    
                    {currentClient.financialProfileComments && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Comentários sobre perfil financeiro</p>
                        <p className="font-medium">{currentClient.financialProfileComments}</p>
                        <Separator className="mt-2" />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="assets" className="p-4 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Bens e Dívidas</h2>
                  
                  <h3 className="text-md font-semibold mt-2 mb-3">Automóvel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <DataItem 
                      label="Possui carro" 
                      value={currentClient.hasCar ? "Sim" : "Não"} 
                    />
                    
                    {currentClient.hasCar && (
                      <>
                        <DataItem 
                          label="Quitado" 
                          value={currentClient.isCarPaidOff ? "Sim" : "Não"} 
                        />
                        <DataItem 
                          label="Valor do carro" 
                          value={currentClient.carMarketValue ? 
                            `R$ ${currentClient.carMarketValue.toLocaleString('pt-BR')}` : 
                            "Não informado"} 
                        />
                        
                        {!currentClient.isCarPaidOff && (
                          <>
                            <DataItem 
                              label="Valor da parcela" 
                              value={currentClient.carMonthlyPayment ? 
                                `R$ ${currentClient.carMonthlyPayment.toLocaleString('pt-BR')}` : 
                                "Não informado"} 
                            />
                            <DataItem 
                              label="Tempo restante para quitar" 
                              value={currentClient.carPaymentRemaining || "Não informado"} 
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                  
                  <h3 className="text-md font-semibold mt-4 mb-3">Imóvel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <DataItem 
                      label="Possui imóvel" 
                      value={currentClient.hasProperty ? "Sim" : "Não"} 
                    />
                    
                    {currentClient.hasProperty && (
                      <>
                        <DataItem 
                          label="Quitado" 
                          value={currentClient.isPropertyPaidOff ? "Sim" : "Não"} 
                        />
                        <DataItem 
                          label="Valor do imóvel" 
                          value={currentClient.propertyMarketValue ? 
                            `R$ ${currentClient.propertyMarketValue.toLocaleString('pt-BR')}` : 
                            "Não informado"} 
                        />
                        
                        {!currentClient.isPropertyPaidOff && (
                          <>
                            <DataItem 
                              label="Valor da parcela" 
                              value={currentClient.propertyMonthlyPayment ? 
                                `R$ ${currentClient.propertyMonthlyPayment.toLocaleString('pt-BR')}` : 
                                "Não informado"} 
                            />
                            <DataItem 
                              label="Tempo restante para quitar" 
                              value={currentClient.propertyPaymentRemaining || "Não informado"} 
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                  
                  {currentClient.otherAssets && (
                    <div className="mb-6">
                      <h3 className="text-md font-semibold mt-4 mb-3">Outros Bens</h3>
                      <p className="text-sm text-gray-700">{currentClient.otherAssets}</p>
                      <Separator className="mt-4" />
                    </div>
                  )}
                  
                  <h3 className="text-md font-semibold mt-4 mb-3">Dívidas</h3>
                  {currentClient.debts && currentClient.debts.length > 0 ? (
                    <div className="space-y-4">
                      {currentClient.debts.map((debt, index) => (
                        <Card key={index} className="p-4 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <DataItem 
                              label="Valor da dívida" 
                              value={`R$ ${debt.value.toLocaleString('pt-BR')}`} 
                            />
                            <DataItem 
                              label="Parcela mensal" 
                              value={`R$ ${debt.monthlyPayment.toLocaleString('pt-BR')}`} 
                            />
                            <DataItem 
                              label="Motivo" 
                              value={debt.reason} 
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">Nenhuma dívida registrada</p>
                  )}
                </TabsContent>

                <TabsContent value="investments" className="p-4 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Investimentos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataItem 
                      label="Já investe" 
                      value={currentClient.hasInvestments ? "Sim" : "Não"} 
                    />
                    
                    {currentClient.hasInvestments && (
                      <>
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
                        
                        {currentClient.investmentsDescription && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500 mb-1">Descrição dos investimentos</p>
                            <p className="font-medium">{currentClient.investmentsDescription}</p>
                            <Separator className="mt-2" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="goals" className="p-4 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Objetivos Financeiros</h2>
                  
                  <Card className="p-4 border border-gray-200 mb-6">
                    <h3 className="text-md font-semibold mb-3">Aposentadoria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DataItem 
                        label="Plano para parar de trabalhar" 
                        value={currentClient.retirement?.plan || "Não informado"} 
                      />
                      <DataItem 
                        label="Conhecimento sobre INSS" 
                        value={currentClient.retirement?.inssKnowledge || "Não informado"} 
                      />
                      <DataItem 
                        label="Renda passiva desejada" 
                        value={currentClient.retirement?.desiredPassiveIncome ? 
                          `R$ ${currentClient.retirement.desiredPassiveIncome.toLocaleString('pt-BR')}` : 
                          "Não informado"} 
                      />
                      <DataItem 
                        label="Valor estimado necessário" 
                        value={currentClient.retirement?.estimatedAmountNeeded ? 
                          `R$ ${currentClient.retirement.estimatedAmountNeeded.toLocaleString('pt-BR')}` : 
                          "Não informado"} 
                      />
                      <DataItem 
                        label="Quando deseja alcançar" 
                        value={currentClient.retirement?.targetDate || "Não informado"} 
                      />
                      
                      {currentClient.retirement?.comments && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Comentários</p>
                          <p className="font-medium">{currentClient.retirement.comments}</p>
                          <Separator className="mt-2" />
                        </div>
                      )}
                    </div>
                  </Card>
                  
                  <h3 className="text-md font-semibold mb-3">Outros Objetivos</h3>
                  {currentClient.otherGoals && currentClient.otherGoals.length > 0 ? (
                    <div className="space-y-4">
                      {currentClient.otherGoals.map((goal, index) => (
                        <Card key={index} className="p-4 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DataItem label="Objetivo" value={goal.description} />
                            <DataItem 
                              label="Valor necessário" 
                              value={`R$ ${goal.amountNeeded.toLocaleString('pt-BR')}`} 
                            />
                            <DataItem label="Prazo" value={goal.deadline} />
                            
                            {goal.comments && (
                              <div className="col-span-2">
                                <p className="text-sm text-gray-500 mb-1">Comentários</p>
                                <p className="font-medium">{goal.comments}</p>
                                <Separator className="mt-2" />
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">Nenhum objetivo adicional registrado</p>
                  )}
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
