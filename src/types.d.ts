
// Type declarations for modules without types
declare module 'react/jsx-runtime';

// Add React namespace for components that need it
declare namespace React {
  interface ReactNode {}
  interface CSSProperties {}
  interface ElementRef<T> {}
  interface ComponentPropsWithoutRef<T> {}
  interface HTMLAttributes<T> {
    className?: string;
  }
  interface ButtonHTMLAttributes<T> {
    className?: string;
  }
  interface FC<P = {}> {
    (props: P): React.ReactElement | null;
  }
  interface ReactElement {}
  interface ComponentProps<T> {}
}

// Fix the DataCardProps type
interface DataCardProps {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  className?: string;
  style?: React.CSSProperties;
}

// Types for modules
declare module 'react';
declare module 'react-dom';
declare module 'react-router-dom';
declare module 'sonner';
declare module '@tanstack/react-query';
declare module 'lucide-react';
declare module 'date-fns';
declare module 'date-fns/locale';
declare module '@radix-ui/react-accordion';
declare module '@radix-ui/react-alert-dialog';
declare module 'class-variance-authority';
declare module '@radix-ui/react-aspect-ratio';
declare module '@radix-ui/react-avatar';
declare module 'react-hook-form';
declare module '@radix-ui/react-slot';
declare module 'react-day-picker';
declare module '@radix-ui/react-checkbox';
declare module 'recharts';
declare module '@radix-ui/react-popover';
declare module '@radix-ui/react-progress';
declare module '@radix-ui/react-radio-group';
declare module '@radix-ui/react-scroll-area';
declare module '@radix-ui/react-separator';
declare module 'react-resizable-panels';
declare module '@/lib/utils';

// For Dispatch and SetStateAction
declare type Dispatch<A> = (value: A) => void;
declare type SetStateAction<S> = S | ((prevState: S) => S);

// Type for VariantProps
declare type VariantProps<T> = any;

// Badge component type
interface BadgeProps {
  variant?: string;
  className?: string;
}

// Map types
interface MapPoint {
  id: number;
  name: string;
  type: 'recycling-point' | 'recycling-center' | 'seedling-distribution';
  lat: number;
  lng: number;
  description: string;
  impact: string;
  address?: string;
}

// Event types
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  location?: string;
  lat: number;
  lng: number;
  organizer: string;
  status: string;
  createdBy?: string;
  createdAt: string;
}
