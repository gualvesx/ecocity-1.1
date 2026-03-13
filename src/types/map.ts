
export interface MapPoint {
  id: number | string;
  firebaseId?: string; // Firebase document ID
  name: string;
  type: string | string[]; // Allow single type or array of types
  lat: number;
  lng: number;
  description: string;
  impact: string;
  address: string;
  // Novos campos para horários de funcionamento e contato
  openingHours?: string;
  contact?: string;
  website?: string;
  // Horários semanais detalhados
  weeklyHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };
}
