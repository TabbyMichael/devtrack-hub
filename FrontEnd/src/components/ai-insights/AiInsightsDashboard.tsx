import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  Clock,
  Users,
  Zap,
  RefreshCw
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface AiInsight {
  id: string;
  type: 'productivity_pattern' | 'anomaly_detection' | 'trend_prediction' | 'optimization_suggestion';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  data: any;
  createdAt: string;
}

export const AiInsightsDashboard = () => {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would be replaced with actual API call
      const mockInsights: AiInsight[] = [
        {
          id: '1',
          type: 'productivity_pattern',
          title: 'Peak Productivity Hours',
          description: 'Your most productive hours are between 9:00-11:00 AM with 15.2 hours of work',
          confidence: 0.85,
          priority: 'high',
          data: {
            peakHours: [
              { hour: 9, hours: 15.2, sessions: 8 },
              { hour: 10, hours: 14.8, sessions: 7 },
              { hour: 14, hours: 12.3, sessions: 6 }
            ]
          },
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'optimization_suggestion',
          title: 'Session Duration Optimization',
          description: 'Your average session length is 3.2 hours. Consider breaking work into smaller focused sessions',
          confidence: 0.8,
          priority: 'medium',
          data: {
            averageDuration: 3.2,
            optimalDuration: 2.5,
            sessionDurations: [2.1, 3.5, 4.2, 2.8, 3.1]
          },
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          type: 'anomaly_detection',
          title: 'Unusual Work Patterns Detected',
          description: 'Found 2 sessions that deviate significantly from your normal pattern',
          confidence: 0.9,
          priority: 'medium',
          data: {
            outliers: [
              { id: 'sess1', duration: 8.5, date: '2024-01-10', project: 'Project Alpha' },
              { id: 'sess2', duration: 1.2, date: '2024-01-12', project: 'Project Beta' }
            ]
          },
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          type: 'trend_prediction',
          title: 'Productivity Trend Analysis',
          description: 'Your productivity is increasing by 12.5% compared to last week. Keep up the great work!',
          confidence: 0.75,
          priority: 'high',
          data: {
            trend: 12.5,
            lastWeekHours: 45.2,
            previousWeekHours: 40.2
          },
          createdAt: new Date().toISOString()
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInsights(mockInsights);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [timeRange]);

  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'all') return true;
    return insight.type === activeTab;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'productivity_pattern': return <TrendingUp className="h-5 w-5" />;
      case 'anomaly_detection': return <AlertTriangle className="h-5 w-5" />;
      case 'trend_prediction': return <Target className="h-5 w-5" />;
      case 'optimization_suggestion': return <Lightbulb className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'productivity_pattern': return 'bg-blue-100 text-blue-800';
      case 'anomaly_detection': return 'bg-orange-100 text-orange-800';
      case 'trend_prediction': return 'bg-purple-100 text-purple-800';
      case 'optimization_suggestion': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchInsights} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Insights</h2>
          <p className="text-muted-foreground">
            Intelligent productivity analysis and recommendations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchInsights} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.length}</div>
            <p className="text-xs text-muted-foreground">Actionable insights</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.filter(i => i.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.length > 0 
                ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">AI confidence level</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patterns Found</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.filter(i => i.type === 'productivity_pattern').length}
            </div>
            <p className="text-xs text-muted-foreground">Productivity patterns</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'all', label: 'All Insights', count: insights.length },
          { id: 'productivity_pattern', label: 'Patterns', count: insights.filter(i => i.type === 'productivity_pattern').length },
          { id: 'optimization_suggestion', label: 'Optimizations', count: insights.filter(i => i.type === 'optimization_suggestion').length },
          { id: 'anomaly_detection', label: 'Anomalies', count: insights.filter(i => i.type === 'anomaly_detection').length },
          { id: 'trend_prediction', label: 'Trends', count: insights.filter(i => i.type === 'trend_prediction').length },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center space-x-2"
          >
            <span>{tab.label}</span>
            <Badge variant="secondary" className="text-xs">
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Insights List */}
      <div className="grid gap-6">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getTypeColor(insight.type)}`}>
                    {getTypeIcon(insight.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{insight.description}</p>
              
              {/* Data Visualization */}
              {insight.type === 'productivity_pattern' && insight.data.peakHours && (
                <div className="space-y-4">
                  <h4 className="font-medium">Your Peak Hours</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={insight.data.peakHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {insight.type === 'optimization_suggestion' && insight.data.sessionDurations && (
                <div className="space-y-4">
                  <h4 className="font-medium">Session Duration Distribution</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Average</span>
                        <span className="text-sm font-medium">{insight.data.averageDuration.toFixed(1)}h</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(insight.data.averageDuration / 8) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Optimal</span>
                        <span className="text-sm font-medium">{insight.data.optimalDuration}h</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(insight.data.optimalDuration / 8) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {insight.type === 'anomaly_detection' && insight.data.outliers && (
                <div className="space-y-4">
                  <h4 className="font-medium">Detected Anomalies</h4>
                  <div className="grid gap-2">
                    {insight.data.outliers.map((outlier: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-warning/10 rounded">
                        <div>
                          <div className="font-medium">{outlier.project}</div>
                          <div className="text-sm text-muted-foreground">{outlier.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{outlier.duration.toFixed(1)}h</div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {insight.type === 'trend_prediction' && (
                <div className="space-y-4">
                  <h4 className="font-medium">Trend Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {insight.data.lastWeekHours.toFixed(1)}h
                      </div>
                      <div className="text-sm text-blue-700">This week</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {insight.data.previousWeekHours.toFixed(1)}h
                      </div>
                      <div className="text-sm text-green-700">Last week</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      insight.data.trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {insight.data.trend > 0 ? '↑' : '↓'} {Math.abs(insight.data.trend).toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Generated {new Date(insight.createdAt).toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm">
                  Apply Suggestion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No insights found</h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'all' 
                ? 'No insights available for the selected time period'
                : `No ${activeTab.replace('_', ' ')} insights found`}
            </p>
            <Button onClick={fetchInsights}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Insights
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};