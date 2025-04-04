
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "R$ 0,00",
  className = "",
  disabled = false
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  
  // Format the value on initial load and when value prop changes
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(val);
  };

  const unformatCurrency = (val: string) => {
    return parseFloat(val.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const numericValue = unformatCurrency(inputVal);
    
    onChange(numericValue);
  };

  const handleBlur = () => {
    setDisplayValue(formatCurrency(value));
  };

  const handleFocus = () => {
    // On focus, just show the number without currency formatting
    setDisplayValue(value.toString().replace('.', ','));
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}
