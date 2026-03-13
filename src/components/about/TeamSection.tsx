
import { User, Github, Code, Leaf, Award, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const teamMembers = [
  {
    name: 'Gustavo Alves',
    role: 'Diretor',
    description: 'Aluno do SENAI, 17 anos, dev aprendiz, apoiador da ecologia, profissional em cloud, interessado em Ecologia.',
    skills: ['Cloud', 'AWS', 'Firebase', 'TypeScript', 'JSX', 'SCSS', 'Kotlin', 'Vite', 'Tailwind CSS', 'Node.js'],
    achievement: 'Participou da olimpíada de cloud do SPSkills modalidade 53, pegando a 10º posição do estadual',
    journey: [
      '2023 - Início do curso Análise e Desenvolvimento de Sistemas do SENAI',
      '2023 - Entrada na olimpíada de cloud do SPSkills modalidade 53',
      '2023 - Workshops até a competição em novembro, 10º posição estadual',
      '2024 - Continuidade na olimpíada',
      '2024 - Iniciou o projeto EcoCity'
    ]
  },
  {
    name: 'Gabriel Gedolin',
    role: 'Coordenador',
    description: 'Desenvolvedor aprendiz, 17 anos, coordenador do projeto EcoCity e apoiador da Ecologia.',
    skills: ['JavaScript', 'Tailwind', 'Design', 'Coordenação'],
    journey: [
      '2024 - Ingresso no projeto EcoCity como coordenador',
      '2024 - Desenvolvimento de habilidades em coordenação de projetos'
    ]
  }
];

export const TeamSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-eco-green-dark mb-4 text-center">
        Nossa Equipe
      </h2>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Jovens desenvolvedores comprometidos com a ecologia e a tecnologia, 
        trabalhando para criar um futuro sustentável para Presidente Prudente.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {teamMembers.map((member) => (
          <Card key={member.name} className="overflow-hidden border-2 border-eco-green-light/30 shadow-lg">
            <CardHeader className="bg-eco-green-light/20 pb-4">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-eco-green-light/40 flex items-center justify-center">
                  <User size={50} className="text-eco-green-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <p className="text-eco-green-dark font-medium">{member.role}</p>
                  {member.achievement && (
                    <div className="flex items-center gap-1 mt-2">
                      <Award size={16} className="text-amber-500" />
                      <p className="text-sm text-amber-600 font-medium">10º Posição SPSkills</p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-base mb-4">{member.description}</p>
              
              {member.achievement && (
                <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">{member.achievement}</p>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Code size={16} className="text-eco-green-dark" />
                  Tecnologias
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="bg-eco-green-light/10 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-eco-green-dark" />
                  Jornada
                </h4>
                <div className="space-y-2">
                  {member.journey.map((step, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-eco-green-light mt-2 shrink-0"></div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-eco-green-light/10 p-6 rounded-lg border border-eco-green-light/20">
        <div className="flex items-start gap-4">
          <Leaf size={40} className="text-eco-green-dark mt-1" />
          <div>
            <h3 className="text-xl font-bold text-eco-green-dark mb-2">Sobre o Projeto EcoCity</h3>
            <p className="text-base mb-3">
              EcoCity é um projeto ecológico que oferece um website sustentável com marcação de pontos de coleta 
              de lixo eletrônico, reciclável, distribuição de mudas, venda de mudas e coleta de lâmpadas. 
              O projeto oferece uma aba de eventos onde se acompanha os eventos ecológicos locais.
            </p>
            <p className="text-base">
              Além disso, possui formas dos usuários solicitarem um ponto no mapa ou um evento faltante, 
              promovendo a participação ativa da comunidade na preservação ambiental de Presidente Prudente, São Paulo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
