import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, TrendingUp, DollarSign, Users, 
  Calendar, Download, FileText, Target,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12500, quotes: 8, jobs: 6 },
  { month: 'Feb', revenue: 15200, quotes: 10, jobs: 7 },
  { month: 'Mar', revenue: 18700, quotes: 12, jobs: 9 },
  { month: 'Apr', revenue: 16400, quotes: 11, jobs: 8 },
  { month: 'May', revenue: 21300, quotes: 14, jobs: 11 },
  { month: 'Jun', revenue: 19800, quotes: 13, jobs: 10 },
];

const serviceData = [
  { name: 'Roof Restoration', value: 35, color: '#007ACC' },
  { name: 'Roof Painting', value: 25, color: '#0B3B69' },
  { name: 'Leak Detection', value: 20, color: '#6B7280' },
  { name: 'Gutter Cleaning', value: 12, color: '#334155' },
  { name: 'Other', value: 8, color: '#111827' },
];

export default function ReportsAnalytics() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  return (
    <AppShell>
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              Reports & Analytics
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Business performance and insights
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl md:text-2xl font-bold mt-1">$103.9K</p>
              </div>
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs md:text-sm text-green-500">
              <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
              <span>+15.3%</span>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-xl md:text-2xl font-bold mt-1">51</p>
              </div>
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs md:text-sm text-green-500">
              <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
              <span>+8.2%</span>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Quote Win Rate</p>
                <p className="text-xl md:text-2xl font-bold mt-1">68%</p>
              </div>
              <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs md:text-sm text-red-500">
              <ArrowDownRight className="h-3 w-3 md:h-4 md:w-4" />
              <span>-2.1%</span>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Avg Job Value</p>
                <p className="text-xl md:text-2xl font-bold mt-1">$2,037</p>
              </div>
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs md:text-sm text-green-500">
              <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
              <span>+12.5%</span>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="revenue" className="text-xs md:text-sm">Revenue</TabsTrigger>
            <TabsTrigger value="services" className="text-xs md:text-sm">Services</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs md:text-sm">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-4">
            <Card className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-lg md:text-xl font-semibold">Revenue Trend</h2>
                <div className="flex gap-2 overflow-x-auto">
                  {['week', 'month', 'quarter', 'year'].map((tf) => (
                    <Button
                      key={tf}
                      variant={timeframe === tf ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeframe(tf as any)}
                      className="capitalize text-xs md:text-sm flex-shrink-0"
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="revenue" fill="#007ACC" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            <Card className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-6">Service Distribution</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.value}%`}
                        outerRadius={window.innerWidth < 768 ? 80 : 120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {serviceData.map((service) => (
                    <div key={service.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: service.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-medium">{service.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{service.value}% of jobs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <Card className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-6">Jobs vs Quotes</h2>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line 
                      type="monotone" 
                      dataKey="quotes" 
                      stroke="#007ACC" 
                      strokeWidth={2}
                      name="Quotes Sent"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="jobs" 
                      stroke="#0B3B69" 
                      strokeWidth={2}
                      name="Jobs Won"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}