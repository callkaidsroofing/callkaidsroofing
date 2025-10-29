import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface LeadFilterState {
  service: string;
  suburb: string;
  status: string;
  source: string;
  dateFrom: string;
  dateTo: string;
}

interface LeadFiltersProps {
  filters: LeadFilterState;
  onFiltersChange: (filters: LeadFilterState) => void;
}

const SERVICE_OPTIONS = [
  'Roof Restoration',
  'Roof Painting',
  'Roof Repairs',
  'Gutter Cleaning',
  'Leak Detection',
  'Valley Iron Replacement',
  'Tile Replacement',
  'Repointing',
];

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'quoted', 'won', 'lost'];

const SOURCE_OPTIONS = ['website', 'google', 'facebook', 'referral', 'phone'];

export function LeadFilters({ filters, onFiltersChange }: LeadFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleFilterChange = (key: keyof LeadFilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      service: '',
      suburb: '',
      status: '',
      source: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== '').length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Filter Leads</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-auto p-0 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {/* Status Filter */}
            <div>
              <Label htmlFor="status-filter" className="text-xs">
                Status
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Filter */}
            <div>
              <Label htmlFor="service-filter" className="text-xs">
                Service
              </Label>
              <Select
                value={filters.service}
                onValueChange={(value) => handleFilterChange('service', value)}
              >
                <SelectTrigger id="service-filter">
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All services</SelectItem>
                  {SERVICE_OPTIONS.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source Filter */}
            <div>
              <Label htmlFor="source-filter" className="text-xs">
                Source
              </Label>
              <Select
                value={filters.source}
                onValueChange={(value) => handleFilterChange('source', value)}
              >
                <SelectTrigger id="source-filter">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  {SOURCE_OPTIONS.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Suburb Filter */}
            <div>
              <Label htmlFor="suburb-filter" className="text-xs">
                Suburb
              </Label>
              <Input
                id="suburb-filter"
                placeholder="Enter suburb..."
                value={filters.suburb}
                onChange={(e) => handleFilterChange('suburb', e.target.value)}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="date-from" className="text-xs">
                  From
                </Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date-to" className="text-xs">
                  To
                </Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
