import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveClient } from '@/services/clientSupabaseService';
import { useAuth } from '@/context/AuthContext';
import { useClient } from '@/context/ClientContext';
import { Client } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';

const AddClient = () => {
  const navigate = useNavigate();
  const { planner } = useAuth();
  const { setCurrentClient } = useClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para o novo cliente
  const [newClient, setNewClient] = useState<Partial<Client>>({
    id: uuidv4(),
    name: '',
    email: '',
    phone: '',
    age: 30,
    profession: '',
    maritalStatus: 'single',
    dependents: 0,
    riskProfile: 'moderate',
    isActive: true,
    planner_id: planner?.id || '',
    monthlyIncome: 0,
    investments: [],
    budget: {
      income: [],
      expenses: []
    },
    goals: [],
    retirement: {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 0,
      monthlySavings: 0,
      targetIncome: 0,
      expectedReturn: 7,
      expectedInflation: 4,
      liquidityEvents: []
    },
    cashFlow: {
      income: [],
      expenses: []
    },
    emergencyFund: {
      targetAmount: 0,
      currentAmount: 0,
      monthlyContribution: 0,
      targetMonths: 6
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setNewClient(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'dependents' || name === 'monthlyIncome' 
        ? Number(value) 
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClient.name || !newClient.email) {
      setError('Por favor, preencha pelo menos o nome e o e-mail do cliente');
      return;
    }
    
    if (!planner?.id) {
      setError('Não foi possível identificar o planejador. Tente fazer login novamente.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const clientToSave = {
        ...newClient,
        planner_id: planner.id
      } as Client;
      
      const savedClient = await saveClient(clientToSave);
      
      setSuccess('Cliente adicionado com sucesso!');
      setCurrentClient(savedClient);
      
      setTimeout(() => {
        navigate(`/client/${savedClient.id}`);
      }, 1500);
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError('Ocorreu um erro ao tentar salvar o cliente. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-3xl font-bold text-primary">Adicionar Cliente</h1>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-400 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-6">
            <TabsTrigger value="personal">Pessoal</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="goals">Objetivos</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Dados básicos do cliente para identificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newClient.name}
                        onChange={handleInputChange}
                        placeholder="Nome do cliente"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newClient.email}
                        onChange={handleInputChange}
                        placeholder="email@exemplo.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newClient.phone}
                        onChange={handleInputChange}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={newClient.age}
                        onChange={handleInputChange}
                        min={18}
                        max={100}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profissão</Label>
                      <Input
                        id="profession"
                        name="profession"
                        value={newClient.profession}
                        onChange={handleInputChange}
                        placeholder="Cargo ou profissão"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dependents">Dependentes</Label>
                      <Input
                        id="dependents"
                        name="dependents"
                        type="number"
                        value={newClient.dependents}
                        onChange={handleInputChange}
                        min={0}
                        max={20}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <RadioGroup 
                      defaultValue={newClient.maritalStatus} 
                      className="flex flex-wrap gap-4"
                      onValueChange={(value) => handleSelectChange('maritalStatus', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="marital-single" />
                        <Label htmlFor="marital-single">Solteiro(a)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="married" id="marital-married" />
                        <Label htmlFor="marital-married">Casado(a)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="divorced" id="marital-divorced" />
                        <Label htmlFor="marital-divorced">Divorciado(a)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="widowed" id="marital-widowed" />
                        <Label htmlFor="marital-widowed">Viúvo(a)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                    Cancelar
                  </Button>
                  <Button variant="outline" type="button" onClick={() => document.getElementById('tab-trigger-financial')?.click()}>
                    Próximo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Financeiras</CardTitle>
                  <CardDescription>
                    Dados da situação financeira atual do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">Renda Mensal (R$)</Label>
                      <Input
                        id="monthlyIncome"
                        name="monthlyIncome"
                        type="number"
                        value={newClient.monthlyIncome}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min={0}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="riskProfile">Perfil de Risco</Label>
                      <Select 
                        defaultValue={newClient.riskProfile || 'moderate'} 
                        onValueChange={(value) => handleSelectChange('riskProfile', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o perfil de risco" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Conservador</SelectItem>
                          <SelectItem value="moderate">Moderado</SelectItem>
                          <SelectItem value="aggressive">Agressivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyTarget">Meta de Fundo de Emergência (meses)</Label>
                    <Input
                      id="emergencyTarget"
                      name="targetMonths"
                      type="number"
                      value={newClient.emergencyFund?.targetMonths || 6}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setNewClient(prev => ({
                          ...prev,
                          emergencyFund: {
                            ...prev.emergencyFund!,
                            targetMonths: value
                          }
                        }));
                      }}
                      min={1}
                      max={24}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações Financeiras</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Notas adicionais sobre a situação financeira do cliente"
                      rows={4}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => document.getElementById('tab-trigger-personal')?.click()}>
                    Anterior
                  </Button>
                  <Button variant="outline" type="button" onClick={() => document.getElementById('tab-trigger-goals')?.click()}>
                    Próximo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals">
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos Financeiros</CardTitle>
                  <CardDescription>
                    Defina as metas e objetivos do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="retirementAge">Idade Desejada para Aposentadoria</Label>
                      <Input
                        id="retirementAge"
                        type="number"
                        value={newClient.retirement?.retirementAge || 65}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setNewClient(prev => ({
                            ...prev,
                            retirement: {
                              ...prev.retirement!,
                              retirementAge: value
                            }
                          }));
                        }}
                        min={newClient.age || 18}
                        max={100}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetIncome">Renda Mensal Desejada na Aposentadoria (R$)</Label>
                      <Input
                        id="targetIncome"
                        type="number"
                        value={newClient.retirement?.targetIncome || 0}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setNewClient(prev => ({
                            ...prev,
                            retirement: {
                              ...prev.retirement!,
                              targetIncome: value
                            }
                          }));
                        }}
                        min={0}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goalDescription">Objetivos Financeiros Principais</Label>
                    <Textarea
                      id="goalDescription"
                      placeholder="Descreva os principais objetivos financeiros do cliente (casa própria, educação dos filhos, etc.)"
                      rows={4}
                      onChange={(e) => {
                        const description = e.target.value;
                        if (description) {
                          setNewClient(prev => ({
                            ...prev,
                            goals: [{
                              id: uuidv4(),
                              description,
                              targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
                              targetAmount: 0,
                              currentAmount: 0,
                              priority: 'medium',
                              status: 'in-progress'
                            }]
                          }));
                        }
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => document.getElementById('tab-trigger-financial')?.click()}>
                    Anterior
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !!success}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AddClient; 