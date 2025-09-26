import { SalesRecord, Customer, Product } from '../types/analytics';

// Generate realistic mock data for retail analysis
const countries = [
  'United Kingdom', 'France', 'Germany', 'Netherlands', 'Belgium', 'Switzerland',
  'Spain', 'Norway', 'Portugal', 'Italy', 'Poland', 'Austria', 'Denmark',
  'Finland', 'Sweden', 'Australia', 'Japan', 'Singapore', 'USA', 'Canada'
];

const regions = [
  'Europe', 'North America', 'Asia Pacific', 'Oceania'
];

const regionMapping: Record<string, string> = {
  'United Kingdom': 'Europe',
  'France': 'Europe', 
  'Germany': 'Europe',
  'Netherlands': 'Europe',
  'Belgium': 'Europe',
  'Switzerland': 'Europe',
  'Spain': 'Europe',
  'Norway': 'Europe',
  'Portugal': 'Europe',
  'Italy': 'Europe',
  'Poland': 'Europe',
  'Austria': 'Europe',
  'Denmark': 'Europe',
  'Finland': 'Europe',
  'Sweden': 'Europe',
  'Australia': 'Oceania',
  'Japan': 'Asia Pacific',
  'Singapore': 'Asia Pacific',
  'USA': 'North America',
  'Canada': 'North America'
};

const products = [
  'WHITE HANGING HEART T-LIGHT HOLDER',
  'WHITE METAL LANTERN',
  'CREAM CUPID HEARTS COAT HANGER',
  'KNITTED UNION FLAG HOT WATER BOTTLE',
  'RED WOOLLY HOTTIE WHITE HEART',
  'SET 7 BABUSHKA NESTING BOXES',
  'GLASS STAR FROSTED T-LIGHT HOLDER',
  'HAND WARMER UNION JACK',
  'HAND WARMER RED POLKA DOT',
  'ASSORTED COLOUR BIRD ORNAMENT',
  'POPPY\'S PLAYHOUSE KITCHEN',
  'POPPY\'S PLAYHOUSE BEDROOM',
  'FELTCRAFT PRINCESS CHARLOTTE DOLL',
  'IVORY KNITTED MUG COSY',
  'BOX OF 6 ASSORTED COLOUR TEASPOONS',
  'BOX OF VINTAGE JIGSAW BLOCKS',
  'BOX OF VINTAGE ALPHABET BLOCKS',
  'HOME BUILDING BLOCK WORD',
  'LOVE BUILDING BLOCK WORD',
  'RECIPE BOX WITH METAL HEART',
  'DOORMAT NEW ENGLAND',
  'CHILDRENS CUTLERY DOLLY GIRL',
  'CHILDRENS CUTLERY CIRCUS PARADE',
  'BABUSHKA NESTING BOXES SET OF 4',
  'PINK CHERRY LIGHTS',
  'BLUE CHERRY LIGHTS',
  'LIGHT PINK BUTTERFLY T-LIGHT HOLDER',
  'WHITE CHOCOLATE LANTERN',
  'VINTAGE SNAP CARDS',
  'ROUND SNACK BOXES SET OF4 WOODLAND'
];

// Generate mock sales data
export const generateMockSalesData = (count: number = 50000): SalesRecord[] => {
  const records: SalesRecord[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2024-12-31');

  for (let i = 0; i < count; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const region = regionMapping[country];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const unitPrice = parseFloat((Math.random() * 50 + 1).toFixed(2));
    const totalAmount = quantity * unitPrice;
    
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    
    records.push({
      id: `record-${i + 1}`,
      invoiceNo: `INV${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      stockCode: `SKU${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      description: product,
      quantity,
      invoiceDate: randomDate,
      unitPrice,
      customerId: `CUST${String(Math.floor(Math.random() * 5000)).padStart(4, '0')}`,
      country,
      region,
      totalAmount
    });
  }

  return records.sort((a, b) => b.invoiceDate.getTime() - a.invoiceDate.getTime());
};

// Generate aggregated customer data
export const generateCustomerData = (salesData: SalesRecord[]): Customer[] => {
  const customerMap = new Map<string, {
    country: string;
    totalSpent: number;
    ordersCount: number;
    lastOrderDate: Date;
  }>();

  salesData.forEach(record => {
    if (!customerMap.has(record.customerId)) {
      customerMap.set(record.customerId, {
        country: record.country,
        totalSpent: 0,
        ordersCount: 0,
        lastOrderDate: record.invoiceDate
      });
    }
    
    const customer = customerMap.get(record.customerId)!;
    customer.totalSpent += record.totalAmount;
    customer.ordersCount += 1;
    if (record.invoiceDate > customer.lastOrderDate) {
      customer.lastOrderDate = record.invoiceDate;
    }
  });

  return Array.from(customerMap.entries())
    .map(([id, data]) => ({
      id,
      country: data.country,
      totalSpent: data.totalSpent,
      ordersCount: data.ordersCount,
      avgOrderValue: data.totalSpent / data.ordersCount,
      lastOrderDate: data.lastOrderDate
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
};

// Generate product performance data
export const generateProductData = (salesData: SalesRecord[]): Product[] => {
  const productMap = new Map<string, {
    description: string;
    totalSold: number;
    revenue: number;
    prices: number[];
    countries: Set<string>;
  }>();

  salesData.forEach(record => {
    if (!productMap.has(record.stockCode)) {
      productMap.set(record.stockCode, {
        description: record.description,
        totalSold: 0,
        revenue: 0,
        prices: [],
        countries: new Set()
      });
    }
    
    const product = productMap.get(record.stockCode)!;
    product.totalSold += record.quantity;
    product.revenue += record.totalAmount;
    product.prices.push(record.unitPrice);
    product.countries.add(record.country);
  });

  return Array.from(productMap.entries())
    .map(([stockCode, data]) => ({
      stockCode,
      description: data.description,
      totalSold: data.totalSold,
      revenue: data.revenue,
      avgPrice: data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length,
      country: Array.from(data.countries).join(', ')
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

export const mockSalesData = generateMockSalesData();
export const mockCustomerData = generateCustomerData(mockSalesData);
export const mockProductData = generateProductData(mockSalesData);