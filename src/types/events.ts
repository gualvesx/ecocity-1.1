
export enum EventStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface EventLocation {
  address: string;
  lat?: number;
  lng?: number;
}

export interface EventTime {
  date: string;
  time: string;
  endTime?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  times: EventTime[]; // Array de horários
  locations: EventLocation[]; // Array de localizações
  organizer: string;
  contact?: string;
  website?: string;
  createdBy: string;
  createdAt: string;
  // Campos legados para compatibilidade
  date?: string;
  time?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface EventRequest {
  id: string;
  title: string;
  description: string;
  times: EventTime[];
  locations: EventLocation[];
  organizer: string;
  contact?: string;
  website?: string;
  createdBy: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CreateEventRequestData {
  title: string;
  description: string;
  times: EventTime[];
  locations: EventLocation[];
  organizer: string;
  contact?: string;
  website?: string;
}
