import React from 'react';
import { ChartData } from '../types/analytics';
import { Package, Star } from 'lucide-react';

interface ProductsChartProps {
  data: ChartData[];
  title?: string;
}

export const ProductsChart: React.FC<ProductsChartProps> = ({ 
  data, 
  title = "Best-Selling Products by Revenue" 
}) => {
  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No product data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Star className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-4">
        {data.map((product, index) => {
          const percentage = (product.value / maxValue) * 100;
          const isTop5 = index < 5;
          
          return (
            <div key={product.name} className="group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                    index === 0 ? 'bg-orange-100 text-orange-800' :
                    isTop5 ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start space-x-2">
                      <Package className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 ml-4 flex-shrink-0">
                  ${product.value.toLocaleString()}
                </span>
              </div>
              
              <div className="relative ml-9">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isTop5 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    } group-hover:from-emerald-600 group-hover:to-teal-700`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Best Product Revenue</p>
            <p className="text-lg font-semibold text-gray-900">
              ${data[0]?.value.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Products Revenue</p>
            <p className="text-lg font-semibold text-gray-900">
              ${data.reduce((sum, product) => sum + product.value, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};