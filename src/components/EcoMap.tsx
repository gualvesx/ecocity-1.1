import { useEffect, useRef, useState } from 'react';
import { MapPin, Recycle, TreeDeciduous, Calendar, Leaf, Lamp, Maximize, Minimize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useMapPoints } from '@/hooks/useMapPoints';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPoint } from '@/types/map';
import { MapControls } from './map/MapControls';
import { MapLegend } from './map/MapLegend';
import { AddPointForm } from './map/AddPointForm';
import { PointDetails } from './map/PointDetails';
import { EditMapPointForm } from './map/EditMapPointForm';
import { useEventStore, Event } from '@/hooks/useEventStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

interface EcoMapProps {
  hideControls?: boolean;
  eventMode?: boolean;
  searchQuery?: string;
  fullScreen?: boolean;
  nonInteractive?: boolean;
  previewMode?: boolean;
}

// Presidente Prudente coordinates and expanded bounds - área muito maior
const PRESIDENTE_PRUDENTE_CENTER = [-22.125092, -51.389639];
const PRESIDENTE_PRUDENTE_BOUNDS = [
  [-22.500000, -51.900000], // Southwest coordinates (área muito expandida)
  [-21.750000, -50.880000]  // Northeast coordinates (área muito expandida)
];

const EcoMap = ({ hideControls = false, eventMode = false, searchQuery = '', fullScreen = false, nonInteractive = false, previewMode = false }: EcoMapProps) => {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingPoint, setEditingPoint] = useState<MapPoint | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [newPointPosition, setNewPointPosition] = useState<{lat: number, lng: number} | null>(null);
  const [newPointForm, setNewPointForm] = useState({
    name: '',
    type: 'recycling-point' as const,
    description: '',
    impact: '',
    address: ''
  });
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isLocalFullscreen, setIsLocalFullscreen] = useState(false);
  
  const { mapPoints, addMapPoint, deleteMapPoint, updateMapPoint } = useMapPoints();
  const { events } = useEventStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Use the search query from props if provided (for event mode)
  const effectiveSearchQuery = searchQuery || localSearchQuery;

  // Helper function to get point types as array
  const getPointTypes = (point: MapPoint): string[] => {
    return Array.isArray(point.type) ? point.type : [point.type];
  };

  // Helper function to get primary type for display
  const getPrimaryType = (point: MapPoint): string => {
    const types = getPointTypes(point);
    return types[0] || 'recycling-point';
  };
  
  useEffect(() => {
    if (!mapRef.current || isMapInitialized) return;
    
    const initializeMap = () => {
      if (typeof window !== 'undefined' && window.L) {
        if (mapRef.current && mapRef.current.clientHeight === 0) {
          mapRef.current.style.height = fullScreen ? '100vh' : previewMode ? '100%' : '500px';
        }
        
        try {
          const L = window.L;
          // Garantir que cada instância de mapa tenha um ID único
          if (!mapRef.current.id) {
            mapRef.current.id = `map-${Math.random().toString(36).substr(2, 9)}`;
          }
          
          // Configurar interatividade: no preview mode, só será não-interativo no mobile
          const isInteractive = previewMode ? !isMobile : !nonInteractive;
          
          const mapOptions: any = {
            center: PRESIDENTE_PRUDENTE_CENTER,
            zoom: previewMode ? (isMobile ? 11 : 12) : (fullScreen ? 13 : 12),
            scrollWheelZoom: isInteractive,
            dragging: isInteractive,
            touchZoom: isInteractive,
            doubleClickZoom: isInteractive,
            boxZoom: isInteractive,
            keyboard: isInteractive,
            zoomControl: isInteractive,
            attributionControl: false
          };
          
          const newMap = L.map(mapRef.current.id, mapOptions);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(newMap);
          
          // Set expanded bounds to cover larger area
          const bounds = L.latLngBounds(
            PRESIDENTE_PRUDENTE_BOUNDS[0],
            PRESIDENTE_PRUDENTE_BOUNDS[1]
          );
          newMap.setMaxBounds(bounds);
          newMap.options.minZoom = 7; // Reduzido para permitir mais zoom out
          
          setMap(newMap);
          setIsMapInitialized(true);
          
          // Força o mapa a recalcular seu tamanho após ser exibido
          setTimeout(() => {
            newMap.invalidateSize();
          }, 300);
          
          // No modo preview, adicionar timeout extra para garantir que carregue
          if (previewMode) {
            setTimeout(() => {
              newMap.invalidateSize();
              newMap.setView(PRESIDENTE_PRUDENTE_CENTER, isMobile ? 11 : 12);
            }, 500);
          }
        } catch (err) {
          console.error("Error initializing map:", err);
        }
      } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };
    
    initializeMap();
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapRef, isMapInitialized, nonInteractive, fullScreen, previewMode, isMobile]);

  // Toggle fullscreen mode with a fixed timeout to ensure the map resizes properly
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;

    setIsLocalFullscreen(!isLocalFullscreen);
    
    if (map) {
      // Give the map a longer moment to adjust to the new size
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }
  };

  // Efeito para garantir que o mapa carregue corretamente em modo de tela cheia
  useEffect(() => {
    if (map && (fullScreen || isLocalFullscreen)) {
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }
  }, [map, fullScreen, isLocalFullscreen]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLocalFullscreen) {
        setIsLocalFullscreen(false);
        
        if (map) {
          setTimeout(() => {
            map.invalidateSize();
          }, 300);
        }
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isLocalFullscreen, map]);

  // Filter map points based on type and search query
  const getFilteredPoints = () => {
    if (eventMode) {
      return [];  // Don't show eco points in event mode
    }
    
    return mapPoints.filter(point => {
      const pointTypes = getPointTypes(point);
      const matchesFilter = filter === 'all' || pointTypes.includes(filter);
      const matchesSearch = 
        point.name.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
        point.description.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
        (point.address && point.address.toLowerCase().includes(effectiveSearchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  };
  
  // Filter events based on search query
  const getFilteredEvents = () => {
    if (!eventMode) {
      return [];  // Don't show events in eco point mode
    }
    
    return events.filter(event => {
      const searchLower = effectiveSearchQuery.toLowerCase();
      
      // Buscar no título, descrição e organizador
      const matchesBasic = 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.organizer.toLowerCase().includes(searchLower);
      
      // Buscar nos endereços (novo formato)
      const matchesLocations = event.locations && event.locations.some(location =>
        location.address.toLowerCase().includes(searchLower)
      );
      
      // Buscar no endereço legado
      const matchesLegacyAddress = event.address && 
        event.address.toLowerCase().includes(searchLower);
      
      return matchesBasic || matchesLocations || matchesLegacyAddress;
    });
  };

  // Add markers to map when map and points are ready
  useEffect(() => {
    if (!map || !isMapInitialized) return;

    const L = window.L;
    if (!L) return;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add filtered points as markers (only in eco mode)
    if (!eventMode) {
      const filteredPoints = getFilteredPoints();
      
      filteredPoints.forEach((point) => {
        const primaryType = getPrimaryType(point);
        
        const marker = L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            html: getMarkerIconHtml(primaryType, point),
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
            className: 'custom-marker'
          })
        });

        marker.on('click', () => {
          setSelectedPoint(point);
          setSelectedEvent(null);
        });

        marker.addTo(map);
      });
    }

    // Add filtered events as markers (only in event mode)
    if (eventMode) {
      const filteredEvents = getFilteredEvents();
      
      filteredEvents.forEach((event) => {
        // Use first location available
        const firstLocation = event.locations && event.locations.length > 0 ? event.locations[0] : 
          (event.address && event.lat && event.lng ? { address: event.address, lat: event.lat, lng: event.lng } : null);
        
        if (firstLocation && firstLocation.lat && firstLocation.lng) {
          const marker = L.marker([firstLocation.lat, firstLocation.lng], {
            icon: L.divIcon({
              html: getEventMarkerIconHtml(),
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
              className: 'custom-marker'
            })
          });

          marker.on('click', () => {
            setSelectedEvent(event);
            setSelectedPoint(null);
          });

          marker.addTo(map);
        }
      });
    }
  }, [map, isMapInitialized, mapPoints, events, filter, effectiveSearchQuery, eventMode]);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return <MapPin className="h-4 w-4" />;
      case 'recycling-center':
        return <Recycle className="h-4 w-4" />;
      case 'seedling-distribution':
        return <TreeDeciduous className="h-4 w-4" />;
      case 'plant-sales':
        return <Leaf className="h-4 w-4" />;
      case 'lamp-collection':
        return <Lamp className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getMarkerIconHtml = (type: string, point?: MapPoint) => {
    let bgColor, iconSvg;
    
    // Check if point has multiple types
    const hasMultipleTypes = point && getPointTypes(point).length > 1;
    
    switch (type) {
      case 'recycling-point':
        bgColor = 'bg-eco-green';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        break;
      case 'recycling-center':
        bgColor = 'bg-eco-blue';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 22 1-5"></path><path d="m12 22 2-9"></path><path d="m16 22 3-13"></path><path d="M3.52 9.5a2 2 0 0 1 .28-2.29L7.5 3.5"></path><path d="M14 2.5a8.1 8.1 0 0 1 4.5 1.5"></path><path d="M19 5.48a2 2 0 0 1 .28 2.28L16.5 11"></path><path d="M8.52 2.2A2 2 0 0 1 10.8 3l2.76 4.83"></path><path d="M12.82 13.5a2 2 0 0 1-2.28.28L7.5 11"></path><path d="M14.5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path><path d="M5 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path><path d="M10 15a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path></svg>`;
        break;
      case 'seedling-distribution':
        bgColor = 'bg-eco-brown';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9c1.2-1.7 3-3 5-3 3.3 0 6 2.7 6 6s-2.7 6-6 6h-5"/><path d="M13 22v-2.5"/><path d="M10 22v-4c0-1.7 1.3-3 3-3v0"/><path d="M9 6h.01"/><path d="M6 6h.01"/><path d="M12 3h.01"/><path d="M7 3h.01"/><path d="M4 10h.01"/><path d="M4 15h.01"/><path d="M7 16h.01"/></svg>`;
        break;
      case 'plant-sales':
        bgColor = 'bg-green-600';
        iconSvg = `<svg fill="#ffffff" width="16" height="16" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M49.6646,17.0664c-3.4189-4.0586-7.1426-7.1807-11.0684-9.2803-1.9385-1.0371-4.2539-1.0371-6.1924,0-3.9258,2.0996-7.6494,5.2217-11.0684,9.2803-.8613,1.0215-1.3354,2.2988-1.3354,3.5967v3.8728c-5.0158,3.2211-7,5.7917-7,8.9641,0,1.0986,.3906,2.0322,1.1616,2.7734,1.1738,1.1299,3.1899,1.7383,5.7217,1.7383,.0383,0,.0782-.0019,.1167-.0021v15.4904c0,1.9297,1.5703,3.5,3.5,3.5h24c1.9297,0,3.5-1.5703,3.5-3.5V20.6631c0-1.2979-.4741-2.5752-1.3354-3.5967Zm.3354,36.4336c0,1.3789-1.1216,2.5-2.5,2.5H23.5c-1.3784,0-2.5-1.1211-2.5-2.5V27.5c0-.2764-.2236-.5-.5-.5s-.5,.2236-.5,.5v9.5047c-2.2941,.019-4.1569-.5007-5.1455-1.452-.5669-.5449-.8545-1.2363-.8545-2.0527,0-2.4932,1.2939-4.9424,7.6079-8.791,3.4889-2.1265,7.9416-4.1605,10.8954-5.4288,.6112,1.0247,1.7195,1.7198,2.9966,1.7198,1.9297,0,3.5-1.5703,3.5-3.5s-1.5703-3.5-3.5-3.5-3.5,1.5703-3.5,3.5c0,.2974,.0486,.5815,.1188,.8575-2.9844,1.2814-7.4918,3.3405-11.0314,5.498-.0303,.0184-.0573,.0361-.0874,.0546v-3.2469c0-1.0615,.3906-2.1104,1.1001-2.9521,3.3369-3.9609,6.9619-7.0039,10.7754-9.0439,1.6436-.8789,3.6055-.877,5.249,0,3.8135,2.04,7.4385,5.083,10.7754,9.0439,.7095,.8418,1.1001,1.8906,1.1001,2.9521V53.5Zm-14.0342-36.1807c-.1001-.2578-.3906-.3857-.647-.2852-.0269,.0103-.9065,.3541-2.272,.9285-.0283-.1503-.0468-.3043-.0468-.4627,0-1.3789,1.1216-2.5,2.5-2.5s2.5,1.1211,2.5,2.5-1.1216,2.5-2.5,2.5c-.8648,0-1.6277-.4418-2.0768-1.1111,1.3564-.5706,2.2314-.9128,2.258-.9231,.2573-.0996,.3848-.3896,.2847-.6465Zm1.4136,20.1133c-1.6899-1.1211-2.6001-1.8418-2.7017-2.1221-.0576-.3984,.0552-.8281,.2886-1.0957,.1519-.1738,.3345-.2568,.606-.2764,.6406-.0449,1.0142,.3994,1.0718,.4727,.811,1.126,2.4062,1.4414,3.6313,.7119,1.2065-.7148,1.5566-2.1621,.832-3.4395-.59-1.0423-2.3868-2.5515-4.9327-2.7262-.0421-.1951-.0817-.3688-.0916-.4565-.1098-.6733-1.1389-.6613-1.2446,0l-.0983,.5021c-1.5426,.2081-2.9147,.9194-3.8951,2.0409-1.1826,1.3516-1.7095,3.1553-1.4458,4.9492,.3687,2.5156,2.7764,4.1123,4.9009,5.5215,.8628,.5732,2.1675,1.4395,2.4487,1.9004,.395,.6465,.4546,1.2744,.1675,1.7686-.2754,.4756-.8232,.7754-1.5093,.8232-.7944,.0732-1.7158-.9561-1.9595-1.3281-.7393-1.168-2.3633-1.5684-3.6226-.8887-1.1646,.6289-1.5664,1.9814-1.001,3.3652,.7092,1.7318,3.1871,3.5555,5.9087,3.8038l.1057,.5399c.1057,.6613,1.1348,.6733,1.2446,0,.0115-.1022,.0632-.3217,.1123-.5553,2.3199-.2736,4.3227-1.5061,5.4032-3.3695,1.1855-2.0439,1.104-4.4658-.2236-6.6426-.8662-1.4219-2.457-2.4775-3.9956-3.499Zm3.354,9.6396c-.9746,1.6816-2.8433,2.7744-4.9985,2.9229-2.9336,.1992-5.4185-1.8359-5.9849-3.2188-.293-.7158-.3022-1.6465,.5503-2.1064,.27-.1455,.5654-.2148,.8564-.2148,.5776,0,1.1387,.2725,1.4502,.7656,.3496,.5332,1.5396,1.8896,2.8755,1.7832,1.0166-.0703,1.8545-.5508,2.2988-1.3184,.4795-.8252,.416-1.8174-.1787-2.792-.3677-.6025-1.4165-1.3271-2.7495-2.2129-1.9502-1.293-4.1602-2.7588-4.4644-4.832-.2207-1.5049,.2197-3.0156,1.2095-4.1465,.8965-1.0264,2.1909-1.6484,3.6455-1.752,2.4858-.1836,4.4087,1.1924,4.9937,2.2266,.4517,.7959,.2573,1.6543-.4722,2.0869-.771,.457-1.8062,.2607-2.3208-.4512-.3555-.458-1.0605-.9258-1.9385-.8721-.5425,.0391-.9653,.2412-1.293,.6172-.4233,.4844-1.2109-.5244,1.8984,.1006,.6787,1.1807,1.5117,3.1382,2.8105,1.4473,.96,2.9438,1.9531,3.6948,3.1855,1.1309,1.8545,1.208,3.9033,.2119,5.6201Z"/></svg>`;
        break;
      case 'lamp-collection':
        bgColor = 'bg-yellow-500';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21h6"/><path d="M12 21v-4"/><path d="M12 3v1"/><path d="m15.3 7.3-4.3 2.5"/><path d="M9 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0"/><path d="M17 17a5 5 0 1 0-10 0"/></svg>`;
        break;
      case 'oil-collection':
        bgColor = 'bg-orange-500';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h20"/><path d="M2 14h20"/><path d="M5 6V2"/><path d="M19 6V2"/><path d="M5 14v8"/><path d="M19 14v8"/></svg>`;
        break;
      case 'medicine-collection':
        bgColor = 'bg-red-500';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5"/><path d="M5 12v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5"/><path d="M12 7v10"/><path d="M8 12h8"/></svg>`;
        break;
      case 'electronics-donation':
        bgColor = 'bg-purple-500';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="2" x2="16" y2="2"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
        break;
      default:
        bgColor = 'bg-eco-green';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    }
    
    const multiTypeIndicator = hasMultipleTypes ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-300 rounded-full flex items-center justify-center"><span class="text-xs font-bold text-gray-600">+</span></div>' : '';
    
    return `<div class="relative flex items-center justify-center w-8 h-8 ${bgColor} text-white rounded-full shadow-lg border-2 border-white">${iconSvg}${multiTypeIndicator}</div>`;
  };

  const getEventMarkerIconHtml = () => {
    return `<div class="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full shadow-lg border-2 border-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </div>`;
  };

  const typeInfo = {
    'recycling-point': { label: t('recycling-point'), color: 'bg-eco-green', description: t('recycling-description') },
    'recycling-center': { label: t('recycling-center'), color: 'bg-eco-blue', description: t('recycling-center-description') },
    'seedling-distribution': { label: t('seedling-distribution'), color: 'bg-eco-brown', description: t('seedling-description') },
    'plant-sales': { label: 'Venda de Mudas', color: 'bg-green-600', description: 'Pontos para compra de mudas e plantas.' },
    'lamp-collection': { label: 'Coleta de Lâmpadas', color: 'bg-yellow-500', description: 'Pontos de coleta para descarte correto de lâmpadas.' }
  };
  
  const toggleAddingPoint = () => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar pontos.");
      navigate("/login");
      return;
    }
    
    if (!user.isAdmin) {
      toast.error("Apenas administradores podem adicionar pontos diretamente.");
      return;
    }
    
    setIsAddingPoint(!isAddingPoint);
    if (!isAddingPoint) {
      toast.info("Preencha o endereço para adicionar um novo ponto ecológico");
    }
  };
  
  const handleAddNewPoint = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar pontos.");
      navigate("/login");
      return;
    }
    
    if (!user.isAdmin) {
      toast.error("Apenas administradores podem adicionar pontos diretamente.");
      return;
    }
    
    if (!newPointForm.name || !newPointForm.description) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    
    if (!newPointForm.address) {
      toast.error("Preencha o endereço!");
      return;
    }
    
    try {
      const newPoint = {
        name: newPointForm.name,
        type: newPointForm.type,
        description: newPointForm.description,
        impact: newPointForm.impact || "Impacto ambiental não especificado.",
        address: newPointForm.address
      };
      
      await addMapPoint(newPoint);
      
      setNewPointForm({
        name: '',
        type: 'recycling-point',
        description: '',
        impact: '',
        address: ''
      });
      setIsAddingPoint(false);
    } catch (err) {
      toast.error("Erro ao adicionar ponto: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleEditSuccess = () => {
    setEditingPoint(null);
    setSelectedPoint(null);
    toast.success('Ponto atualizado com sucesso!');
  };

  const handleDeletePoint = async (pointId: number | string) => {
    if (window.confirm('Tem certeza que deseja remover este ponto do mapa?')) {
      const success = await deleteMapPoint(String(pointId));
      if (success) {
        setSelectedPoint(null);
        setEditingPoint(null);
      }
    }
  };
  
  // Render event details when an event is selected
  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    // Usar primeiro horário disponível
    const firstTime = selectedEvent.times && selectedEvent.times.length > 0 ? selectedEvent.times[0] :
      (selectedEvent.date ? { date: selectedEvent.date, time: selectedEvent.time || '' } : null);
    
    // Usar primeira localização disponível  
    const firstLocation = selectedEvent.locations && selectedEvent.locations.length > 0 ? selectedEvent.locations[0] :
      (selectedEvent.address ? { address: selectedEvent.address, lat: selectedEvent.lat, lng: selectedEvent.lng } : null);
    
    if (!firstTime || !firstLocation) return null;
    
    let eventDate;
    try {
      eventDate = new Date(firstTime.date);
    } catch (error) {
      eventDate = new Date();
    }
    
    return (
      <div className="absolute bottom-4 right-4 w-full max-w-md bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-purple-300 z-20">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-purple-500">
              <Calendar className="text-white h-4 w-4" />
            </div>
            <h3 className="font-medium">{selectedEvent.title}</h3>
          </div>
          <button 
            onClick={() => setSelectedEvent(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mt-0.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>{format(eventDate, 'dd/MM/yyyy')} às {firstTime.time}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
            <span>{firstLocation.address}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mt-0.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>{selectedEvent.organizer}</span>
          </div>
          
          <p className="text-sm mt-2">{selectedEvent.description}</p>
          
          {/* Badges para múltiplos horários/localizações */}
          {((selectedEvent.times && selectedEvent.times.length > 1) || 
            (selectedEvent.locations && selectedEvent.locations.length > 1)) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedEvent.times && selectedEvent.times.length > 1 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  +{selectedEvent.times.length - 1} horário{selectedEvent.times.length > 2 ? 's' : ''}
                </span>
              )}
              {selectedEvent.locations && selectedEvent.locations.length > 1 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  +{selectedEvent.locations.length - 1} local{selectedEvent.locations.length > 2 ? 'is' : ''}
                </span>
              )}
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                if (firstLocation.lat && firstLocation.lng) {
                  map?.setView([firstLocation.lat, firstLocation.lng], 15);
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              Centralizar no mapa
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={mapContainerRef}
      className={cn(
        "relative bg-eco-sand/50 rounded-xl overflow-hidden shadow-lg",
        (isLocalFullscreen || fullScreen) ? "fixed inset-0 z-50 rounded-none" : "",
        previewMode ? "h-full w-full" : ""
      )}
    >
      {/* Map wrapper with shadow effect */}
      <div className="relative h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-eco-green/5 to-eco-blue/5 z-0 opacity-70"></div>
        <div 
          ref={mapRef} 
          className={cn(
            "w-full z-10 relative",
            (isLocalFullscreen || fullScreen) ? "h-screen" : previewMode ? "h-full" : "h-[70vh]"
          )}
          id="map-container"
        />
        
        {/* Inner shadow effect */}
        <div className="absolute inset-0 shadow-inner pointer-events-none rounded-xl"></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-eco-sand/10 opacity-40 pointer-events-none rounded-xl"></div>
      </div>
      
      {!hideControls && !eventMode && !previewMode && (
        <>
          <MapControls
            searchQuery={localSearchQuery}
            setSearchQuery={setLocalSearchQuery}
            filter={filter}
            setFilter={setFilter}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            isAddingPoint={isAddingPoint}
            toggleAddingPoint={toggleAddingPoint}
          />
          
          <MapLegend />
          
          {isAddingPoint && (
            <AddPointForm
              newPointForm={newPointForm}
              setNewPointForm={setNewPointForm}
              newPointPosition={newPointPosition}
              setNewPointPosition={setNewPointPosition}
              setIsAddingPoint={setIsAddingPoint}
              handleAddNewPoint={handleAddNewPoint}
            />
          )}
          
          {selectedPoint && !isAddingPoint && !editingPoint && (
            <PointDetails
              selectedPoint={selectedPoint}
              setSelectedPoint={setSelectedPoint}
              setEditingPoint={setEditingPoint}
              handleDeletePoint={handleDeletePoint}
              centerOnPoint={(lat, lng) => map?.setView([lat, lng], 15)}
              typeInfo={typeInfo}
              getMarkerIcon={getMarkerIcon}
            />
          )}

          {editingPoint && (
            <EditMapPointForm
              point={editingPoint}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingPoint(null)}
            />
          )}
        </>
      )}
      
      {eventMode && selectedEvent && !previewMode && renderEventDetails()}
      
      {eventMode && !previewMode && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-sm border border-gray-200 z-20">
          <h4 className="text-sm font-medium mb-2">Legenda</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm">Evento Ecológico</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoMap;
