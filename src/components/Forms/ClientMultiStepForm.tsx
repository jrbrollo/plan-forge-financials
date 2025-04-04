
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Client } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

interface ClientMultiStepFormProps {
  onSave: (client: Omit<Client, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Partial<Client>;
}

export function ClientMultiStepForm({ onSave, onCancel, initialValues = {} }: ClientMultiStepFormProps) {
  // Dados básicos do cliente
  const [name, setName] = useState(initialValues.name || '');
  const [age, setAge] = useState(initialValues.age || 0);
  const [email, setEmail] = useState(initialValues.email || '');
  const [phone, setPhone] = useState(initialValues.phone || '');

  // Dados Pessoais
  const [maritalStatus, setMaritalStatus] = useState<Client['maritalStatus']>(initialValues.maritalStatus);
  const [hasChildren, setHasChildren] = useState(initialValues.hasChildren || false);
  const [numberOfChildren, setNumberOfChildren] = useState(initialValues.numberOfChildren || 0);
  const [childrenAges, setChildrenAges] = useState<number[]>(initialValues.childrenAges || []);
  const [personalComments, setPersonalComments] = useState(initialValues.personalComments || '');

  // Profissão e Trabalho
  const [profession, setProfession] = useState(initialValues.profession || '');
  const [jobDescription, setJobDescription] = useState(initialValues.jobDescription || '');
  const [workMotivation, setWorkMotivation] = useState<Client['workMotivation']>(initialValues.workMotivation);
  const [contractType, setContractType] = useState<Client['contractType']>(initialValues.contractType);

  // Perfil Financeiro
  const [moneyProfile, setMoneyProfile] = useState<Client['moneyProfile']>(initialValues.moneyProfile);
  const [hasFinancialPlanning, setHasFinancialPlanning] = useState(initialValues.hasFinancialPlanning || false);
  const [planningDescription, setPlanningDescription] = useState(initialValues.planningDescription || '');
  const [hasSavingHabit, setHasSavingHabit] = useState(initialValues.hasSavingHabit || false);
  const [savingHabitHistory, setSavingHabitHistory] = useState(initialValues.savingHabitHistory || '');
  const [monthlySavingsAverage, setMonthlySavingsAverage] = useState(initialValues.monthlySavingsAverage || 0);
  const [financialProfileComments, setFinancialProfileComments] = useState(initialValues.financialProfileComments || '');

  // Instituições Bancárias
  const [banks, setBanks] = useState<string[]>(initialValues.banks || []);
  const [paymentMethod, setPaymentMethod] = useState<Client['paymentMethod']>(initialValues.paymentMethod);
  const [creditCards, setCreditCards] = useState<string[]>(initialValues.creditCards || []);
  const [creditCardBillAverage, setCreditCardBillAverage] = useState(initialValues.creditCardBillAverage || 0);

  // Carro
  const [hasCar, setHasCar] = useState(initialValues.hasCar || false);
  const [isCarPaidOff, setIsCarPaidOff] = useState(initialValues.isCarPaidOff || false);
  const [carMarketValue, setCarMarketValue] = useState(initialValues.carMarketValue || 0);
  const [carMonthlyPayment, setCarMonthlyPayment] = useState(initialValues.carMonthlyPayment || 0);
  const [carPaymentRemaining, setCarPaymentRemaining] = useState(initialValues.carPaymentRemaining || '');

  // Imóvel
  const [hasProperty, setHasProperty] = useState(initialValues.hasProperty || false);
  const [isPropertyPaidOff, setIsPropertyPaidOff] = useState(initialValues.isPropertyPaidOff || false);
  const [propertyMarketValue, setPropertyMarketValue] = useState(initialValues.propertyMarketValue || 0);
  const [propertyMonthlyPayment, setPropertyMonthlyPayment] = useState(initialValues.propertyMonthlyPayment || 0);
  const [propertyPaymentRemaining, setPropertyPaymentRemaining] = useState(initialValues.propertyPaymentRemaining || '');

  // Outros bens
  const [otherAssets, setOtherAssets] = useState(initialValues.otherAssets || '');

  // Investimentos
  const [hasInvestments, setHasInvestments] = useState(initialValues.hasInvestments || false);
  const [totalInvestments, setTotalInvestments] = useState(initialValues.totalInvestments || 0);
  const [hasDiversifiedPortfolio, setHasDiversifiedPortfolio] = useState(initialValues.hasDiversifiedPortfolio || false);
  const [investmentsDescription, setInvestmentsDescription] = useState(initialValues.investmentsDescription || '');
  const [selfManagesInvestments, setSelfManagesInvestments] = useState(initialValues.selfManagesInvestments || false);

  // Dívidas
  const [debts, setDebts] = useState<{ value: number, monthlyPayment: number, reason: string }[]>(
    initialValues.debts || []
  );

  // Proteções
  const [hasHealthInsurance, setHasHealthInsurance] = useState(initialValues.hasHealthInsurance || false);
  const [hasLifeInsurance, setHasLifeInsurance] = useState(initialValues.hasLifeInsurance || false);
  const [hasAssetInsurance, setHasAssetInsurance] = useState(initialValues.hasAssetInsurance || false);

  // Imposto de Renda
  const [taxDeclarationType, setTaxDeclarationType] = useState<Client['taxDeclarationType']>(initialValues.taxDeclarationType);
  const [taxResult, setTaxResult] = useState<Client['taxResult']>(initialValues.taxResult);

  // Receitas
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(initialValues.monthlyNetIncome || 0);
  const [additionalIncome, setAdditionalIncome] = useState(initialValues.additionalIncome || '');

  // Despesas
  const [fixedMonthlyExpenses, setFixedMonthlyExpenses] = useState(initialValues.fixedMonthlyExpenses || '');
  const [variableExpenses, setVariableExpenses] = useState(initialValues.variableExpenses || '');

  // Objetivos Financeiros - Aposentadoria
  const [retirement, setRetirement] = useState<Client['retirement']>(
    initialValues.retirement || {
      plan: '',
      inssKnowledge: '',
      desiredPassiveIncome: 0,
      estimatedAmountNeeded: 0,
      targetDate: '',
      comments: ''
    }
  );

  // Objetivos Financeiros - Outros
  const [otherGoals, setOtherGoals] = useState<Client['otherGoals']>(
    initialValues.otherGoals || []
  );

  // Controle do multistep
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { title: "Dados Básicos", description: "Informações de contato" },
    { title: "Dados Pessoais", description: "Estado civil e família" },
    { title: "Profissão", description: "Informações sobre o trabalho" },
    { title: "Perfil Financeiro", description: "Como lida com o dinheiro" },
    { title: "Bancos", description: "Instituições financeiras" },
    { title: "Carro", description: "Informações sobre veículos" },
    { title: "Imóvel", description: "Propriedades" },
    { title: "Outros Bens", description: "Outros ativos" },
    { title: "Investimentos", description: "Aplicações financeiras" },
    { title: "Dívidas", description: "Endividamentos" },
    { title: "Proteções", description: "Seguros e planos" },
    { title: "Imposto de Renda", description: "Informações fiscais" },
    { title: "Receitas", description: "Fontes de renda" },
    { title: "Despesas", description: "Gastos mensais" },
    { title: "Aposentadoria", description: "Planejamento futuro" },
    { title: "Outros Objetivos", description: "Metas financeiras" },
    { title: "Revisão", description: "Verificar informações" },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData: Omit<Client, 'id'> = {
      name,
      age,
      email,
      phone,
      
      // Dados Pessoais
      maritalStatus,
      hasChildren,
      numberOfChildren,
      childrenAges,
      personalComments,
      
      // Profissão e Trabalho
      profession,
      jobDescription,
      workMotivation,
      contractType,
      
      // Perfil Financeiro
      moneyProfile,
      hasFinancialPlanning,
      planningDescription,
      hasSavingHabit,
      savingHabitHistory,
      monthlySavingsAverage,
      financialProfileComments,
      
      // Instituições Bancárias
      banks,
      paymentMethod,
      creditCards,
      creditCardBillAverage,
      
      // Carro
      hasCar,
      isCarPaidOff,
      carMarketValue,
      carMonthlyPayment,
      carPaymentRemaining,
      
      // Imóvel
      hasProperty,
      isPropertyPaidOff,
      propertyMarketValue,
      propertyMonthlyPayment,
      propertyPaymentRemaining,
      
      // Outros bens
      otherAssets,
      
      // Investimentos
      hasInvestments,
      totalInvestments,
      hasDiversifiedPortfolio,
      investmentsDescription,
      selfManagesInvestments,
      
      // Dívidas
      debts,
      
      // Proteções
      hasHealthInsurance,
      hasLifeInsurance,
      hasAssetInsurance,
      
      // Imposto de Renda
      taxDeclarationType,
      taxResult,
      
      // Receitas
      monthlyNetIncome,
      additionalIncome,
      
      // Despesas
      fixedMonthlyExpenses,
      variableExpenses,
      
      // Objetivos Financeiros
      retirement,
      otherGoals,
    };
    
    onSave(clientData);
  };
  
