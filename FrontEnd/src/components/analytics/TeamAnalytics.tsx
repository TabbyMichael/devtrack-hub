import { useState } from 'react';
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
  Users,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  Award
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const TeamAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedTeam, setSelectedTeam] = useState('all');

  // Mock team data - this would come from API
  const teamData = {
    members: 12,
    totalHours: 342.5,
    avgHoursPerMember: 28.5,
    projects: 8,
    mostActiveMember: 'John Doe',
    leastActiveMember: 'Jane Smith'
  };

  // Mock member productivity data
  const memberProductivityData = [
    { name: 'John Doe', hours: 45.2, sessions: 23, projects: 3 },
    { name: 'Jane Smith', hours: 12.8, sessions: 8, projects: 2 },
    { name: 'Mike Johnson', hours: 38.7, sessions: 19, projects: 4 },
    { name: 'Sarah Wilson', hours: 32.1, sessions: 16, projects: 2 },
    { name: 'Tom Brown', hours: 28.9, sessions: 14, projects: 3 },
  ];

  // Mock project distribution data
  const projectData = [
    { name: 'Project Alpha', value: 125.3 },
    { name: 'Project Beta', value: 89.7 },
    { name: 'Project Gamma', value: 67.2 },
    { name: 'Project Delta', value: 45.1 },
    { name: 'Project Epsilon', value: 15.2 },
  ];

  // Mock daily team productivity
  const dailyTeamData = [
    { date: '2024-01-01', hours: 24.5, members: 8 },
    { date: '2024-01-02', hours: 28.3, members: 9 },
    { date: '2024-01-03', hours: 32.1, members: 10 },
    { date: '2024-01-04', hours: 26.8, members: 7 },
    { date: '2024-01-05', hours: 35.2, members: 11 },
    { date: '2024-01-06', hours: 22.7, members: 6 },
    { date: '2024-01-07', hours: 29.4, members: 9 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Analytics</h2>
          <p className="text-muted-foreground">
            Insights into your team's productivity and performance
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="team1">Team Alpha</SelectItem>
              <SelectItem value="team2">Team Beta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.members}</div>
            <p className="text-xs text-muted-foreground">Active contributors</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Across all members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Member</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.avgHoursPerMember.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Average contribution</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.projects}</div>
            <p className="text-xs text-muted-foreground">Currently tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Member Productivity */}
      <Card>
        <CardHeader>
          <CardTitle>Member Productivity</CardTitle>
          <CardDescription>Individual contribution breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {memberProductivityData.map((member, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{member.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    {member.hours.toFixed(1)}h
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Sessions:</span>
                    <span>{member.sessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <span>{member.projects}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(member.hours / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Productivity Trend</CardTitle>
            <CardDescription>Daily hours across the team</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTeamData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value}h`, 'Hours']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Distribution</CardTitle>
            <CardDescription>Time allocation across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}h`, 'Hours']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Leaders</CardTitle>
            <CardDescription>Top contributors this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-muted-foreground">45.2 hours</div>
                  </div>
                </div>
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Mike Johnson</div>
                    <div className="text-sm text-muted-foreground">38.7 hours</div>
                  </div>
                </div>
                <Award className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Health</CardTitle>
            <CardDescription>Overall team performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Engagement Rate</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Project Completion</span>
                  <span className="text-sm text-muted-foreground">72%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Goal Achievement</span>
                  <span className="text-sm text-muted-foreground">68%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};