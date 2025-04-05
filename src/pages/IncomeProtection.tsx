import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Protection, Client } from '@/lib/types';
import { format } from 'date-fns';
import { Check, X, Users, ArrowLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useClient } from '@/context/ClientContext';
import { getClientById, getClients } from '@/services/clientService';

// Criar proteções com base nas informações do cliente
const createProtectionsFromClient = (client: Client): Protection[] => {
  const protections: Protection[] = [];
  const monthlyIncome = client.monthlyNetIncome || 5000;
  
  if (client.hasHealthInsurance) {
    protections.push({
      type: "Plano de Saúde",
      provider: "Operadora de Saúde",
      coverageAmount: 0, // Plano de saúde geralmente não tem valor fixo de cobertura
      monthlyPremium: monthlyIncome * 0.1,
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    });
  }
  
  if (client.hasLifeInsurance) {
    protections.push({
      type: "Seguro de Vida",
      provider: "Seguradora",
      coverageAmount: monthlyIncome * 24,
      monthlyPremium: monthlyIncome * 0.05,
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    });
  }
  
  if (client.hasAssetInsurance) {
    if (client.hasProperty) {
      protections.push({
        type: "Seguro Residencial",
        provider: "Seguradora Imobiliária",
        coverageAmount: client.propertyMarketValue || 300000,
        monthlyPremium: (client.propertyMarketValue || 300000) * 0.001 / 12,
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      });
    }
    
    if (client.hasCar) {
      protections.push({
        type: "Seguro de Veículo",
        provider: "Seguradora Automotiva",
        coverageAmount: client.carMarketValue || 50000,
        monthlyPremium: (client.carMarketValue || 50000) * 0.03 / 12,
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      });
    }
  }
  
  return protections;
};

const IncomeProtection = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { currentClient, setCurrentClient } = useClient();
  const [loading, setLoading] = useState(true);
  const [protections, setProtections] = useState<Protection[]>([]);
  const [hasClients, setHasClients] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      // Verificar se há clientes cadastrados
      const clients = getClients();
      setHasClients(clients.length > 0);
      
      if (clientId) {
        // Se tiver clientId na URL, carrega os dados desse cliente
        const client = getClientById(clientId);
        if (client) {
          setCurrentClient(client);
          const clientProtections = createProtectionsFromClient(client);
          setProtections(clientProtections);
        } else {
          // Cliente não encontrado
          setProtections([]);
        }
      } else if (currentClient) {
        // Se não tiver clientId mas tiver cliente no contexto
        const clientProtections = createProtectionsFromClient(currentClient);
        setProtections(clientProtections);
      } else if (clients.length > 0) {
        // Se não tiver cliente definido mas existirem clientes, usa o primeiro
        const client = clients[0];
        setCurrentClient(client);
        const clientProtections = createProtectionsFromClient(client);
        setProtections(clientProtections);
      } else {
        // Nenhum cliente
        setProtections([]);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [clientId, setCurrentClient, currentClient]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-finance-navy">Proteção de Renda</h1>
            <p className="text-gray-600">Gerenciamento de seguros e planos de proteção.</p>
          </div>
          
          <div className="flex gap-2">
            {!hasClients ? (
              <Button onClick={() => navigate('/clients')}>
                <Users className="mr-2 h-4 w-4" /> Adicionar Clientes
              </Button>
            ) : !currentClient ? (
              <Button onClick={() => navigate('/clients')}>
                <Users className="mr-2 h-4 w-4" /> Selecionar Cliente
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate(`/clients/${currentClient.id}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cliente
              </Button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando planos de proteção...</p>
          </div>
        ) : !hasClients ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Nenhum cliente cadastrado. Adicione clientes para ver proteções.</p>
              <Button onClick={() => navigate('/clients')}>
                <Users className="mr-2 h-4 w-4" /> Cadastrar Clientes
              </Button>
            </CardContent>
          </Card>
        ) : !currentClient ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Selecione um cliente para visualizar seus planos de proteção.</p>
              <Button onClick={() => navigate('/clients')}>
                <Users className="mr-2 h-4 w-4" /> Selecionar Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="finance-card">
                <CardHeader>
                  <CardTitle className="text-finance-navy">Resumo de Proteção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de Prêmios Mensais:</span>
                      <span className="font-medium">
                        {formatCurrency(protections.reduce((total, protection) => total + protection.monthlyPremium, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor Total de Cobertura:</span>
                      <span className="font-medium">
                        {formatCurrency(protections.reduce((total, protection) => total + protection.coverageAmount, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Número de Apólices Ativas:</span>
                      <span className="font-medium">{protections.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="finance-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-finance-navy">Avaliação de Proteção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10">
                        {protections.some(p => p.type === "Seguro de Vida") ? 
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-finance-green">
                            <Check size={18} />
                          </div> : 
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-finance-red">
                            <X size={18} />
                          </div>
                        }
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">Seguro de Vida</h3>
                        <p className="text-sm text-gray-500">Cobertura para perda inesperada de vida</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10">
                        {protections.some(p => p.type === "Plano de Saúde") ? 
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-finance-green">
                            <Check size={18} />
                          </div> : 
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-finance-red">
                            <X size={18} />
                          </div>
                        }
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">Plano de Saúde</h3>
                        <p className="text-sm text-gray-500">Cobertura para despesas médicas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10">
                        {protections.some(p => p.type === "Seguro Residencial") ? 
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-finance-green">
                            <Check size={18} />
                          </div> : 
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-finance-red">
                            <X size={18} />
                          </div>
                        }
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">Seguro Residencial</h3>
                        <p className="text-sm text-gray-500">Cobertura para casa e pertences</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10">
                        {protections.some(p => p.type === "Seguro de Veículo") ? 
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-finance-green">
                            <Check size={18} />
                          </div> : 
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-finance-red">
                            <X size={18} />
                          </div>
                        }
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">Seguro de Veículo</h3>
                        <p className="text-sm text-gray-500">Cobertura para automóveis</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {protections.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-gray-500 mb-4">Nenhum plano de proteção registrado para este cliente.</p>
                  <p className="text-sm text-gray-500">Edite o perfil do cliente para adicionar proteções.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="finance-card">
                <CardHeader>
                  <CardTitle className="text-finance-navy">Planos de Proteção Atuais</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="finance-table">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Provedor</th>
                        <th>Valor de Cobertura</th>
                        <th>Prêmio Mensal</th>
                        <th>Data de Expiração</th>
                      </tr>
                    </thead>
                    <tbody>
                      {protections.map((protection, index) => (
                        <tr key={index}>
                          <td>{protection.type}</td>
                          <td>{protection.provider}</td>
                          <td>{protection.coverageAmount > 0 ? formatCurrency(protection.coverageAmount) : 'N/A'}</td>
                          <td>{formatCurrency(protection.monthlyPremium)}</td>
                          <td>{protection.expirationDate ? format(new Date(protection.expirationDate), 'dd/MM/yyyy') : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IncomeProtection;