  // Funções de manipulação para arrays
  const addChildAge = () => {
    setChildrenAges([...childrenAges, 0]);
  };
  
  const updateChildAge = (index: number, age: number) => {
    const newAges = [...childrenAges];
    newAges[index] = age;
    setChildrenAges(newAges);
  };

  const removeChildAge = (index: number) => {
    setChildrenAges(childrenAges.filter((_, i) => i !== index));
  };

  const addBank = () => {
    setBanks([...banks, '']);
  };

  const updateBank = (index: number, value: string) => {
    const newBanks = [...banks];
    newBanks[index] = value;
    setBanks(newBanks);
  };

  const removeBank = (index: number) => {
    setBanks(banks.filter((_, i) => i !== index));
  };

  const addCreditCard = () => {
    setCreditCards([...creditCards, '']);
  };

  const updateCreditCard = (index: number, value: string) => {
    const newCards = [...creditCards];
    newCards[index] = value;
    setCreditCards(newCards);
  };

  const removeCreditCard = (index: number) => {
    setCreditCards(creditCards.filter((_, i) => i !== index));
  };

  const addDebt = () => {
    setDebts([...debts, { value: 0, monthlyPayment: 0, reason: '' }]);
  };

  const updateDebt = (index: number, field: string, value: any) => {
    const newDebts = [...debts];
    newDebts[index] = { ...newDebts[index], [field]: value };
    setDebts(newDebts);
  };

