import React from 'react';
import { DashboardFilters } from '../types/analytics';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: DashboardFilters;
  availableCountries: string[];
  availableRegions: string[];
  onFiltersChange: (filters: DashboardFilters) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  availableCountries,
  availableRegions,
  onFiltersChange
}) => {
  const handleCountryChange = (country: string) => {
    const newCountries = filters.selectedCountries.includes(country)
      ? filters.selectedCountries.filter(c => c !== country)
      : [...filters.selectedCountries, country];
    
    onFiltersChange({
      ...filters,
      selectedCountries: newCountries
    });
  };

  const handleRegionChange = (region: string) => {
    const newRegions = filters.selectedRegions.includes(region)
      ? filters.selectedRegions.filter(r => r !== region)
      : [...filters.selectedRegions, region];
    
    onFiltersChange({
      ...filters,
      selectedRegions: newRegions
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: new Date(value)
      }
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      selectedCountries: [],
      selectedRegions: [],
      dateRange: {
        start: new Date('2023-01-01'),
        end: new Date('2024-12-31')
      }
    });
  };

  const hasActiveFilters = filters.selectedCountries.length > 0 || filters.selectedRegions.length > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={filters.dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={filters.dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Regions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Regions</label>
          <div className="space-y-2">
            {availableRegions.map(region => (
              <label key={region} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.selectedRegions.includes(region)}
                  onChange={() => handleRegionChange(region)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Countries</label>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {availableCountries.map(country => (
              <label key={country} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.selectedCountries.includes(country)}
                  onChange={() => handleCountryChange(country)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{country}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="space-y-1">
            {filters.selectedRegions.length > 0 && (
              <p className="text-xs text-blue-600">
                Regions: {filters.selectedRegions.join(', ')}
              </p>
            )}
            {filters.selectedCountries.length > 0 && (
              <p className="text-xs text-blue-600">
                Countries: {filters.selectedCountries.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};