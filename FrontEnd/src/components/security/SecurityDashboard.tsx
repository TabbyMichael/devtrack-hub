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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield,
  Key,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Globe,
  Activity,
  RefreshCw
} from 'lucide-react';

export const SecurityDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [showPassword, setShowPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Mock security data
  const securityMetrics = {
    activeThreats: 2,
    resolvedThreats: 15,
    securityScore: 94,
    lastScan: '2024-01-15 14:30:22',
    vulnerabilities: [
      { id: 1, severity: 'medium', title: 'Outdated dependency detected', status: 'resolved' },
      { id: 2, severity: 'high', title: 'Potential XSS vulnerability', status: 'investigating' },
      { id: 3, severity: 'low', title: 'Weak password policy', status: 'resolved' },
    ],
    recentActivity: [
      { id: 1, type: 'login', user: 'john.doe@example.com', ip: '192.168.1.100', location: 'New York, US', time: '2 min ago', status: 'success' },
      { id: 2, type: 'failed_login', user: 'admin@example.com', ip: '104.28.34.12', location: 'Moscow, RU', time: '15 min ago', status: 'blocked' },
      { id: 3, type: 'password_change', user: 'jane.smith@example.com', ip: '192.168.1.101', location: 'London, UK', time: '1 hour ago', status: 'success' },
      { id: 4, type: 'api_access', user: 'service-account', ip: '10.0.0.5', location: 'Internal', time: '2 hours ago', status: 'success' },
    ]
  };

  const handleSecurityScan = async () => {
    setIsScanning(true);
    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsScanning(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'blocked': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'investigating': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage your application's security posture
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
            onClick={handleSecurityScan}
            disabled={isScanning}
            className={isScanning ? 'animate-pulse' : ''}
          >
            <Shield className="mr-2 h-4 w-4" />
            {isScanning ? 'Scanning...' : 'Security Scan'}
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.securityScore}/100</div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Good</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{securityMetrics.activeThreats}</div>
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-600">Requires attention</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Threats</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityMetrics.resolvedThreats}</div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Successfully handled</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{securityMetrics.lastScan}</div>
            <div className="flex items-center space-x-1">
              <RefreshCw className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600">Auto-scheduled</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Management</CardTitle>
          <CardDescription>Identified security issues and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityMetrics.vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                    {vuln.severity.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{vuln.title}</div>
                    <div className="text-sm text-muted-foreground">ID: VULN-{vuln.id.toString().padStart(4, '0')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={vuln.status === 'resolved' ? 'default' : 'secondary'}>
                    {vuln.status}
                  </Badge>
                  {getStatusIcon(vuln.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Activity</CardTitle>
          <CardDescription>Latest authentication and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityMetrics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {activity.type === 'login' && <User className="h-5 w-5 text-primary" />}
                    {activity.type === 'failed_login' && <Lock className="h-5 w-5 text-red-500" />}
                    {activity.type === 'password_change' && <Key className="h-5 w-5 text-green-500" />}
                    {activity.type === 'api_access' && <Globe className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div>
                    <div className="font-medium">{activity.user}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.ip} • {activity.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{activity.time}</div>
                    <div className="text-xs text-muted-foreground capitalize">{activity.type.replace('_', ' ')}</div>
                  </div>
                  {getStatusIcon(activity.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Security</CardTitle>
            <CardDescription>Manage authentication and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Require 2FA for all users</div>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Password Policy</div>
                <div className="text-sm text-muted-foreground">Strong password requirements</div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm text-muted-foreground">Automatic logout after 24h</div>
              </div>
              <Badge variant="default">Configured</Badge>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Key className="mr-2 h-4 w-4" />
                  Update Password Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Password Policy</DialogTitle>
                  <DialogDescription>
                    Configure security requirements for user passwords
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input id="minLength" type="number" defaultValue="12" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="complexity">Complexity Requirements</Label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Require uppercase letters
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Require lowercase letters
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Require numbers
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Require special characters
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Password Expiry (days)</Label>
                    <Input id="expiry" type="number" defaultValue="90" />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Security</CardTitle>
            <CardDescription>Manage API access and security tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Rate Limiting</div>
                <div className="text-sm text-muted-foreground">1000 requests per hour</div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">API Keys</div>
                <div className="text-sm text-muted-foreground">3 active keys</div>
              </div>
              <Badge variant="secondary">Managed</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">CORS Policy</div>
                <div className="text-sm text-muted-foreground">Restricted to allowed domains</div>
              </div>
              <Badge variant="default">Configured</Badge>
            </div>

            <Button variant="outline" className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Manage API Security
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>Proactive security improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Implement Zero Trust</h4>
                  <p className="text-sm text-muted-foreground">
                    Adopt zero-trust architecture for enhanced security posture
                  </p>
                  <Badge variant="secondary" className="mt-2">High Priority</Badge>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Enhanced Monitoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Add real-time threat detection and behavioral analytics
                  </p>
                  <Badge variant="secondary" className="mt-2">Medium Priority</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};