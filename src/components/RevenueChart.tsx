import React from 'react';
import { ChartData } from '../types/analytics';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RevenueChartProps {
  data: ChartData[];
  title?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data, 
  title = "Monthly Revenue Trend" 
}) => {
  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>Growth Trend</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Chart area */}
        <div className="flex items-end space-x-2 h-64 mb-4">
          {data.map((item, index) => {
            const height = ((item.value - minValue) / range) * 100;
            const isPositiveChange = (item.change || 0) >= 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex justify-center">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap transition-opacity z-10">
                    <div className="font-semibold">${item.value.toLocaleString()}</div>
                    {item.change !== undefined && (
                      <div className={`flex items-center space-x-1 ${isPositiveChange ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositiveChange ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{Math.abs(item.change).toFixed(1)}%</span>
                      </div>
                    )}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                  
                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              <span className="text-xs text-gray-600 transform -rotate-45 inline-block origin-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-lg font-semibold text-gray-900">
            ${data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Average Monthly</p>
          <p className="text-lg font-semibold text-gray-900">
            ${Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Best Month</p>
          <p className="text-lg font-semibold text-gray-900">
            ${maxValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};