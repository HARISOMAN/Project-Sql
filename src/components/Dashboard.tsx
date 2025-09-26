import React, { useState, useMemo } from 'react';
import { DashboardFilters } from '../types/analytics';
import { mockSalesData } from '../data/mockData';
import { 
  cleanSalesData, 
  filterSalesData, 
  calculateKPIs, 
  getMonthlyRevenueTrend, 
  getTopCustomers, 
  getBestSellingProducts 
} from '../utils/analytics';
import { KPICard } from './KPICard';
import { FilterPanel } from './FilterPanel';
import { RevenueChart } from './RevenueChart';
import { TopCustomersChart } from './TopCustomersChart';
import { ProductsChart } from './ProductsChart';
import { BarChart3, Database, Filter } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    selectedCountries: [],
    selectedRegions: [],
    dateRange: {
      start: new Date('2023-01-01'),
      end: new Date('2024-12-31')
    }
  });

  const [showFilters, setShowFilters] = useState(false);

  // Clean and process data
  const cleanedData = useMemo(() => cleanSalesData(mockSalesData), []);
  const filteredData = useMemo(() => filterSalesData(cleanedData, filters), [cleanedData, filters]);

  // Get available filter options
  const availableCountries = useMemo(() => 
    Array.from(new Set(cleanedData.map(record => record.country))).sort(),
    [cleanedData]
  );

  const availableRegions = useMemo(() => 
    Array.from(new Set(cleanedData.map(record => record.region))).sort(),
    [cleanedData]
  );

  // Calculate analytics
  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const monthlyRevenue = useMemo(() => getMonthlyRevenueTrend(filteredData), [filteredData]);
  const topCustomers = useMemo(() => getTopCustomers(filteredData, 10), [filteredData]);
  const bestProducts = useMemo(() => getBestSellingProducts(filteredData, 10), [filteredData]);

  const recordCount = filteredData.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Retail Analytics Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Database className="w-4 h-4" />
                <span>{recordCount.toLocaleString()} records</span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showFilters 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className={`transition-all duration-300 ${showFilters ? 'flex-1' : 'w-full'}`}>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpis.map((kpi, index) => (
                <KPICard key={index} metric={kpi} />
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Trend */}
              <div className="lg:col-span-2">
                <RevenueChart data={monthlyRevenue} />
              </div>

              {/* Top Customers */}
              <TopCustomersChart data={topCustomers} />

              {/* Best Products */}
              <ProductsChart data={bestProducts} />
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <FilterPanel
                filters={filters}
                availableCountries={availableCountries}
                availableRegions={availableRegions}
                onFiltersChange={setFilters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};