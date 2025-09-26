import { SalesRecord, KPIMetric, ChartData, DashboardFilters } from '../types/analytics';

// Data cleaning and preprocessing utilities
export const cleanSalesData = (data: SalesRecord[]): SalesRecord[] => {
  return data
    .filter(record => 
      record.quantity > 0 && 
      record.unitPrice > 0 && 
      record.customerId && 
      record.country &&
      record.description.trim() !== ''
    )
    .map(record => ({
      ...record,
      description: record.description.trim(),
      totalAmount: Number((record.quantity * record.unitPrice).toFixed(2))
    }));
};

// Apply filters to sales data
export const filterSalesData = (data: SalesRecord[], filters: DashboardFilters): SalesRecord[] => {
  return data.filter(record => {
    const countryMatch = filters.selectedCountries.length === 0 || 
                        filters.selectedCountries.includes(record.country);
    const regionMatch = filters.selectedRegions.length === 0 || 
                       filters.selectedRegions.includes(record.region);
    const dateMatch = record.invoiceDate >= filters.dateRange.start && 
                     record.invoiceDate <= filters.dateRange.end;
    
    return countryMatch && regionMatch && dateMatch;
  });
};

// Calculate KPI metrics
export const calculateKPIs = (data: SalesRecord[], previousData?: SalesRecord[]): KPIMetric[] => {
  const totalRevenue = data.reduce((sum, record) => sum + record.totalAmount, 0);
  const totalOrders = data.length;
  const uniqueCustomers = new Set(data.map(record => record.customerId)).size;
  const avgOrderValue = totalRevenue / totalOrders || 0;

  // Calculate previous period metrics for comparison
  const prevRevenue = previousData?.reduce((sum, record) => sum + record.totalAmount, 0) || 0;
  const prevOrders = previousData?.length || 0;
  const prevCustomers = previousData ? new Set(previousData.map(r => r.customerId)).size : 0;
  const prevAvgOrder = prevRevenue / prevOrders || 0;

  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const ordersChange = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;
  const customersChange = prevCustomers > 0 ? ((uniqueCustomers - prevCustomers) / prevCustomers) * 100 : 0;
  const avgOrderChange = prevAvgOrder > 0 ? ((avgOrderValue - prevAvgOrder) / prevAvgOrder) * 100 : 0;

  return [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: revenueChange,
      trend: revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'stable',
      icon: 'DollarSign',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: ordersChange,
      trend: ordersChange > 0 ? 'up' : ordersChange < 0 ? 'down' : 'stable',
      icon: 'ShoppingCart',
      color: 'bg-emerald-500'
    },
    {
      title: 'Unique Customers',
      value: uniqueCustomers.toLocaleString(),
      change: customersChange,
      trend: customersChange > 0 ? 'up' : customersChange < 0 ? 'down' : 'stable',
      icon: 'Users',
      color: 'bg-purple-500'
    },
    {
      title: 'Avg Order Value',
      value: `$${avgOrderValue.toFixed(2)}`,
      change: avgOrderChange,
      trend: avgOrderChange > 0 ? 'up' : avgOrderChange < 0 ? 'down' : 'stable',
      icon: 'TrendingUp',
      color: 'bg-orange-500'
    }
  ];
};

// Generate monthly revenue trend data
export const getMonthlyRevenueTrend = (data: SalesRecord[]): ChartData[] => {
  const monthlyData = new Map<string, number>();
  
  data.forEach(record => {
    const monthKey = record.invoiceDate.toISOString().substring(0, 7); // YYYY-MM
    monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + record.totalAmount);
  });

  const sortedMonths = Array.from(monthlyData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({
      name: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: Math.round(revenue),
      date: month
    }));

  // Calculate month-over-month change
  for (let i = 1; i < sortedMonths.length; i++) {
    const current = sortedMonths[i].value;
    const previous = sortedMonths[i - 1].value;
    sortedMonths[i].change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  }

  return sortedMonths;
};

// Get top customers
export const getTopCustomers = (data: SalesRecord[], limit: number = 10): ChartData[] => {
  const customerRevenue = new Map<string, number>();
  
  data.forEach(record => {
    customerRevenue.set(
      record.customerId, 
      (customerRevenue.get(record.customerId) || 0) + record.totalAmount
    );
  });

  return Array.from(customerRevenue.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([customerId, revenue]) => ({
      name: customerId,
      value: Math.round(revenue)
    }));
};

// Get best-selling products
export const getBestSellingProducts = (data: SalesRecord[], limit: number = 10): ChartData[] => {
  const productRevenue = new Map<string, { revenue: number; quantity: number }>();
  
  data.forEach(record => {
    const existing = productRevenue.get(record.description) || { revenue: 0, quantity: 0 };
    productRevenue.set(record.description, {
      revenue: existing.revenue + record.totalAmount,
      quantity: existing.quantity + record.quantity
    });
  });

  return Array.from(productRevenue.entries())
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, limit)
    .map(([product, data]) => ({
      name: product.length > 30 ? product.substring(0, 30) + '...' : product,
      value: Math.round(data.revenue)
    }));
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};