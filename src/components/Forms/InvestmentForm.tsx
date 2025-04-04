
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { PercentageInput } from "@/components/ui/percentage-input";
import { Investment } from '@/lib/types';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState as preactState } from "preact/hooks";

interface InvestmentFormProps {
  onSave: (investment: Investment) => void;
  onCancel: () => void;
}

export function InvestmentForm({ onSave, onCancel }: InvestmentFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [initialValue, setInitialValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [annualReturn, setAnnualReturn] = useState(0);
  const [investmentDate, setInvestmentDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !type || !investmentDate) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const newInvestment: Investment = {
      name,
      type,
      initialValue,
      currentValue,
      annualReturn,
      investmentDate: investmentDate as Date,
    };
    
    onSave(newInvestment);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-finance-navy">Registre seu investimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="investment-name">Qual investimento você fez?</Label>
            <Input 
              id="investment-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="reserva"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investment-initial-value">Valor investido (R$)</Label>
              <CurrencyInput
                value={initialValue}
                onChange={setInitialValue}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investment-current-value">Valor atual (R$)</Label>
              <CurrencyInput
                value={currentValue}
                onChange={setCurrentValue}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investment-date">Data do investimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !investmentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {investmentDate ? format(investmentDate, 'yyyy/MM/dd') : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={investmentDate}
                    onSelect={setInvestmentDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="investment-return">Rentabilidade anual (%)</Label>
              <PercentageInput
                value={annualReturn}
                onChange={setAnnualReturn}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="investment-type">Categoria</Label>
            <div className="mt-1">
              <Label>Tipo de investimento:</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Renda Fixa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed_income">Renda Fixa</SelectItem>
                  <SelectItem value="variable_income">Renda Variável</SelectItem>
                  <SelectItem value="real_estate">Fundos Imobiliários</SelectItem>
                  <SelectItem value="emergency_fund">Reserva de Emergência</SelectItem>
                  <SelectItem value="retirement">Previdência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <X size={18} />
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-finance-blue hover:bg-finance-darkblue"
        >
          <Save size={18} />
          Salvar investimento
        </Button>
      </CardFooter>
    </Card>
  );
}
