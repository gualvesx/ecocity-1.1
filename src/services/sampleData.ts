
import { MapPoint } from '@/types/map';

export const samplePoints: MapPoint[] = [
  {
    id: 1,
    name: "Ecoponto Vila Furquim",
    type: "recycling-point",
    lat: -22.119511,
    lng: -51.392290,
    description: "Ponto de coleta de resíduos recicláveis e materiais volumosos.",
    impact: "Coleta aproximadamente 3 toneladas de materiais recicláveis por semana.",
    address: "Rua das Flores, 123 - Vila Furquim, Presidente Prudente - SP"
  },
  {
    id: 2,
    name: "Viveiro Municipal",
    type: "seedling-distribution",
    lat: -22.128580,
    lng: -51.388310,
    description: "Centro de distribuição de mudas nativas para plantio urbano e rural.",
    impact: "Distribui mais de 5.000 mudas por ano para projetos de reflorestamento e arborização urbana.",
    address: "Av. 14 de Setembro - Vila Marcondes, Presidente Prudente - SP"
  },
  {
    id: 3,
    name: "Centro de Reciclagem Cambuci",
    type: "recycling-center",
    lat: -22.134160,
    lng: -51.401930,
    description: "Centro de processamento e reciclagem de materiais diversos.",
    impact: "Processamento de 2 toneladas de materiais por semana.",
    address: "Rua Cambuci, 456 - Jardim Paulista, Presidente Prudente - SP"
  }
];
