
import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClient } from '@/context/ClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Plus, Trash, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CashFlow = () => {
  const { currentClient, updateClient } = useClient();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [income, setIncome] = useState<{id: string, description: string, amount: number}[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<{id: string, description: string, amount: number, isEssential: boolean}[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<{id: string, description: string, amount: number, isEssential: boolean}[]>([]);
  const [investments, setInvestments] = useState<{id: string, description: string, amount: number}[]>([]);
  const [activeTab, setActiveTab] = useState("receitas");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (currentClient) {
      // Inicializar com dados do cliente se existirem
      const monthlyIncome = [
        { id: '1', description: currentClient.profession || 'Salário', amount: currentClient.monthlyNetIncome || 0 }
      ];
      
      if (currentClient.additionalIncome) {
        monthlyIncome.push({ id: '2', description: 'Renda Adicional', amount: 0 });
      }

      setIncome(monthlyIncome);
      
      // Parseando as despesas fixas do cliente
      const fixedExp: {id: string, description: string, amount: number, isEssential: boolean}[] = [];
      if (currentClient.fixedMonthlyExpenses) {
        const expenseRegex = /(.*?):\s*R\$\s*([\d.,]+)/g;
        let match;
        let id = 1;
        
        while ((match = expenseRegex.exec(currentClient.fixedMonthlyExpenses)) !== null) {
          fixedExp.push({
            id: id.toString(),
            description: match[1].trim(),
            amount: parseFloat(match[2].replace('.', '').replace(',', '.')),
            isEssential: match[1].toLowerCase().includes('moradia') || match[1].toLowerCase().includes('saúde')
          });
          id++;
        }
      }
      
      setFixedExpenses(fixedExp.length > 0 ? fixedExp : [{ id: '1', description: '', amount: 0, isEssential: false }]);
      
      // Parseando as despesas variáveis
      const varExp: {id: string, description: string, amount: number, isEssential: boolean}[] = [];
      if (currentClient.variableExpenses) {
        const expenseRegex = /(.*?):\s*R\$\s*([\d.,]+)/g;
        let match;
        let id = 1;
        
        while ((match = expenseRegex.exec(currentClient.variableExpenses)) !== null) {
          varExp.push({
            id: id.toString(),
            description: match[1].trim(),
            amount: parseFloat(match[2].replace('.', '').replace(',', '.')),
            isEssential: false
          });
          id++;
        }
      }
      
      setVariableExpenses(varExp.length > 0 ? varExp : [{ id: '1', description: '', amount: 0, isEssential: false }]);
      
      // Investimentos
      if (currentClient.hasInvestments && currentClient.totalInvestments) {
        setInvestments([{ id: '1', description: 'Investimento Mensal', amount: currentClient.monthlySavingsAverage || currentClient.totalInvestments / 12 }]);
      } else {
        setInvestments([{ id: '1', description: 'Investimento Mensal', amount: 0 }]);
      }
    }
  }, [currentClient]);

  if (!currentClient) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Card className="finance-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-4">Nenhum cliente selecionado. Selecione um cliente para visualizar o fluxo de caixa.</p>
              <Button onClick={() => navigate('/clients')}>
                Selecionar Cliente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedExpenses = fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalVariableExpenses = variableExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = totalFixedExpenses + totalVariableExpenses;
  const totalInvestments = investments.reduce((sum, item) => sum + item.amount, 0);
  const monthlyBalance = totalIncome - totalExpenses - totalInvestments;

  const addItem = (type: string) => {
    const newId = Date.now().toString();
    
    if (type === 'income') {
      setIncome([...income, { id: newId, description: '', amount: 0 }]);
    } else if (type === 'fixed') {
      setFixedExpenses([...fixedExpenses, { id: newId, description: '', amount: 0, isEssential: false }]);
    } else if (type === 'variable') {
      setVariableExpenses([...variableExpenses, { id: newId, description: '', amount: 0, isEssential: false }]);
    } else if (type === 'investments') {
      setInvestments([...investments, { id: newId, description: '', amount: 0 }]);
    }
  };

  const removeItem = (type: string, id: string) => {
    if (type === 'income') {
      setIncome(income.filter(item => item.id !== id));
    } else if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.filter(item => item.id !== id));
    } else if (type === 'variable') {
      setVariableExpenses(variableExpenses.filter(item => item.id !== id));
    } else if (type === 'investments') {
      setInvestments(investments.filter(item => item.id !== id));
    }
  };

  const updateDescription = (type: string, id: string, value: string) => {
    if (type === 'income') {
      setIncome(income.map(item => item.id === id ? { ...item, description: value } : item));
    } else if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.map(item => item.id === id ? { ...item, description: value } : item));
    } else if (type === 'variable') {
      setVariableExpenses(variableExpenses.map(item => item.id === id ? { ...item, description: value } : item));
    } else if (type === 'investments') {
      setInvestments(investments.map(item => item.id === id ? { ...item, description: value } : item));
    }
  };

  const updateAmount = (type: string, id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (type === 'income') {
      setIncome(income.map(item => item.id === id ? { ...item, amount: numValue } : item));
    } else if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.map(item => item.id === id ? { ...item, amount: numValue } : item));
    } else if (type === 'variable') {
      setVariableExpenses(variableExpenses.map(item => item.id === id ? { ...item, amount: numValue } : item));
    } else if (type === 'investments') {
      setInvestments(investments.map(item => item.id === id ? { ...item, amount: numValue } : item));
    }
  };

  const toggleEssential = (type: string, id: string) => {
    if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.map(item => 
        item.id === id ? { ...item, isEssential: !item.isEssential } : item
      ));
    } else if (type === 'variable') {
      setVariableExpenses(variableExpenses.map(item => 
        item.id === id ? { ...item, isEssential: !item.isEssential } : item
      ));
    }
  };

  const saveClientData = () => {
    if (!currentClient) return;

    // Preparando dados para salvar no cliente
    const fixedMonthlyExpenses = fixedExpenses
      .filter(e => e.description && e.amount > 0)
      .map(e => `${e.description}: R$ ${e.amount.toFixed(2).replace('.', ',')}`)
      .join(', ');

    const variableExpensesStr = variableExpenses
      .filter(e => e.description && e.amount > 0)
      .map(e => `${e.description}: R$ ${e.amount.toFixed(2).replace('.', ',')}`)
      .join(', ');

    // Calculando renda mensal total
    const mainIncome = income.find(i => i.description.toLowerCase().includes('salário'))?.amount || 0;
    
    // Atualizando cliente
    const updatedClient = {
      ...currentClient,
      monthlyNetIncome: mainIncome,
      fixedMonthlyExpenses,
      variableExpenses: variableExpensesStr,
      monthlySavingsAverage: totalInvestments,
      hasSavingHabit: totalInvestments > 0
    };

    updateClient(updatedClient);
    toast({
      title: "Fluxo de caixa atualizado",
      description: "Os dados do fluxo de caixa foram salvos com sucesso."
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(prev => prev - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(prev => prev + 1);
        return 0;
      }
      return prev + 1;
    });
  };

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-finance-navy">Fluxo de Caixa</h1>
          <p className="text-gray-600">Gerencie e analise o fluxo de caixa de {currentClient.name}.</p>
        </div>
        
        <Card className="mb-6 finance-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-finance-navy">Resumo - {monthNames[currentMonth]} {currentYear}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">{monthNames[currentMonth]} {currentYear}</span>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Receitas</h3>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Despesas</h3>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Investimentos</h3>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalInvestments)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Saldo</h3>
                <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyBalance)}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={saveClientData}>
                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="despesas-fixas">Despesas Fixas</TabsTrigger>
            <TabsTrigger value="despesas-variaveis">Despesas Variáveis</TabsTrigger>
            <TabsTrigger value="investimentos">Investimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receitas">
            <Card>
              <CardHeader>
                <CardTitle>Receitas Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {income.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateDescription('income', item.id, e.target.value)}
                            placeholder="Descrição da receita"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => updateAmount('income', item.id, e.target.value)}
                            placeholder="0,00"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('income', item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => addItem('income')}>
                    <Plus className="mr-1 h-4 w-4" /> Adicionar Receita
                  </Button>
                  
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="ml-2 font-bold">{formatCurrency(totalIncome)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="despesas-fixas">
            <Card>
              <CardHeader>
                <CardTitle>Despesas Fixas Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Essencial?</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fixedExpenses.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateDescription('fixed', item.id, e.target.value)}
                            placeholder="Descrição da despesa"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => updateAmount('fixed', item.id, e.target.value)}
                            placeholder="0,00"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={item.isEssential ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleEssential('fixed', item.id)}
                          >
                            {item.isEssential ? "Sim" : "Não"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('fixed', item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => addItem('fixed')}>
                    <Plus className="mr-1 h-4 w-4" /> Adicionar Despesa Fixa
                  </Button>
                  
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="ml-2 font-bold">{formatCurrency(totalFixedExpenses)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="despesas-variaveis">
            <Card>
              <CardHeader>
                <CardTitle>Despesas Variáveis Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Essencial?</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variableExpenses.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateDescription('variable', item.id, e.target.value)}
                            placeholder="Descrição da despesa"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => updateAmount('variable', item.id, e.target.value)}
                            placeholder="0,00"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={item.isEssential ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleEssential('variable', item.id)}
                          >
                            {item.isEssential ? "Sim" : "Não"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('variable', item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => addItem('variable')}>
                    <Plus className="mr-1 h-4 w-4" /> Adicionar Despesa Variável
                  </Button>
                  
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="ml-2 font-bold">{formatCurrency(totalVariableExpenses)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investimentos">
            <Card>
              <CardHeader>
                <CardTitle>Investimentos Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateDescription('investments', item.id, e.target.value)}
                            placeholder="Descrição do investimento"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => updateAmount('investments', item.id, e.target.value)}
                            placeholder="0,00"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('investments', item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => addItem('investments')}>
                    <Plus className="mr-1 h-4 w-4" /> Adicionar Investimento
                  </Button>
                  
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="ml-2 font-bold">{formatCurrency(totalInvestments)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CashFlow;
