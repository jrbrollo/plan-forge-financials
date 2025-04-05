import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, FileText, Download, Printer, Share2
} from 'lucide-react';
import { useClient } from '@/context/ClientContext';

const Reports = () => {
  const { clientId } = useParams<{ clientId?: string }>();
  const { currentClient } = useClient();

  // Utilizar o cliente atual ou buscar pelo ID da URL
  const client = currentClient?.id === clientId ? currentClient : null;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Relatórios</h1>
            {client && (
              <p className="text-muted-foreground">
                Cliente: <span className="font-medium">{client.name}</span>
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              <span>Exportar PDF</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer size={16} />
              <span>Imprimir</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 size={16} />
              <span>Compartilhar</span>
            </Button>
          </div>
        </div>
        
        {!client ? (
          <Card>
            <CardContent className="py-10 text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Nenhum cliente selecionado</h2>
              <p className="text-muted-foreground mb-6">
                Selecione um cliente para visualizar seus relatórios financeiros
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="summary">
              <TabsList className="mb-6">
                <TabsTrigger value="summary">Resumo</TabsTrigger>
                <TabsTrigger value="budget">Orçamento</TabsTrigger>
                <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
                <TabsTrigger value="investments">Investimentos</TabsTrigger>
                <TabsTrigger value="retirement">Aposentadoria</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                {/* Resumo Geral */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Patrimônio Líquido</CardTitle>
                      <CardDescription>Ativos - Passivos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">R$ 325.000,00</p>
                      <p className="text-sm text-green-600">+12% em 6 meses</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Saldo Mensal</CardTitle>
                      <CardDescription>Receitas - Despesas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">R$ 4.200,00</p>
                      <p className="text-sm text-green-600">+8% comparado ao mês anterior</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Taxa de Poupança</CardTitle>
                      <CardDescription>Quanto da renda é poupada</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">28%</p>
                      <p className="text-sm text-muted-foreground">Meta: 30%</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Gráfico de Alocação de Ativos */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Alocação de Ativos</CardTitle>
                    <CardDescription>
                      Distribuição atual do patrimônio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 w-full flex items-center justify-center">
                    <div className="bg-muted rounded-md p-4 flex items-center justify-center w-full h-full">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                        <p className="text-muted-foreground">Visualização do gráfico de alocação de ativos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Metas Financeiras */}
                <Card>
                  <CardHeader>
                    <CardTitle>Metas Financeiras</CardTitle>
                    <CardDescription>
                      Progresso das metas estabelecidas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Fundo de Emergência</span>
                          <span>80%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Entrada Casa Própria</span>
                          <span>45%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Aposentadoria</span>
                          <span>32%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: '32%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="budget">
                <Card className="py-10 text-center">
                  <CardContent>
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Relatório de Orçamento</h2>
                    <p className="text-muted-foreground mb-6">
                      Os dados detalhados do orçamento serão exibidos aqui
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cashflow">
                <Card className="py-10 text-center">
                  <CardContent>
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Relatório de Fluxo de Caixa</h2>
                    <p className="text-muted-foreground mb-6">
                      Os dados detalhados do fluxo de caixa serão exibidos aqui
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="investments">
                <Card className="py-10 text-center">
                  <CardContent>
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Relatório de Investimentos</h2>
                    <p className="text-muted-foreground mb-6">
                      Os dados detalhados dos investimentos serão exibidos aqui
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="retirement">
                <Card className="py-10 text-center">
                  <CardContent>
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Relatório de Aposentadoria</h2>
                    <p className="text-muted-foreground mb-6">
                      Os dados detalhados da aposentadoria serão exibidos aqui
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Reports;