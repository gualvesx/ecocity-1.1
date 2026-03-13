
import { MapPoint } from '@/types/map';
import { geocodeAddress } from '@/services/geocoding';
import { useAddressCorrection } from '@/hooks/useAddressCorrection';

export interface CSVPointData {
  name: string;
  type: string;
  description: string;
  address: string;
  impact?: string;
  openingHours?: string;
  contact?: string;
  website?: string;
  weeklyHours?: any;
}

export interface CSVImportResult {
  success: boolean;
  processedPoints: CSVPointData[];
  errors: string[];
  totalRows: number;
  validRows: number;
}

export class CSVImportAPI {
  private static instance: CSVImportAPI;

  static getInstance(): CSVImportAPI {
    if (!CSVImportAPI.instance) {
      CSVImportAPI.instance = new CSVImportAPI();
    }
    return CSVImportAPI.instance;
  }

  async parseCSVFile(file: File): Promise<CSVImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const result = this.processCSVContent(csv);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            processedPoints: [],
            errors: [`Erro ao processar arquivo: ${error}`],
            totalRows: 0,
            validRows: 0
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          processedPoints: [],
          errors: ['Erro ao ler o arquivo CSV'],
          totalRows: 0,
          validRows: 0
        });
      };

      reader.readAsText(file, 'utf-8');
    });
  }

  private processCSVContent(csvContent: string): CSVImportResult {
    const errors: string[] = [];
    const processedPoints: CSVPointData[] = [];

    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        return {
          success: false,
          processedPoints: [],
          errors: ['O arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados'],
          totalRows: lines.length,
          validRows: 0
        };
      }

      const headers = this.parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
      const headerMapping = this.getHeaderMapping();

      // Verificar campos obrigatórios
      const requiredFields = ['name', 'type', 'description', 'address'];
      const missingRequired = requiredFields.filter(field => 
        !headers.some(h => headerMapping[h] === field)
      );

      if (missingRequired.length > 0) {
        return {
          success: false,
          processedPoints: [],
          errors: [`Campos obrigatórios faltando no CSV: ${missingRequired.join(', ')}`],
          totalRows: lines.length,
          validRows: 0
        };
      }

      // Processar dados
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = this.parseCSVLine(lines[i]);
          const point = this.mapRowToPoint(headers, values, headerMapping);
          
          if (this.validatePoint(point)) {
            processedPoints.push(point);
          } else {
            errors.push(`Linha ${i + 1}: Dados incompletos ou inválidos`);
          }
        } catch (error) {
          errors.push(`Linha ${i + 1}: Erro ao processar - ${error}`);
        }
      }

      return {
        success: processedPoints.length > 0,
        processedPoints,
        errors,
        totalRows: lines.length - 1, // Excluir cabeçalho
        validRows: processedPoints.length
      };

    } catch (error) {
      return {
        success: false,
        processedPoints: [],
        errors: [`Erro geral ao processar CSV: ${error}`],
        totalRows: 0,
        validRows: 0
      };
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private getHeaderMapping(): Record<string, string> {
    return {
      'nome': 'name',
      'name': 'name',
      'tipo': 'type', 
      'type': 'type',
      'descrição': 'description',
      'descricao': 'description',
      'description': 'description',
      'endereço': 'address',
      'endereco': 'address',
      'address': 'address',
      'impacto': 'impact',
      'impact': 'impact',
      'horario': 'openingHours',
      'horário': 'openingHours',
      'openinghours': 'openingHours',
      'contato': 'contact',
      'contact': 'contact',
      'website': 'website',
      'site': 'website'
    };
  }

  private mapRowToPoint(headers: string[], values: string[], headerMapping: Record<string, string>): CSVPointData {
    const point: CSVPointData = {
      name: '',
      type: '',
      description: '',
      address: '',
      impact: '',
      openingHours: '',
      contact: '',
      website: '',
      weeklyHours: {}
    };

    headers.forEach((header, index) => {
      const mappedField = headerMapping[header];
      if (mappedField && values[index]) {
        (point as any)[mappedField] = values[index].trim();
      }
    });

    return point;
  }

  private validatePoint(point: CSVPointData): boolean {
    return !!(point.name && point.type && point.description && point.address);
  }

  async processPointsForImport(points: CSVPointData[]): Promise<{
    successCount: number;
    errorCount: number;
    errors: string[];
  }> {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const point of points) {
      try {
        // Aqui você pode adicionar lógica adicional de processamento
        // como correção de endereço e geocodificação se necessário
        console.log(`Processando ponto: ${point.name}`);
        successCount++;
      } catch (error) {
        console.error(`Erro ao processar ponto ${point.name}:`, error);
        errors.push(`Erro ao processar ${point.name}: ${error}`);
        errorCount++;
      }
    }

    return { successCount, errorCount, errors };
  }
}

export const csvImportAPI = CSVImportAPI.getInstance();
