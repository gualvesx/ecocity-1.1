
declare module 'leaflet' {
  export interface Map {
    remove(): void;
    setView(center: [number, number], zoom: number): this;
    on(eventName: string, handler: Function): this;
    eachLayer(callback: (layer: any) => void): this;
    addControl(control: any): this;
    removeLayer(layer: any): this;
  }

  export function map(element: string | HTMLElement, options?: any): Map;
  export function tileLayer(url: string, options?: any): any;
  export function marker(latlng: [number, number], options?: any): any;
  export function divIcon(options: any): any;
  export interface MarkerOptions {
    icon?: any;
    [key: string]: any;
  }
  export interface LatLng {
    lat: number;
    lng: number;
  }
}

declare global {
  interface Window {
    L: {
      map(element: string | HTMLElement, options?: any): any;
      tileLayer(url: string, options?: any): any;
      marker(latlng: [number, number], options?: any): any;
      divIcon(options: any): any;
      NavigationControl?: any;
      [key: string]: any;
    };
  }
}

export {};
