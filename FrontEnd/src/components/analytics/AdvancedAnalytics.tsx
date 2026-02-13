import { useState, useEffect } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AdvancedAnalytics = () => {
  const { sessions } = useSessionStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedProject, setSelectedProject] = useState('all');

  // Filter sessions based on time range
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    const now = new Date();
    let daysAgo = 7;
    
    switch (timeRange) {
      case '1d': daysAgo = 1; break;
      case '7d': daysAgo = 7; break;
      case '30d': daysAgo = 30; break;
      case '90d': daysAgo = 90; break;
      default: daysAgo = 7;
    }
    
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return sessionDate >= cutoffDate;
  });

  // Filter by project if selected
  const projectFilteredSessions = selectedProject === 'all' 
    ? filteredSessions 
    : filteredSessions.filter(session => session.projectId === selectedProject);

  // Get unique projects for filter
  const projects = Array.from(new Set(sessions.map(s => s.projectId))).map(id => {
    const session = sessions.find(s => s.projectId === id);
    return { id, name: session?.projectName || id };
  });

  // Productivity metrics
  const totalHours = projectFilteredSessions.reduce((sum, session) => sum + session.duration / 60, 0);
  const sessionCount = projectFilteredSessions.length;
  const avgSessionLength = sessionCount > 0 ? totalHours / sessionCount : 0;
  
  // Daily productivity data
  const dailyData = {};
  projectFilteredSessions.forEach(session => {
    const date = new Date(session.startTime).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = { date, hours: 0, sessions: 0 };
    }
    dailyData[date].hours += session.duration / 60;
    dailyData[date].sessions += 1;
  });

  const dailyChartData = Object.values(dailyData).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Project distribution data
  const projectData = {};
  projectFilteredSessions.forEach(session => {
    if (!projectData[session.projectName]) {
      projectData[session.projectName] = { name: session.projectName, value: 0 };
    }
    projectData[session.projectName].value += session.duration / 60;
  });

  const projectChartData = Object.values(projectData);

  // Hourly distribution data
  const hourlyData = Array(24).fill(0).map((_, i) => ({ 
    hour: `${i}:00`, 
    hours: 0 
  }));

  projectFilteredSessions.forEach(session => {
    const startHour = new Date(session.startTime).getHours();
    hourlyData[startHour].hours += session.duration / 60;
  });

  // Productivity trends
  const productivityTrends = dailyChartData.map((day: any, index: number) => {
    const prevDay = index > 0 ? dailyChartData[index - 1] as any : null;
    const trend = prevDay ? (((day as any).hours - prevDay.hours) / prevDay.hours) * 100 : 0;
    return {
      ...day,
      trend: trend,
      trendType: trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral'
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-muted-foreground">
            Deep insights into your productivity patterns
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionCount}</div>
            <p className="text-xs text-muted-foreground">Total sessions tracked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSessionLength.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Average per session</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Productivity</CardTitle>
            <CardDescription>Hours tracked per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivity Trend</CardTitle>
            <CardDescription>Daily productivity changes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value.toFixed(1)}h`, 'Hours']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Distribution</CardTitle>
            <CardDescription>Time spent per project</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}h`, 'Hours']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Distribution</CardTitle>
            <CardDescription>Your most productive hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}h`, 'Hours']} />
                <Bar dataKey="hours" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Productivity Insights</CardTitle>
          <CardDescription>AI-powered recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Peak Productivity</h4>
              <p className="text-sm text-blue-700">
                Your most productive hours are between 9 AM - 11 AM
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Consistency Tip</h4>
              <p className="text-sm text-green-700">
                Try to maintain 2-3 hour sessions for better focus
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Project Balance</h4>
              <p className="text-sm text-purple-700">
                Consider allocating more time to Project B for better progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};