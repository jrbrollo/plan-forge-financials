import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  className?: string;
}

export function CurrencyInput({ 
  value, 
  onChange, 
  prefix = 'R$ ', 
  className,
  ...props 
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  
  // Formata o valor como moeda (R$) ao carregar/alterar o valor
  useEffect(() => {
    if (value || value === 0) {
      const formatted = value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    
    // Remove tudo exceto números e ponto
    const numericValue = input.replace(/[^\d]/g, '');
    
    if (numericValue === '') {
      onChange(0);
      return;
    }
    
    // Converte para número e divide por 100 para considerar centavos
    const numberValue = parseInt(numericValue, 10) / 100;
    onChange(numberValue);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        {prefix}
      </span>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={cn('pl-10', className)}
        {...props}
      />
    </div>
  );
}
