import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Layout/Sidebar";
import { InvestmentForm } from "@/components/Forms/InvestmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Investment, Client } from "@/lib/types";
import { format } from "date-fns";
import { Plus, PieChart, Edit, Trash, ArrowLeft, Users } from "lucide-react";
import { PieChart as PieChartComponent, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useClient } from '@/context/ClientContext';
import { getClientById, getClients } from '@/services/clientService';
import { createInvestmentsFromClient } from '@/services/investmentService';

// Map investment type to a readable name in Portuguese
const getTypeLabel = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    fixed_income: "Renda Fixa",
    variable_income: "Renda Variável",
    real_estate: "Fundos Imobiliários",
    emergency_fund: "Reserva de Emergência",
    retirement: "Previdência"
  };
  
  return typeMap[type] || type;
};

const Investments = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { currentClient, setCurrentClient } = useClient();
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [hasClients, setHasClients] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      // Verificar se há clientes cadastrados
      const clients = getClients();
      setHasClients(clients.length > 0);
      
      let client: Client | null = null;
      
      if (clientId) {
        // Se tiver clientId na URL, carrega os dados desse cliente
        client = getClientById(clientId);
        if (client) {
          setCurrentClient(client);
        } else {
          // Cliente não encontrado
          setInvestments([]);
          setLoading(false);
          return;
        }
      } else if (currentClient) {
        // Se não tiver clientId mas tiver cliente no contexto
        client = currentClient;
      } else if (clients.length > 0) {
        // Se não tiver cliente definido mas existirem clientes, usa o primeiro
        client = clients[0];
        setCurrentClient(client);
      } else {
        // Nenhum cliente
        setInvestments([]);
        setLoading(false);
        return;
      }
      
      if (client) {
        // Gerar investimentos com base nos dados do cliente
        const clientInvestments = createInvestmentsFromClient(client);
        setInvestments(clientInvestments);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [clientId, currentClient]);
  
  // Colors for the chart
  const COLORS = ['#0A1C45', '#2B4C91', '#6C81AC', '#38A169', '#F6AD55'];
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Calculate total investment value
  const totalInvestment = investments.reduce((total, investment) => total + investment.currentValue, 0);
  
  // Prepare data for chart by investment type
  const chartData = investments.reduce((acc, investment) => {
    const existingType = acc.find(item => item.name === getTypeLabel(investment.type));
    
    if (existingType) {
      existingType.value += investment.currentValue;
    } else {
      acc.push({
        name: getTypeLabel(investment.type),
        value: investment.currentValue
      });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);
  
  // Handle save new investment
  const handleSaveInvestment = (investment: Investment) => {
    setInvestments([...investments, investment]);
    setShowForm(false);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-finance-navy">Investimentos</h1>
            <p className="text-gray-600">Gerencie e acompanhe todos os investimentos.</p>
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
            
            {currentClient && (
              <Button 
                className="bg-finance-blue hover:bg-finance-darkblue flex items-center gap-2"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} />
                Adicionar Investimento
              </Button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando investimentos...</p>
          </div>
        ) : !hasClients ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Nenhum cliente cadastrado. Adicione clientes para ver os investimentos.</p>
              <Button onClick={() => navigate('/clients')}>
                <Users className="mr-2 h-4 w-4" /> Cadastrar Clientes
              </Button>
            </CardContent>
          </Card>
        ) : !currentClient ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Selecione um cliente para visualizar seus investimentos.</p>
              <Button onClick={() => navigate('/clients')}>
                <Users className="mr-2 h-4 w-4" /> Selecionar Cliente
              </Button>
            </CardContent>
          </Card>
        ) : showForm ? (
          <InvestmentForm 
            onSave={handleSaveInvestment}
            onCancel={() => setShowForm(false)}
          />
        ) : investments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Nenhum investimento registrado. Adicione investimentos para visualizar.</p>
              <Button 
                className="bg-finance-blue hover:bg-finance-darkblue flex items-center gap-2"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} />
                Adicionar Investimento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-finance-navy">Total de Investimentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-finance-blue">{formatCurrency(totalInvestment)}</p>
                  <p className="text-sm text-gray-500">{investments.length} investimentos</p>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-finance-navy">Distribuição de Investimentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChartComponent>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Valor']}
                        />
                        <Legend />
                      </PieChartComponent>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-finance-navy">Lista de Investimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="finance-table">
                    <thead>
                      <tr>
                        <th>Investimento</th>
                        <th>Tipo</th>
                        <th>Valor Inicial</th>
                        <th>Valor Atual</th>
                        <th>Retorno %</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((investment, index) => (
                        <tr key={index}>
                          <td>{investment.name}</td>
                          <td>{getTypeLabel(investment.type)}</td>
                          <td>{formatCurrency(investment.initialValue)}</td>
                          <td>{formatCurrency(investment.currentValue)}</td>
                          <td>{investment.annualReturn.toFixed(2)}%</td>
                          <td>{format(new Date(investment.investmentDate), 'dd/MM/yyyy')}</td>
                          <td>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Investments;
