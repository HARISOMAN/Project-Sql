export interface SalesRecord {
  id: string;
  invoiceNo: string;
  stockCode: string;
  description: string;
  quantity: number;
  invoiceDate: Date;
  unitPrice: number;
  customerId: string;
  country: string;
  region: string;
  totalAmount: number;
}

export interface KPIMetric {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  change?: number;
}

export interface Customer {
  id: string;
  country: string;
  totalSpent: number;
  ordersCount: number;
  avgOrderValue: number;
  lastOrderDate: Date;
}

export interface Product {
  stockCode: string;
  description: string;
  totalSold: number;
  revenue: number;
  avgPrice: number;
  country: string;
}

export interface FilterOptions {
  countries: string[];
  regions: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface DashboardFilters {
  selectedCountries: string[];
  selectedRegions: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
}