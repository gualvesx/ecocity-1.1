
import React, { createContext, useContext, useState } from 'react';

// Define the types for our translations
type TranslationKey = string;
type Translation = string;
type TranslationDictionary = Record<TranslationKey, Translation>;

// Define the structure of our language context
interface LanguageContextType {
  t: (key: TranslationKey) => string;
  language: string; // Add the language property
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define and provide the translations for Portuguese (default language)
const translations: TranslationDictionary = {
  // Navbar
  'home': 'Início',
  'about': 'Sobre Nós',
  'blog': 'Blog',
  'ecological-map': 'Mapa Ecológico',
  'login': 'Entrar',
  'register': 'Cadastre-se',
  'admin-panel': 'Painel Admin',
  'logout': 'Sair',
  'mobile-menu': 'Menu',
  
  // Hero
  'hero-title': 'Promovendo a Sustentabilidade em Presidente Prudente',
  'hero-subtitle': 'Conheça iniciativas ecológicas e contribua para um futuro mais verde',
  'learn-more': 'Saiba Mais',
  'get-involved': 'Participe',
  
  // Stats section
  'stats-title': 'Impacto Ambiental em Números',
  'stats-subtitle': 'Acompanhe métricas importantes sobre nosso ecossistema local',
  'hectares-monitored': 'Hectares Monitorados',
  'risk-areas': 'Áreas de Risco Identificadas',
  'deforestation-alerts': 'Alertas de Desmatamento',
  'air-quality': 'Índice de Qualidade do Ar',
  'last-updated': 'Última atualização',
  'data-source': 'Fonte dos dados',
  
  // Chart legends
  'deforested-area': 'Área Desmatada',
  'reforested-area': 'Área Reflorestada',
  'air-quality-index': 'Índice de Qualidade do Ar',
  'error-loading-data': 'Erro ao carregar dados',
  
  // Month names
  'jan': 'Jan',
  'feb': 'Fev',
  'mar': 'Mar',
  'apr': 'Abr',
  'may': 'Mai',
  'jun': 'Jun',
  'jul': 'Jul',
  'aug': 'Ago',
  'sep': 'Set',
  'oct': 'Out',
  'nov': 'Nov',
  'dec': 'Dez',
  
  // Map
  'map-title': 'Mapa Ecológico',
  'map-subtitle': 'Explore iniciativas sustentáveis em Presidente Prudente',
  'map-filter-all': 'Todos',
  'map-filter-collection': 'Pontos de Coleta',
  'map-filter-recycling': 'Locais de Reciclagem',
  'map-filter-seedlings': 'Distribuição de Mudas',
  'search-places': 'Buscar locais...',
  'loading-map': 'Carregando mapa...',
  'points-found': 'pontos encontrados',
  
  // About page
  'about-title': 'Sobre a EcoCity',
  'about-subtitle': 'Construindo um futuro sustentável para Presidente Prudente',
  'about-mission-title': 'Nossa Missão',
  'about-mission-text': 'A EcoCity tem como missão promover práticas sustentáveis e conscientizar a população sobre a importância da preservação ambiental em Presidente Prudente. Trabalhamos para desenvolver uma comunidade ecologicamente responsável através de iniciativas educacionais, projetos de conservação e tecnologias verdes.',
  'about-vision-title': 'Nossa Visão',
  'about-vision-text': 'Vislumbramos uma Presidente Prudente onde o desenvolvimento urbano e a proteção ambiental caminhem juntos, criando um modelo de cidade sustentável que inspire outras comunidades. Buscamos um futuro onde cada cidadão seja um agente ativo na construção de uma cidade mais verde e saudável.',
  'about-history-title': 'Nossa História',
  'about-history-text': 'Fundada em 2019 por um grupo de ambientalistas e pesquisadores locais preocupados com o impacto das mudanças climáticas em nossa região, a EcoCity começou como um pequeno projeto voluntário. Hoje, nos tornamos uma organização respeitada, colaborando com governo, empresas e sociedade civil para implementar soluções sustentáveis.',
  'about-team-title': 'Nossa Equipe',
  
  // Team
  'team-director': 'Diretor Executivo',
  'team-coord': 'Coordenadora de Projetos',
  'team-tech': 'Especialista Técnico',
  'team-comm': 'Comunicação',
  'team-edu': 'Educação Ambiental',
  
  // Call to action
  'cta-title': 'Junte-se ao Movimento',
  'cta-text': 'Seja parte da transformação e ajude a construir uma cidade mais sustentável',
  'cta-button': 'Participe Agora',
  
  // Blog
  'blog-title': 'Blog Ecológico',
  'blog-subtitle': 'Artigos, dicas e notícias sobre sustentabilidade e meio ambiente',
  'read-more': 'Ler mais',
  'min-read': 'min de leitura',
  'blog-featured': 'Destaque',
  'blog-recent': 'Publicações Recentes',
  'blog-categories': 'Categorias',
  'blog-search': 'Buscar no blog...',
  
  // Footer
  'footer-about': 'Sobre a EcoCity',
  'footer-about-text': 'EcoCity é uma iniciativa dedicada a promover práticas sustentáveis e conscientizar a comunidade sobre questões ambientais em Presidente Prudente.',
  'footer-links': 'Links Rápidos',
  'footer-legal': 'Legal',
  'footer-privacy': 'Política de Privacidade',
  'footer-terms': 'Termos de Uso',
  'footer-contact': 'Contato',
  'footer-address': 'Rua das Palmeiras, 123 - Centro, Presidente Prudente - SP',
  'footer-email': 'Email',
  'footer-phone': 'Telefone',
  'footer-social': 'Redes Sociais',
  'footer-rights': 'Todos os direitos reservados',
  'footer-statement': 'Trabalhando por uma Presidente Prudente mais verde e sustentável',
  
  // Auth pages
  'email': 'Email',
  'password': 'Senha',
  'remember': 'Lembrar-me',
  'forgot': 'Esqueceu a senha?',
  'sign-in': 'Entrar',
  'sign-up': 'Cadastrar',
  'no-account': 'Não tem uma conta?',
  'already-account': 'Já tem uma conta?',
  'create-account': 'Criar conta',
  'name': 'Nome',
  'confirm-password': 'Confirmar senha',
  'agree-terms': 'Concordo com os Termos e Condições',
  
  // Map points
  'collection-point': 'Ponto de Coleta Reciclável',
  'recycling-location': 'Local de Reciclagem',
  'seedling-distribution': 'Distribuição de Mudas',
  
  // Admin panel
  'admin-title': 'Painel Administrativo',
  'admin-welcome': 'Bem-vindo ao Painel Administrativo',
  'admin-manage': 'Gerencie conteúdo, usuários e dados do sistema',
  'admin-stats': 'Estatísticas',
  'admin-content': 'Conteúdo',
  'admin-users': 'Usuários',
  'admin-settings': 'Configurações',
};

// Create a provider component
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language] = useState('pt-BR');
  
  const t = (key: TranslationKey): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, language }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
