
import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClient } from '@/context/ClientContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Calculator, Save } from 'lucide-react';

const EmergencyFund = () => {
  const { currentClient, updateClient } = useClient();
  const [target, setTarget] = useState(0);
  const [current, setCurrent] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [months, setMonths] = useState(6);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (currentClient) {
      // Calcular despesas mensais do cliente
      let expenses = 0;
      
      if (currentClient.fixedMonthlyExpenses) {
        const regex = /R\$\s*([\d.,]+)/g;
        let match;
        while ((match = regex.exec(currentClient.fixedMonthlyExpenses)) !== null) {
          const value = match[1].replace('.', '').replace(',', '.');
          expenses += parseFloat(value);
        }
      }
      
      setMonthlyExpenses(expenses);
      
      // Definir valor alvo (6 meses de despesas)
      const targetValue = expenses * 6;
      setTarget(targetValue);
      
      // Estimar valor atual se houver investimentos
      let currentValue = 0;
      if (currentClient.hasInvestments && currentClient.totalInvestments) {
        // Assumir que 15% dos investimentos estão em reserva de emergência
        // Ou usar outro valor se especificado nos dados do cliente
        currentValue = currentClient.totalInvestments * 0.15;
      }
      setCurrent(currentValue);
    }
  }, [currentClient]);

  if (!currentClient) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Card className="finance-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Nenhum cliente selecionado. Selecione um cliente para visualizar o fundo de emergência.</p>
              <Button onClick={() => navigate('/clients')}>
                Selecionar Cliente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const progressPercentage = target > 0 ? (current / target) * 100 : 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const calculateEmergencyFund = () => {
    setTarget(monthlyExpenses * months);
  };
  
  const saveEmergencyFundData = () => {
    if (!currentClient) return;
    
    // Para esta demonstração, vamos salvar os valores nos comentários do cliente
    const comments = currentClient.personalComments || '';
    const updatedComments = `${comments}${comments ? '\n\n' : ''}Fundo de emergência: Meta de ${formatCurrency(target)}. Atual: ${formatCurrency(current)}. Cálculo: ${months} meses de despesas mensais de ${formatCurrency(monthlyExpenses)}.`;
    
    updateClient({
      ...currentClient,
      personalComments: updatedComments
    });
    
    toast({
      title: "Fundo de emergência atualizado",
      description: "Os dados do fundo de emergência foram salvos no perfil do cliente."
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-finance-navy">Fundo de Emergência</h1>
          <p className="text-gray-600">Planeje o fundo de emergência para {currentClient.name}.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-finance-navy">Situação Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between mb-2">
                  <span>Progresso</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-gray-200" />
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-gray-500">Valor Atual</p>
                    <div className="flex items-center">
                      <Input 
                        type="number" 
                        value={current}
                        onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Valor Alvo</p>
                    <p className="text-2xl font-bold">{formatCurrency(target)}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Faltam</p>
                  <p className="text-xl font-semibold">{formatCurrency(Math.max(0, target - current))}</p>
                </div>
                
                <div className="pt-4">
                  <Button onClick={saveEmergencyFundData} className="w-full">
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-finance-navy">Calculadora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Despesas Mensais Essenciais</label>
                  <Input 
                    type="number" 
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Número de Meses</label>
                  <Input 
                    type="number" 
                    value={months}
                    onChange={(e) => setMonths(parseInt(e.target.value) || 6)}
                    min={1}
                    max={24}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendação: 3-6 meses para CLT, 6-12 meses para autônomos/PJ
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button onClick={calculateEmergencyFund} variant="secondary" className="w-full">
                    <Calculator className="mr-2 h-4 w-4" /> Calcular Valor Alvo
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium">Considerações Técnicas</h3>
                  <ul className="text-sm space-y-2 mt-2">
                    <li>• O fundo de emergência deve priorizar liquidez e segurança.</li>
                    <li>• Sugerir aos clientes aplicações em CDBs com liquidez diária ou fundos DI.</li>
                    <li>• Para despesas essenciais, considerar: moradia, alimentação, saúde, transporte e educação.</li>
                    <li>• Para profissionais autônomos ou com renda variável, recomenda-se reserva ampliada.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-finance-navy">Estratégias de Acumulação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Nesta seção, você pode desenvolver um plano de acumulação gradual do fundo de emergência para o cliente.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Abordagem Conservadora</h3>
                  <p className="text-sm">
                    Para acumular {formatCurrency(target)} em 12 meses, o cliente precisa poupar mensalmente {formatCurrency(target / 12)}.
                  </p>
                  <p className="text-sm mt-2">
                    Instrumento recomendado: CDB com liquidez diária de banco de primeira linha.
                  </p>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Abordagem Moderada</h3>
                  <p className="text-sm">
                    Para acumular {formatCurrency(target)} em 24 meses, o cliente precisa poupar mensalmente {formatCurrency(target / 24)}.
                  </p>
                  <p className="text-sm mt-2">
                    Instrumento recomendado: LCI/LCA com vencimentos escalonados.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h3 className="font-medium mb-2">Observações para o Planejador</h3>
                <p className="text-sm">
                  • Avalie a estabilidade da renda do cliente ao determinar o tamanho ideal do fundo.
                  <br />• Para clientes com alta aversão ao risco, considere aumentar a reserva de emergência.
                  <br />• Para clientes com múltiplas fontes de renda, o fundo pode ser calculado de forma mais conservadora.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyFund;
