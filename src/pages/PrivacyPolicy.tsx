
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, Shield, BadgeInfo, FileText, Lock, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  const openCookieSettings = () => {
    if ((window as any).openCookieSettings) {
      (window as any).openCookieSettings();
    }
  };

  return (
    <div className="min-h-screen bg-eco-sand/30 pt-20 pb-16">
      <div className="container px-4 py-8">
        <Link to="/" className="inline-flex items-center text-eco-green hover:text-eco-green-dark mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para a página inicial
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-eco-green" />
          <h1 className="text-3xl font-bold text-eco-green-dark">Política de Privacidade</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="prose prose-green max-w-none">
            <div className="flex items-center gap-2 mb-4">
              <BadgeInfo className="h-5 w-5 text-eco-green" />
              <h2 className="text-xl font-semibold text-eco-green-dark m-0">Introdução</h2>
            </div>
            <p className="text-muted-foreground">
              A Terra Verde Conectada está empenhada em proteger sua privacidade. Esta Política de Privacidade explica como coletamos,
              usamos, divulgamos, transferimos e armazenamos seus dados. Nós respeitamos sua privacidade e nos comprometemos a proteger 
              seus dados pessoais de acordo com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
            </p>

            <Separator className="my-6" />

            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-eco-green" />
              <h2 className="text-xl font-semibold text-eco-green-dark m-0">Que dados coletamos</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Podemos coletar diferentes tipos de informações, incluindo:
            </p>

            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Dados de identificação pessoal:</strong> como nome, endereço de e-mail e perfil de mídia social associado se você se registrar em nossa plataforma.
              </li>
              <li>
                <strong>Dados de uso:</strong> informações sobre como você usa nosso site, quais páginas visita e por quanto tempo.
              </li>
              <li>
                <strong>Dados de localização:</strong> quando você acessa o mapa ecológico, coletamos dados de localização para mostrar pontos ecológicos próximos.
              </li>
              <li>
                <strong>Dados de dispositivo:</strong> informações técnicas sobre seu dispositivo, navegador e como você interage com nosso site.
              </li>
            </ul>

            <Separator className="my-6" />

            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-eco-green" />
              <h2 className="text-xl font-semibold text-eco-green-dark m-0">Cookies e tecnologias semelhantes</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Nosso site utiliza cookies e tecnologias semelhantes para aprimorar sua experiência. Os cookies são pequenos arquivos 
              armazenados em seu dispositivo que nos ajudam a fornecer funcionalidades essenciais e melhorar nosso serviço.
            </p>

            <h3 className="text-lg font-medium text-eco-green-dark mt-5 mb-3">Tipos de cookies que utilizamos:</h3>

            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Cookies necessários:</strong> essenciais para o funcionamento básico do site. Eles permitem recursos 
                fundamentais como autenticação, navegação e acesso a áreas seguras.
              </li>
              <li>
                <strong>Cookies de preferências:</strong> ajudam a lembrar suas configurações e preferências para melhorar sua experiência.
              </li>
              <li>
                <strong>Cookies analíticos:</strong> nos permitem analisar como os visitantes usam o site, quais páginas são mais 
                populares e identificar possíveis problemas para melhorar o serviço.
              </li>
              <li>
                <strong>Cookies de marketing:</strong> utilizados para rastrear visitantes em sites. A intenção é exibir anúncios 
                relevantes e envolventes para o usuário individual.
              </li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-xl font-semibold text-eco-green-dark mb-4">Como usamos seus dados</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos as informações coletadas principalmente para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornecer, operar e manter nosso site</li>
              <li>Melhorar, personalizar e expandir nosso site</li>
              <li>Entender e analisar como você usa nosso site</li>
              <li>Desenvolver novos produtos, serviços e funcionalidades</li>
              <li>Comunicar com você para fornecer atualizações e outras informações</li>
              <li>Prevenir fraudes</li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-xl font-semibold text-eco-green-dark mb-4">Base legal para processamento</h2>
            <p className="text-muted-foreground">
              Processamos seus dados pessoais apenas quando temos uma base legal para isso conforme a LGPD, que pode ser:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li><strong>Consentimento:</strong> você consentiu com o processamento para uma finalidade específica</li>
              <li><strong>Execução de contrato:</strong> o processamento é necessário para um contrato que você é parte</li>
              <li><strong>Obrigação legal:</strong> o processamento é necessário para cumprir uma obrigação legal</li>
              <li><strong>Interesses legítimos:</strong> o processamento é necessário para interesses legítimos nossos ou de terceiros</li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-xl font-semibold text-eco-green-dark mb-4">Seus direitos</h2>
            <p className="text-muted-foreground mb-4">
              De acordo com a LGPD, você tem os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Direito de acesso aos dados</li>
              <li>Direito de correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Direito de anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos</li>
              <li>Direito de portabilidade dos dados</li>
              <li>Direito de eliminação dos dados tratados com seu consentimento</li>
              <li>Direito de informação sobre entidades públicas e privadas com as quais seus dados são compartilhados</li>
              <li>Direito de revogação do consentimento</li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-xl font-semibold text-eco-green-dark mb-4">Como exercer seus direitos</h2>
            <p className="text-muted-foreground">
              Você pode exercer seus direitos enviando um e-mail para privacy@terraverdeconectada.com.br. 
              Responderemos a sua solicitação dentro de 15 dias.
            </p>

            <Separator className="my-6" />

            <h2 className="text-xl font-semibold text-eco-green-dark mb-4">Alterações na política de privacidade</h2>
            <p className="text-muted-foreground">
              Reservamos o direito de modificar esta política de privacidade a qualquer momento. Alterações e esclarecimentos terão 
              efeito imediatamente após sua publicação no site. Recomendamos que você revise esta política periodicamente para se 
              manter informado sobre como estamos protegendo suas informações.
            </p>

            <div className="mt-8 p-4 bg-eco-green/10 rounded-lg border border-eco-green/20">
              <p className="text-center text-sm font-medium">
                Última atualização desta política: 31 de maio de 2025
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="mx-auto"
            onClick={openCookieSettings}
          >
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar configurações de cookies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
