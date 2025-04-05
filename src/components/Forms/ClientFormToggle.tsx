import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientForm } from "./ClientForm";
import { ClientMultiStepForm } from "./ClientMultiStepForm";
import { Client } from "@/lib/types";

interface ClientFormToggleProps {
  onSave: (client: Omit<Client, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Partial<Client>;
  forceCompleteForm?: boolean;
}

export function ClientFormToggle({ 
  onSave, 
  onCancel, 
  initialValues = {},
  forceCompleteForm = false
}: ClientFormToggleProps) {
  const [formType, setFormType] = useState<"simples" | "completo">(forceCompleteForm ? "completo" : "simples");

  useEffect(() => {
    if (forceCompleteForm) {
      setFormType("completo");
    }
  }, [forceCompleteForm]);

  if (forceCompleteForm) {
    return (
      <ClientMultiStepForm 
        onSave={onSave}
        onCancel={onCancel}
        initialValues={initialValues}
      />
    );
  }

  return (
    <div className="w-full">
      <Tabs 
        defaultValue="simples" 
        value={formType} 
        onValueChange={(value) => setFormType(value as "simples" | "completo")}
        className="w-full mb-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simples">Cadastro Simples</TabsTrigger>
          <TabsTrigger value="completo">Cadastro Completo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simples" className="mt-4">
          <ClientForm 
            onSave={onSave}
            onCancel={onCancel}
            initialValues={initialValues}
            isSimpleForm={true}
          />
        </TabsContent>
        
        <TabsContent value="completo" className="mt-4">
          <ClientMultiStepForm 
            onSave={onSave}
            onCancel={onCancel}
            initialValues={initialValues}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 