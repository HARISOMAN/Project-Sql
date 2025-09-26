import React from 'react';
import { ChartData } from '../types/analytics';
import { User, Crown } from 'lucide-react';

interface TopCustomersChartProps {
  data: ChartData[];
  title?: string;
}

export const TopCustomersChart: React.FC<TopCustomersChartProps> = ({ 
  data, 
  title = "Top 10 Customers by Revenue" 
}) => {
  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No customer data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Crown className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-3">
        {data.map((customer, index) => {
          const percentage = (customer.value / maxValue) * 100;
          const isTop3 = index < 3;
          
          return (
            <div key={customer.name} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {index + 1}
                  </div>
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {customer.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ${customer.value.toLocaleString()}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isTop3 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-r from-blue-400 to-blue-500'
                    } group-hover:from-blue-600 group-hover:to-purple-700`}
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
            <p className="text-sm text-gray-600">Top Customer Revenue</p>
            <p className="text-lg font-semibold text-gray-900">
              ${data[0]?.value.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Top 10 Revenue</p>
            <p className="text-lg font-semibold text-gray-900">
              ${data.reduce((sum, customer) => sum + customer.value, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};