
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface PercentageInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PercentageInput({
  value,
  onChange,
  placeholder = "0,00%",
  className = "",
  disabled = false
}: PercentageInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  
  // Format the value on initial load and when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatPercentage(value));
    }
  }, [value]);
  
  const formatPercentage = (val: number) => {
    return `${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  };

  const unformatPercentage = (val: string) => {
    return parseFloat(val.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const numericValue = unformatPercentage(inputVal);
    
    onChange(numericValue);
  };

  const handleBlur = () => {
    setDisplayValue(formatPercentage(value));
  };

  const handleFocus = () => {
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
