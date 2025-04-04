
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client } from "@/lib/types";

interface ClientFormProps {
  onSave: (client: Omit<Client, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Partial<Client>;
  isSimpleForm?: boolean;
}

export function ClientForm({ onSave, onCancel, initialValues = {}, isSimpleForm = false }: ClientFormProps) {
  const [name, setName] = useState(initialValues.name || '');
  const [age, setAge] = useState(initialValues.age || 0);
  const [email, setEmail] = useState(initialValues.email || '');
  const [phone, setPhone] = useState(initialValues.phone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name,
      age,
      email,
      phone
    });
  };

  return (
    <Card className="finance-card">
      <CardHeader>
        <CardTitle className="text-finance-navy">Dados do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <Input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nome do Cliente"
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
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Salvar Cliente</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
