import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PercentageInput } from "@/components/ui/percentage-input";
import { Investment } from "@/lib/types";

interface InvestmentFormProps {
  onSave: (investment: Omit<Investment, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Partial<Investment>;
}

export function InvestmentForm({ onSave, onCancel, initialValues = {} }: InvestmentFormProps) {
  const [name, setName] = useState(initialValues.name || '');
  const [type, setType] = useState(initialValues.type || 'other');
  const [initialValue, setInitialValue] = useState(initialValues.initialValue || 0);
  const [currentValue, setCurrentValue] = useState(initialValues.currentValue || 0);
  const [annualReturn, setAnnualReturn] = useState(initialValues.annualReturn || 0);
  const [investmentDate, setInvestmentDate] = useState(initialValues.investmentDate ? 
    initialValues.investmentDate.toISOString().split('T')[0] : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name,
      type: type as Investment['type'],
      initialValue,
      currentValue,
      annualReturn,
      investmentDate: new Date(investmentDate)
    });

    // Reset form
    setName('');
    setType('other');
    setInitialValue(0);
    setCurrentValue(0);
    setAnnualReturn(0);
    setInvestmentDate('');
  };

  return (
    <Card className="finance-card">
      <CardHeader>
        <CardTitle className="text-finance-navy">Add Investment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Investment Name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="emergency_fund">Emergency Fund</option>
              <option value="retirement">Retirement</option>
              <option value="goal">Goal-specific</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="initialValue" className="block text-sm font-medium text-gray-700">Initial Value</label>
            <CurrencyInput
              value={initialValue}
              onChange={setInitialValue}
              placeholder="R$ 0,00"
            />
          </div>
          
          <div>
            <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700">Current Value</label>
            <CurrencyInput
              value={currentValue}
              onChange={setCurrentValue}
              placeholder="R$ 0,00"
            />
          </div>
          
          <div>
            <label htmlFor="annualReturn" className="block text-sm font-medium text-gray-700">Annual Return (%)</label>
            <PercentageInput
              value={annualReturn}
              onChange={setAnnualReturn}
              placeholder="0%"
            />
          </div>
          
          <div>
            <label htmlFor="investmentDate" className="block text-sm font-medium text-gray-700">Investment Date</label>
            <Input
              id="investmentDate"
              type="date"
              value={investmentDate}
              onChange={(e) => setInvestmentDate(e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Add Investment</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
