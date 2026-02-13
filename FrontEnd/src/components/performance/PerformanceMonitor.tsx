import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Zap,
  Clock,
  Database,
  Wifi,
  Cpu,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export const PerformanceMonitor = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock performance data
  const apiMetrics = [
    { time: '00:00', responseTime: 120, throughput: 45, errorRate: 0.2 },
    { time: '04:00', responseTime: 85, throughput: 32, errorRate: 0.1 },
    { time: '08:00', responseTime: 250, throughput: 120, errorRate: 1.5 },
    { time: '12:00', responseTime: 180, throughput: 95, errorRate: 0.3 },
    { time: '16:00', responseTime: 145, throughput: 78, errorRate: 0.2 },
    { time: '20:00', responseTime: 210, throughput: 110, errorRate: 0.8 },
  ];

  const databaseMetrics = [
    { time: '00:00', connections: 12, queries: 450, cacheHit: 85 },
    { time: '04:00', connections: 8, queries: 230, cacheHit: 92 },
    { time: '08:00', connections: 35, queries: 1200, cacheHit: 78 },
    { time: '12:00', connections: 28, queries: 890, cacheHit: 82 },
    { time: '16:00', connections: 22, queries: 680, cacheHit: 88 },
    { time: '20:00', connections: 31, queries: 1050, cacheHit: 75 },
  ];

  const frontendMetrics = [
    { time: '00:00', loadTime: 1.2, bundleSize: 2.1, memory: 45 },
    { time: '04:00', loadTime: 0.9, bundleSize: 2.1, memory: 38 },
    { time: '08:00', loadTime: 2.1, bundleSize: 2.1, memory: 89 },
    { time: '12:00', loadTime: 1.6, bundleSize: 2.1, memory: 67 },
    { time: '16:00', loadTime: 1.4, bundleSize: 2.1, memory: 58 },
    { time: '20:00', loadTime: 1.9, bundleSize: 2.1, memory: 78 },
  ];

  const currentMetrics = {
    apiResponseTime: 145,
    databaseConnections: 22,
    frontendLoadTime: 1.4,
    cacheHitRate: 88,
    errorRate: 0.2,
    uptime: 99.95
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Monitor</h2>
          <p className="text-muted-foreground">
            Real-time performance metrics and system health
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.apiResponseTime}ms</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">12% improvement</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Connections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.databaseConnections}</div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Healthy</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frontend Load Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.frontendLoadTime}s</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">8% faster</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.uptime}%</div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Performance</CardTitle>
            <CardDescription>Response time and throughput metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={apiMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Response Time (ms)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Throughput (req/s)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Performance</CardTitle>
            <CardDescription>Connections and query performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={databaseMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="connections" fill="#8b5cf6" name="Connections" />
                <Bar dataKey="queries" fill="#f59e0b" name="Queries" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Frontend Performance</CardTitle>
            <CardDescription>Load times and resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={frontendMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="loadTime" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Load Time (s)"
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Memory (MB)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cache Performance</CardTitle>
            <CardDescription>Cache hit rates and efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                  <span className="text-sm text-muted-foreground">{currentMetrics.cacheHitRate}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full" 
                    style={{ width: `${currentMetrics.cacheHitRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentMetrics.cacheHitRate > 90 ? 'Excellent' : 
                   currentMetrics.cacheHitRate > 80 ? 'Good' : 'Needs improvement'}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Error Rate</span>
                  <span className="text-sm text-muted-foreground">{currentMetrics.errorRate}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full" 
                    style={{ width: `${currentMetrics.errorRate * 10}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentMetrics.errorRate < 0.5 ? 'Very low' : 
                   currentMetrics.errorRate < 1 ? 'Acceptable' : 'High - requires attention'}
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Performance Alerts</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">All systems operating normally</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Cache hit rate below 90% during peak hours</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions to improve performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Database Indexing</h4>
                  <p className="text-sm text-muted-foreground">
                    Add indexes to frequently queried columns to reduce response time by up to 40%
                  </p>
                  <Badge variant="secondary" className="mt-2">Medium Priority</Badge>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">CDN Implementation</h4>
                  <p className="text-sm text-muted-foreground">
                    Implement CDN for static assets to reduce load times by 60%
                  </p>
                  <Badge variant="secondary" className="mt-2">High Priority</Badge>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Database className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Query Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Optimize complex queries to reduce database load by 30%
                  </p>
                  <Badge variant="secondary" className="mt-2">High Priority</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};