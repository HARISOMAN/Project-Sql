import React from 'react';
import { KPIMetric } from '../types/analytics';
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  metric: KPIMetric;
}

const iconMap = {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp
};

export const KPICard: React.FC<KPICardProps> = ({ metric }) => {
  const Icon = iconMap[metric.icon as keyof typeof iconMap];
  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;
  
  const trendColor = metric.trend === 'up' ? 'text-emerald-600' : 
                     metric.trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${metric.color.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{metric.title}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {metric.change.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};