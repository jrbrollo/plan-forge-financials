
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClient } from '@/context/ClientContext';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Budget = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { currentClient, isLoading: clientLoading, error: clientError, loadClientById } = useClient();
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(null);
  
  useEffect(() => {
    const loadClientData = async () => {
      if (clientId) {
        try {
          setLoading(true);
          await loadClientById(clientId);
        } catch (err) {
          console.error("Erro ao carregar cliente:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadClientData();
  }, [clientId, loadClientById]);
  
  if (loading || clientLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-center items-center h-64">
            <p>Carregando orçamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentClient) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-amber-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Cliente não encontrado</h2>
              <p className="text-gray-500 mb-4">Não foi possível encontrar os dados deste cliente.</p>
              <Button onClick={() => navigate('/clients')}>
                Voltar para lista de clientes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const incomeData = [
    { category: 'Salário', amount: currentClient.monthlyNetIncome || 0, percentage: 100 }
  ];

  const expenseCategories = [
    { name: 'Moradia', percentage: 30, essential: true },
    { name: 'Alimentação', percentage: 15, essential: true },
    { name: 'Transporte', percentage: 15, essential: true },
    { name: 'Saúde', percentage: 10, essential: true },
    { name: 'Educação', percentage: 10, essential: true },
    { name: 'Lazer', percentage: 5, essential: false },
    { name: 'Vestuário', percentage: 5, essential: false },
    { name: 'Investimentos', percentage: 10, essential: false }
  ];

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);

  const handleSaveBudget = () => {
    console.log("Salvando orçamento...");
    
    const updatedClient = {
      ...currentClient,
    };
    
    alert("Orçamento salvo com sucesso!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2461]">Orçamento</h1>
            <p className="text-gray-600">Planejamento financeiro para {currentClient.name}</p>
          </div>
          
          <Button variant="outline" onClick={() => navigate(`/clients/${currentClient.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cliente
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeData.map((income, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{income.category}</p>
                      <p className="text-sm text-gray-500">{income.percentage}% da receita total</p>
                    </div>
                    <p className="font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income.amount)}
                    </p>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total de Receitas</p>
                    <p className="font-bold text-lg">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Despesas Recomendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((category, index) => {
                  const amount = totalIncome * (category.percentage / 100);
                  
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500">
                          {category.percentage}% da receita total
                          {category.essential && <span className="ml-2 text-blue-600">(Essencial)</span>}
                        </p>
                      </div>
                      <p className="font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
                      </p>
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total de Despesas</p>
                    <p className="font-bold text-lg">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Distribuição do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <div className="h-64 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-md transition-colors">
                  <p className="text-gray-500">Clique para visualizar o gráfico de distribuição do orçamento</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Distribuição do Orçamento</DialogTitle>
                </DialogHeader>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">Gráfico de distribuição do orçamento será exibido aqui</p>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveBudget}>
            Salvar Orçamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Budget;