  const removeDebt = (index: number) => {
    setDebts(debts.filter((_, i) => i !== index));
  };

  const addGoal = () => {
    setOtherGoals([
      ...otherGoals || [],
      { description: '', amountNeeded: 0, deadline: '', comments: '' }
    ]);
  };

  const updateGoal = (index: number, field: string, value: any) => {
    const newGoals = [...otherGoals || []];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setOtherGoals(newGoals);
  };

  const removeGoal = (index: number) => {
    setOtherGoals((otherGoals || []).filter((_, i) => i !== index));
  };

  // Funções auxiliares para controle de inputs condicionais
  const updateRetirement = (field: string, value: any) => {
    setRetirement({ ...retirement, [field]: value });
  };

  // Renderização dos formulários por etapa
  const renderFormStep = () => {
    switch (currentStep) {
      case 0: // Dados Básicos
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo</label>
              <Input 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nome completo"
                required
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Idade</label>
              <Input
                id="age"
                type="number"
                value={age || ''}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="Idade"
                min="0"
                max="120"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input 
                id="email"
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@exemplo.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <Input 
                id="phone"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>
        );
        
      case 1: // Dados Pessoais
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">Estado civil</label>
              <Select value={maritalStatus} onValueChange={(value: any) => setMaritalStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                  <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                  <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasChildren" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasChildren} 
                  onChange={(e) => setHasChildren(e.target.checked)} 
                />
                <label htmlFor="hasChildren" className="text-sm font-medium text-gray-700">Tem filhos?</label>
              </div>
            </div>
            
            {hasChildren && (
              <>
                <div>
                  <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-700">Quantos filhos?</label>
                  <Input
                    id="numberOfChildren"
                    type="number"
                    value={numberOfChildren || ''}
                    onChange={(e) => setNumberOfChildren(Number(e.target.value))}
                    placeholder="Número de filhos"
                    min="0"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Idade dos filhos</label>
                    <Button type="button" variant="outline" size="sm" onClick={addChildAge}>
                      <Plus size={16} className="mr-1" /> Adicionar
                    </Button>
                  </div>
                  
                  {childrenAges.map((age, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <Input
                        type="number"
                        value={age || ''}
                        onChange={(e) => updateChildAge(index, Number(e.target.value))}
                        placeholder="Idade do filho"
                        className="flex-1"
                        min="0"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeChildAge(index)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="personalComments" className="block text-sm font-medium text-gray-700">Comentários adicionais</label>
              <Textarea
                id="personalComments" 
                value={personalComments} 
                onChange={(e) => setPersonalComments(e.target.value)}
                placeholder="Observações sobre a situação familiar"
              />
            </div>
          </div>
        );

      case 2: // Profissão e Trabalho
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profissão atual</label>
              <Input 
                id="profession"
                value={profession} 
                onChange={(e) => setProfession(e.target.value)} 
                placeholder="Profissão atual"
              />
            </div>
            
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Descreva brevemente suas atividades</label>
              <Textarea 
                id="jobDescription" 
                value={jobDescription} 
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Descrição das atividades profissionais"
              />
            </div>
            
            <div>
              <label htmlFor="workMotivation" className="block text-sm font-medium text-gray-700">Você trabalha mais por...</label>
              <Select value={workMotivation} onValueChange={(value: any) => setWorkMotivation(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a motivação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amor">Amor</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="contractType" className="block text-sm font-medium text-gray-700">Tipo de contrato</label>
              <Select value={contractType} onValueChange={(value: any) => setContractType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLT">CLT</SelectItem>
                  <SelectItem value="PJ">PJ</SelectItem>
                  <SelectItem value="Concursado">Concursado</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3: // Perfil Financeiro
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="moneyProfile" className="block text-sm font-medium text-gray-700">Como se considera com dinheiro?</label>
              <Select value={moneyProfile} onValueChange={(value: any) => setMoneyProfile(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gastador">Gastador</SelectItem>
                  <SelectItem value="Meio-termo">Meio-termo</SelectItem>
                  <SelectItem value="Controlado">Controlado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasFinancialPlanning" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasFinancialPlanning} 
                  onChange={(e) => setHasFinancialPlanning(e.target.checked)} 
                />
                <label htmlFor="hasFinancialPlanning" className="text-sm font-medium text-gray-700">Já faz planejamento financeiro?</label>
              </div>
            </div>
            
            {hasFinancialPlanning && (
              <div>
                <label htmlFor="planningDescription" className="block text-sm font-medium text-gray-700">Como faz esse planejamento?</label>
                <Textarea 
                  id="planningDescription" 
                  value={planningDescription} 
                  onChange={(e) => setPlanningDescription(e.target.value)}
                  placeholder="Descreva como você faz seu planejamento"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasSavingHabit" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasSavingHabit} 
                  onChange={(e) => setHasSavingHabit(e.target.checked)} 
                />
                <label htmlFor="hasSavingHabit" className="text-sm font-medium text-gray-700">Tem o hábito de poupar todo mês?</label>
              </div>
            </div>
            
            {hasSavingHabit && (
              <>
                <div>
                  <label htmlFor="savingHabitHistory" className="block text-sm font-medium text-gray-700">Sempre foi assim?</label>
                  <Textarea 
                    id="savingHabitHistory" 
                    value={savingHabitHistory} 
                    onChange={(e) => setSavingHabitHistory(e.target.value)}
                    placeholder="História do seu hábito de poupar"
                  />
                </div>
                
                <div>
                  <label htmlFor="monthlySavingsAverage" className="block text-sm font-medium text-gray-700">Média mensal poupada</label>
                  <CurrencyInput
                    value={monthlySavingsAverage}
                    onChange={setMonthlySavingsAverage}
                    placeholder="R$ 0,00"
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="financialProfileComments" className="block text-sm font-medium text-gray-700">Comentários adicionais</label>
              <Textarea 
                id="financialProfileComments" 
                value={financialProfileComments} 
                onChange={(e) => setFinancialProfileComments(e.target.value)}
                placeholder="Observações adicionais sobre seu perfil financeiro"
              />
            </div>
          </div>
        );

      case 4: // Instituições Bancárias
        return (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Bancos utilizados</label>
                <Button type="button" variant="outline" size="sm" onClick={addBank}>
                  <Plus size={16} className="mr-1" /> Adicionar
                </Button>
              </div>
              
              {banks.map((bank, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <Input
                    value={bank}
                    onChange={(e) => updateBank(index, e.target.value)}
                    placeholder="Nome do banco"
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeBank(index)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Método mais usado</label>
              <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cartão de crédito">Cartão de crédito</SelectItem>
                  <SelectItem value="Cartão de débito">Cartão de débito</SelectItem>
                  <SelectItem value="Ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Cartões utilizados</label>
                <Button type="button" variant="outline" size="sm" onClick={addCreditCard}>
                  <Plus size={16} className="mr-1" /> Adicionar
                </Button>
              </div>
              
              {creditCards.map((card, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <Input
                    value={card}
                    onChange={(e) => updateCreditCard(index, e.target.value)}
                    placeholder="Nome do cartão"
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeCreditCard(index)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            
            <div>
              <label htmlFor="creditCardBillAverage" className="block text-sm font-medium text-gray-700">Média da fatura do cartão de crédito</label>
              <CurrencyInput
                value={creditCardBillAverage}
                onChange={setCreditCardBillAverage}
                placeholder="R$ 0,00"
              />
            </div>
          </div>
        );

      case 5: // Carro
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasCar" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasCar} 
                  onChange={(e) => setHasCar(e.target.checked)} 
                />
                <label htmlFor="hasCar" className="text-sm font-medium text-gray-700">Possui carro?</label>
              </div>
            </div>
            
            {hasCar && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="isCarPaidOff" 
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={isCarPaidOff} 
                      onChange={(e) => setIsCarPaidOff(e.target.checked)} 
                    />
                    <label htmlFor="isCarPaidOff" className="text-sm font-medium text-gray-700">Carro quitado?</label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="carMarketValue" className="block text-sm font-medium text-gray-700">Valor de mercado do carro</label>
                  <CurrencyInput
                    value={carMarketValue}
                    onChange={setCarMarketValue}
                    placeholder="R$ 0,00"
                  />
                </div>
                
                {!isCarPaidOff && (
                  <>
                    <div>
                      <label htmlFor="carMonthlyPayment" className="block text-sm font-medium text-gray-700">Valor da parcela</label>
                      <CurrencyInput
                        value={carMonthlyPayment}
                        onChange={setCarMonthlyPayment}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="carPaymentRemaining" className="block text-sm font-medium text-gray-700">Falta muito para quitar?</label>
                      <Input 
                        id="carPaymentRemaining"
                        value={carPaymentRemaining} 
                        onChange={(e) => setCarPaymentRemaining(e.target.value)} 
                        placeholder="Ex: 24 parcelas ou 2 anos"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );

      case 6: // Imóvel
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasProperty" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasProperty} 
                  onChange={(e) => setHasProperty(e.target.checked)} 
                />
                <label htmlFor="hasProperty" className="text-sm font-medium text-gray-700">Possui imóvel?</label>
              </div>
            </div>
            
            {hasProperty && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="isPropertyPaidOff" 
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={isPropertyPaidOff} 
                      onChange={(e) => setIsPropertyPaidOff(e.target.checked)} 
                    />
                    <label htmlFor="isPropertyPaidOff" className="text-sm font-medium text-gray-700">Imóvel quitado?</label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="propertyMarketValue" className="block text-sm font-medium text-gray-700">Valor de mercado do imóvel</label>
                  <CurrencyInput
                    value={propertyMarketValue}
                    onChange={setPropertyMarketValue}
                    placeholder="R$ 0,00"
                  />
                </div>
                
                {!isPropertyPaidOff && (
                  <>
                    <div>
                      <label htmlFor="propertyMonthlyPayment" className="block text-sm font-medium text-gray-700">Valor da parcela</label>
                      <CurrencyInput
                        value={propertyMonthlyPayment}
                        onChange={setPropertyMonthlyPayment}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="propertyPaymentRemaining" className="block text-sm font-medium text-gray-700">Falta muito para quitar?</label>
                      <Input 
                        id="propertyPaymentRemaining"
                        value={propertyPaymentRemaining} 
                        onChange={(e) => setPropertyPaymentRemaining(e.target.value)} 
                        placeholder="Ex: 240 parcelas ou 20 anos"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );

      case 7: // Outros bens
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="otherAssets" className="block text-sm font-medium text-gray-700">Descreva outros bens e valores aproximados</label>
              <Textarea 
                id="otherAssets" 
                value={otherAssets} 
                onChange={(e) => setOtherAssets(e.target.value)}
                placeholder="Descreva outros bens como joias, obras de arte, etc."
                className="h-48"
              />
            </div>
          </div>
        );

      case 8: // Investimentos
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasInvestments" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasInvestments} 
                  onChange={(e) => setHasInvestments(e.target.checked)} 
                />
                <label htmlFor="hasInvestments" className="text-sm font-medium text-gray-700">Já investe?</label>
              </div>
            </div>
            
            {hasInvestments && (
              <>
                <div>
                  <label htmlFor="totalInvestments" className="block text-sm font-medium text-gray-700">Valor total investido</label>
                  <CurrencyInput
                    value={totalInvestments}
                    onChange={setTotalInvestments}
                    placeholder="R$ 0,00"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="hasDiversifiedPortfolio" 
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={hasDiversifiedPortfolio} 
                      onChange={(e) => setHasDiversifiedPortfolio(e.target.checked)} 
                    />
                    <label htmlFor="hasDiversifiedPortfolio" className="text-sm font-medium text-gray-700">Carteira está diversificada?</label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="investmentsDescription" className="block text-sm font-medium text-gray-700">Quais investimentos possui?</label>
                  <Textarea 
                    id="investmentsDescription" 
                    value={investmentsDescription} 
                    onChange={(e) => setInvestmentsDescription(e.target.value)}
                    placeholder="Liste os tipos de investimentos que possui"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="selfManagesInvestments" 
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={selfManagesInvestments} 
                      onChange={(e) => setSelfManagesInvestments(e.target.checked)} 
                    />
                    <label htmlFor="selfManagesInvestments" className="text-sm font-medium text-gray-700">Faz o controle dos investimentos por conta própria?</label>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 9: // Dívidas
        return (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Dívidas</label>
                <Button type="button" variant="outline" size="sm" onClick={addDebt}>
                  <Plus size={16} className="mr-1" /> Adicionar
                </Button>
              </div>
              
              {debts.map((debt, index) => (
                <div key={index} className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Dívida {index + 1}</h4>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDebt(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Valor da dívida</label>
                      <CurrencyInput
                        value={debt.value}
                        onChange={(value) => updateDebt(index, 'value', value)}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Valor da parcela mensal</label>
                      <CurrencyInput
                        value={debt.monthlyPayment}
                        onChange={(value) => updateDebt(index, 'monthlyPayment', value)}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivo da dívida</label>
                      <Textarea
                        value={debt.reason}
                        onChange={(e) => updateDebt(index, 'reason', e.target.value)}
                        placeholder="Ex: Financiamento, cartão de crédito, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {debts.length === 0 && (
                <p className="text-sm text-gray-500 italic">Nenhuma dívida cadastrada.</p>
              )}
            </div>
          </div>
        );

      case 10: // Proteções
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasHealthInsurance" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasHealthInsurance} 
                  onChange={(e) => setHasHealthInsurance(e.target.checked)} 
                />
                <label htmlFor="hasHealthInsurance" className="text-sm font-medium text-gray-700">Tem plano de saúde?</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasLifeInsurance" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasLifeInsurance} 
                  onChange={(e) => setHasLifeInsurance(e.target.checked)} 
                />
                <label htmlFor="hasLifeInsurance" className="text-sm font-medium text-gray-700">Tem seguro de vida?</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasAssetInsurance" 
                  className="rounded text-primary focus:ring-primary mr-2"
                  checked={hasAssetInsurance} 
                  onChange={(e) => setHasAssetInsurance(e.target.checked)} 
                />
                <label htmlFor="hasAssetInsurance" className="text-sm font-medium text-gray-700">Tem seguro dos bens?</label>
              </div>
            </div>
          </div>
        );

      case 11: // Imposto de Renda
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="taxDeclarationType" className="block text-sm font-medium text-gray-700">Tipo de declaração</label>
              <Select value={taxDeclarationType} onValueChange={(value: any) => setTaxDeclarationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simplificado">Simplificado</SelectItem>
                  <SelectItem value="Completo">Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="taxResult" className="block text-sm font-medium text-gray-700">Costuma pagar ou restituir?</label>
              <Select value={taxResult} onValueChange={(value: any) => setTaxResult(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pagar">Pagar</SelectItem>
                  <SelectItem value="Restituir">Restituir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 12: // Receitas
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="monthlyNetIncome" className="block text-sm font-medium text-gray-700">Renda líquida mensal</label>
              <CurrencyInput
                value={monthlyNetIncome}
                onChange={setMonthlyNetIncome}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div>
              <label htmlFor="additionalIncome" className="block text-sm font-medium text-gray-700">Recebe bônus, PLR, 14º, etc?</label>
              <Textarea 
                id="additionalIncome" 
                value={additionalIncome} 
                onChange={(e) => setAdditionalIncome(e.target.value)}
                placeholder="Descreva rendas extras ou adicionais"
              />
            </div>
          </div>
        );

      case 13: // Despesas
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="fixedMonthlyExpenses" className="block text-sm font-medium text-gray-700">Despesas fixas mensais</label>
              <Textarea 
                id="fixedMonthlyExpenses" 
                value={fixedMonthlyExpenses} 
                onChange={(e) => setFixedMonthlyExpenses(e.target.value)}
                placeholder="Liste suas despesas fixas mensais e valores aproximados"
                className="h-40"
              />
            </div>
            
            <div>
              <label htmlFor="variableExpenses" className="block text-sm font-medium text-gray-700">Estimativa de gastos variáveis</label>
              <Textarea 
                id="variableExpenses" 
                value={variableExpenses} 
                onChange={(e) => setVariableExpenses(e.target.value)}
                placeholder="Liste suas despesas variáveis e estimativa de valores"
                className="h-40"
              />
            </div>
          </div>
        );

      case 14: // Aposentadoria
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="retirementPlan" className="block text-sm font-medium text-gray-700">Qual seu plano para parar de trabalhar?</label>
              <Textarea 
                id="retirementPlan" 
                value={retirement?.plan || ''} 
                onChange={(e) => updateRetirement('plan', e.target.value)}
                placeholder="Descreva seu plano para aposentadoria"
              />
            </div>
            
            <div>
              <label htmlFor="inssKnowledge" className="block text-sm font-medium text-gray-700">Conhece o funcionamento do INSS?</label>
              <Textarea 
                id="inssKnowledge" 
                value={retirement?.inssKnowledge || ''} 
                onChange={(e) => updateRetirement('inssKnowledge', e.target.value)}
                placeholder="O que você sabe sobre o INSS?"
              />
            </div>
            
            <div>
              <label htmlFor="desiredPassiveIncome" className="block text-sm font-medium text-gray-700">Renda passiva desejada</label>
              <CurrencyInput
                value={retirement?.desiredPassiveIncome || 0}
                onChange={(value) => updateRetirement('desiredPassiveIncome', value)}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div>
              <label htmlFor="estimatedAmountNeeded" className="block text-sm font-medium text-gray-700">Valor estimado necessário para alcançar</label>
              <CurrencyInput
                value={retirement?.estimatedAmountNeeded || 0}
                onChange={(value) => updateRetirement('estimatedAmountNeeded', value)}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">Quando deseja alcançar?</label>
              <Input 
                id="targetDate"
                value={retirement?.targetDate || ''} 
                onChange={(e) => updateRetirement('targetDate', e.target.value)} 
                placeholder="Ex: 65 anos ou 2045"
              />
            </div>
            
            <div>
              <label htmlFor="retirementComments" className="block text-sm font-medium text-gray-700">Comentários</label>
              <Textarea 
                id="retirementComments" 
                value={retirement?.comments || ''} 
                onChange={(e) => updateRetirement('comments', e.target.value)}
                placeholder="Observações adicionais sobre a aposentadoria"
              />
            </div>
          </div>
        );

      case 15: // Outros Objetivos
        return (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Outros Objetivos</label>
                <Button type="button" variant="outline" size="sm" onClick={addGoal}>
                  <Plus size={16} className="mr-1" /> Adicionar
                </Button>
              </div>
              
              {otherGoals && otherGoals.map((goal, index) => (
                <div key={index} className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Objetivo {index + 1}</h4>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeGoal(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descrição do objetivo</label>
                      <Input
                        value={goal.description}
                        onChange={(e) => updateGoal(index, 'description', e.target.value)}
                        placeholder="Ex: Comprar casa, viagem internacional, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Valor necessário</label>
                      <CurrencyInput
                        value={goal.amountNeeded}
                        onChange={(value) => updateGoal(index, 'amountNeeded', value)}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prazo para atingir</label>
                      <Input
                        value={goal.deadline}
                        onChange={(e) => updateGoal(index, 'deadline', e.target.value)}
                        placeholder="Ex: 5 anos ou 2030"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Comentários</label>
                      <Textarea
                        value={goal.comments}
                        onChange={(e) => updateGoal(index, 'comments', e.target.value)}
                        placeholder="Detalhes adicionais sobre este objetivo"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(!otherGoals || otherGoals.length === 0) && (
                <p className="text-sm text-gray-500 italic">Nenhum objetivo adicional cadastrado.</p>
              )}
            </div>
          </div>
        );

      case 16: // Revisão
        return (
          <div className="space-y-4">
            <p className="text-gray-700">Revise as informações inseridas antes de salvar o cadastro do cliente.</p>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Dados básicos</h3>
              <p>Nome: {name}</p>
              <p>Idade: {age}</p>
              <p>Email: {email}</p>
              <p>Telefone: {phone}</p>
            </div>
            
            <Separator className="my-4" />
            
            {/* Você pode adicionar mais seções aqui para exibir um resumo das informações */}
            
            <p className="text-sm text-gray-500">
              Clique em "Salvar Cliente" para finalizar o cadastro, ou use as setas para voltar e revisar seções específicas.
            </p>
          </div>
        );

      default:
        return <div>Etapa não encontrada</div>;
    }
  };

  return (
    <Card className="finance-card w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-finance-navy">{steps[currentStep].title}</CardTitle>
        <p className="text-gray-500">{steps[currentStep].description}</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          {renderFormStep()}
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div>
          {currentStep > 0 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft size={16} className="mr-1" /> Anterior
            </Button>
          )}
        </div>
        
        <div>
          {currentStep === steps.length - 1 ? (
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="button" onClick={handleSubmit}>Salvar Cliente</Button>
            </div>
          ) : (
            <Button type="button" onClick={nextStep}>
              Próximo <ChevronRight size={16} className="ml-1" />
            </Button>
          )}
        </div>
      </CardFooter>
      
      <div className="px-6 pb-6">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          Etapa {currentStep + 1} de {steps.length}
        </div>
      </div>
    </Card>
  );
}
