
export interface MapPointRequest {
  id: string;
  userId: string;
  name: string;
  type: 'recycling-point' | 'recycling-center' | 'seedling-distribution' | 'plant-sales' | 'lamp-collection';
  address: string;
  description: string;
  impact: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  lat?: number;
  lng?: number;
}

export interface NewMapPointRequest {
  name: string;
  type: 'recycling-point' | 'recycling-center' | 'seedling-distribution' | 'plant-sales' | 'lamp-collection';
  address: string;
  description: string;
  impact: string;
}
