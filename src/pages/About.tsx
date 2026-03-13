
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Leaf, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao início</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">Sobre o EcoCity</h1>
          <p className="text-lg text-muted-foreground">
            Conectando comunidades para um futuro mais sustentável
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-eco-green/10 to-eco-blue/10 rounded-xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-eco-green-dark mb-4">
                Nossa Missão
              </h2>
              <p className="text-muted-foreground mb-6">
                O EcoCity é uma plataforma inovadora que conecta cidadãos, empresas e organizações 
                em torno de iniciativas sustentáveis. Nosso objetivo é facilitar o acesso a 
                informações sobre pontos ecológicos, eventos ambientais e oportunidades de 
                participação em ações que beneficiam o meio ambiente.
              </p>
              <div className="flex items-center gap-2 text-eco-green font-medium">
                <Leaf className="h-5 w-5" />
                <span>Juntos por um planeta mais verde!</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-full p-8 shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-eco-green to-eco-blue rounded-full flex items-center justify-center">
                  <Leaf className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-eco-green" />
                Mapa Ecológico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Descubra pontos de coleta, reciclagem e distribuição de mudas em Presidente Prudente. 
                Nosso mapa interativo facilita a localização de iniciativas sustentáveis na sua região.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-eco-blue" />
                Eventos Ambientais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Participe de eventos, workshops e atividades focadas em sustentabilidade. 
                Conecte-se com outros cidadãos engajados e aprenda novas práticas ecológicas.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-eco-brown" />
                Comunidade Ativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Faça parte de uma comunidade comprometida com o meio ambiente. 
                Compartilhe experiências, dicas e contribua para o crescimento da consciência ecológica.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-eco-green-dark mb-6 text-center">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-eco-green/10 rounded-full flex items-center justify-center shrink-0">
                <Leaf className="h-6 w-6 text-eco-green" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Sustentabilidade</h3>
                <p className="text-muted-foreground">
                  Promovemos práticas que preservam o meio ambiente para as futuras gerações.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-eco-blue/10 rounded-full flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-eco-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Colaboração</h3>
                <p className="text-muted-foreground">
                  Acreditamos no poder da comunidade trabalhando juntas por um objetivo comum.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-eco-brown/10 rounded-full flex items-center justify-center shrink-0">
                <Target className="h-6 w-6 text-eco-brown" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Transparência</h3>
                <p className="text-muted-foreground">
                  Mantemos informações claras e acessíveis sobre todas as nossas iniciativas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Impacto Positivo</h3>
                <p className="text-muted-foreground">
                  Buscamos gerar mudanças reais e mensuráveis na qualidade ambiental da nossa cidade.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-eco-green to-eco-blue rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Faça Parte da Mudança
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Junte-se a nós e ajude a construir uma Presidente Prudente mais sustentável. 
            Cadastre-se para descobrir pontos ecológicos, participar de eventos e conectar-se 
            com outros cidadãos engajados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-white text-eco-green hover:bg-gray-100">
                Criar Conta
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Explorar Mapa
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
