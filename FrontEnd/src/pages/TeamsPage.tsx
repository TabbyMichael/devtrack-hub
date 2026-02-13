import { useState } from 'react';
import { useTeamStore } from '@/stores/teamStore';
import { TeamList } from '@/components/teams/TeamList';
import { CreateTeamDialog } from '@/components/teams/CreateTeamDialog';
import { TeamMembers } from '@/components/teams/TeamMembers';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Settings, 
  BarChart3,
  CreditCard,
  Shield,
  User
} from 'lucide-react';

export const TeamsPage = () => {
  const { currentTeam, teams } = useTeamStore();
  const [activeTab, setActiveTab] = useState('overview');

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      OWNER: { label: 'Owner', color: 'bg-purple-100 text-purple-800', icon: Shield },
      ADMIN: { label: 'Admin', color: 'bg-blue-100 text-blue-800', icon: User },
      MEMBER: { label: 'Member', color: 'bg-gray-100 text-gray-800', icon: User },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.MEMBER;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </div>
    );
  };

  if (!currentTeam) {
    return (
      <div className="container py-8">
        <TeamList />
      </div>
    );
  }

  const currentUserRole = currentTeam.members?.find(m => 
    m.user?.email === 'current-user@example.com' // This would come from auth context
  )?.role || 'MEMBER';

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentTeam.avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {currentTeam.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{currentTeam.name}</h1>
              <p className="text-muted-foreground">@{currentTeam.slug}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {getRoleBadge(currentUserRole)}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{currentTeam._count?.members || 0} members</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Settings className="h-4 w-4" />
              <span>{currentTeam._count?.projects || 0} projects</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <CreateTeamDialog />
          <Button variant="outline">Team Settings</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Members</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentTeam._count?.members || 0}</div>
                <p className="text-xs text-muted-foreground">Active team members</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentTeam._count?.projects || 0}</div>
                <p className="text-xs text-muted-foreground">Currently tracked</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Role</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUserRole}</div>
                <p className="text-xs text-muted-foreground">Team permissions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PRO</div>
                <Badge variant="secondary" className="mt-1">Active</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest team activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <TeamMembers 
            teamId={currentTeam.id} 
            members={currentTeam.members || []} 
          />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Team Settings</CardTitle>
              <CardDescription>Manage your team configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8 text-muted-foreground">
                Team settings coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your team's subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8 text-muted-foreground">
                Billing management coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};