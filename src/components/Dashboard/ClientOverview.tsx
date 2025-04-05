import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Shield } from 'lucide-react';
import type { Client } from '@/lib/types';

export const ClientOverview: React.FC<{ client: Client }> = ({ client }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  const clientAge = client.birthDate ? calculateAge(client.birthDate) : null;

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
            <User className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{client.name}</h2>
            <p className="text-blue-100">
              {client.profession || 'Profissão não informada'}
              {client.company && ` · ${client.company}`}
            </p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Informações Pessoais</h3>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">{client.email || 'Email não informado'}</p>
                <p className="text-sm text-gray-500">Email</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">{client.phone || 'Telefone não informado'}</p>
                <p className="text-sm text-gray-500">Telefone</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">
                  {client.address ? (
                    <>
                      {client.address.street}
                      {client.address?.number && `, ${client.address.number}`}
                      {client.address?.complement && `, ${client.address.complement}`}
                      <br />
                      {client.address.city}
                      {client.address?.state && ` - ${client.address.state}`}
                      {client.address?.zipcode && ` · ${client.address.zipcode}`}
                    </>
                  ) : (
                    'Endereço não informado'
                  )}
                </p>
                <p className="text-sm text-gray-500">Endereço</p>
              </div>
            </div>
            
            {client.birthDate && (
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">
                    {formatDate(client.birthDate)}
                    {clientAge && ` · ${clientAge} anos`}
                  </p>
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Status Financeiro</h3>
            
            <div className="space-y-3">
              {client.income && (
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.income)}
                      {client.incomeFrequency && ` / ${client.incomeFrequency === 'monthly' ? 'mensal' : 'anual'}`}
                    </p>
                    <p className="text-sm text-gray-500">Renda</p>
                  </div>
                </div>
              )}
              
              {client.insuranceStatus && (
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <div>
                      {Object.entries(client.insuranceStatus || {}).map(([key, value]) => {
                        // Formatando os nomes dos seguros
                        const insuranceNames: Record<string, string> = {
                          lifeInsurance: 'Seguro de Vida',
                          healthInsurance: 'Plano de Saúde',
                          homeInsurance: 'Seguro Residencial',
                          autoInsurance: 'Seguro Auto',
                          disabilityInsurance: 'Seguro por Invalidez'
                        };
                        
                        const name = insuranceNames[key] || key;
                        
                        return value ? (
                          <Badge key={key} className="mr-2 mb-2 bg-green-100 text-green-800 hover:bg-green-200">
                            {name}
                          </Badge>
                        ) : null;
                      })}
                      
                      {Object.values(client.insuranceStatus || {}).every(v => !v) && (
                        <p className="text-amber-600">Sem seguros ativos</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Proteções</p>
                  </div>
                </div>
              )}
              
              {client.financialProfile && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Perfil Financeiro</h4>
                  <div className="flex flex-wrap gap-2">
                    {client.financialProfile.riskTolerance && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Risco: {
                          client.financialProfile.riskTolerance === 'low' ? 'Conservador' :
                          client.financialProfile.riskTolerance === 'medium' ? 'Moderado' :
                          'Arrojado'
                        }
                      </Badge>
                    )}
                    
                    {client.financialProfile.investmentExperience && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                        Experiência: {
                          client.financialProfile.investmentExperience === 'none' ? 'Nenhuma' :
                          client.financialProfile.investmentExperience === 'beginner' ? 'Iniciante' :
                          client.financialProfile.investmentExperience === 'intermediate' ? 'Intermediária' :
                          'Avançada'
                        }
                      </Badge>
                    )}
                    
                    {client.financialProfile.retirementAge && (
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                        Apos. aos {client.financialProfile.retirementAge} anos
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
