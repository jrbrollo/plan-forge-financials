import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle, Shield } from 'lucide-react';
import type { Client } from '@/lib/types';

interface ClientInsuranceStatusProps {
  client: Client;
}

export const ClientInsuranceStatus: React.FC<ClientInsuranceStatusProps> = ({ client }) => {
  // Verifica se o cliente tem informações de seguro
  if (!client.insuranceStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 text-blue-500 mr-2" />
            Status de Proteções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4">
            <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
            <p className="text-center text-gray-500">Sem informações de seguros disponíveis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Definir tipos de seguros e nomes de exibição
  const insuranceTypes = [
    { key: 'lifeInsurance', title: 'Seguro de Vida', description: 'Protege financeiramente seus dependentes' },
    { key: 'healthInsurance', title: 'Plano de Saúde', description: 'Cobertura para despesas médicas e hospitalares' },
    { key: 'homeInsurance', title: 'Seguro Residencial', description: 'Protege sua residência contra danos e roubos' },
    { key: 'autoInsurance', title: 'Seguro Auto', description: 'Cobertura para seu veículo em caso de acidentes ou roubo' },
    { key: 'disabilityInsurance', title: 'Seguro por Invalidez', description: 'Proteção financeira em caso de incapacidade para trabalhar' }
  ];

  // Contar quantos seguros o cliente possui
  const totalInsurances = Object.values(client.insuranceStatus || {}).filter(Boolean).length;
  const hasAllInsurances = totalInsurances === insuranceTypes.length;
  const hasSomeInsurances = totalInsurances > 0;
  const hasNoInsurances = totalInsurances === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Shield className="h-5 w-5 text-blue-500 mr-2" />
          Status de Proteções
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className={`flex items-center p-3 rounded-lg mb-2 ${
            hasAllInsurances ? 'bg-green-50 text-green-700' : 
            hasSomeInsurances ? 'bg-blue-50 text-blue-700' : 
            'bg-amber-50 text-amber-700'
          }`}>
            {hasAllInsurances && <CheckCircle className="h-5 w-5 mr-2 text-green-500" />}
            {hasSomeInsurances && !hasAllInsurances && <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />}
            {hasNoInsurances && <XCircle className="h-5 w-5 mr-2 text-amber-500" />}
            
            <span className="font-medium">
              {hasAllInsurances ? 'Proteção completa' : 
               hasSomeInsurances ? `${totalInsurances} de ${insuranceTypes.length} proteções ativas` : 
               'Sem proteções ativas'}
            </span>
          </div>
          
          {(hasSomeInsurances && !hasAllInsurances) || hasNoInsurances ? (
            <p className="text-sm text-gray-600 mb-4">
              {hasSomeInsurances ? 
                'Considere complementar suas proteções para ter maior segurança financeira.' : 
                'Recomendamos avaliar a contratação de proteções para garantir sua segurança financeira.'}
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          {insuranceTypes.map((insurance) => {
            const hasInsurance = client.insuranceStatus?.[insurance.key as keyof typeof client.insuranceStatus];
            
            return (
              <div 
                key={insurance.key} 
                className={`p-3 rounded-lg border ${hasInsurance ? 'border-green-200' : 'border-gray-200'}`}
              >
                <div className="flex items-start">
                  {hasInsurance ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  
                  <div>
                    <h3 className={`font-medium ${hasInsurance ? '' : 'text-gray-500'}`}>
                      {insurance.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {insurance.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Recomendações */}
        {!hasAllInsurances && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <p className="font-medium mb-1">Recomendações:</p>
            <ul className="list-disc pl-5 space-y-1">
              {!client.insuranceStatus?.lifeInsurance && (
                <li>Avalie contratar um seguro de vida para proteger seus dependentes</li>
              )}
              {!client.insuranceStatus?.healthInsurance && (
                <li>Um plano de saúde pode evitar gastos inesperados com saúde</li>
              )}
              {!client.insuranceStatus?.disabilityInsurance && client?.income && client.income > 3000 && (
                <li>Sua renda justifica um seguro por invalidez para manter sua qualidade de vida</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 