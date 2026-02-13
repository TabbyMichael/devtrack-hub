import { useState, useEffect } from 'react';
import { useTeamStore } from '@/stores/teamStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Settings, 
  UserPlus, 
  MoreHorizontal,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TeamList = () => {
  const { teams, loading, error, fetchTeams, switchTeam } = useTeamStore();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleTeamSwitch = async (teamId: string) => {
    try {
      await switchTeam(teamId);
      setSelectedTeam(teamId);
    } catch (error) {
      console.error('Failed to switch team:', error);
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Teams</h2>
          <p className="text-muted-foreground">
            Manage your teams and collaborate with others
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No teams yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first team to start collaborating
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTeam === team.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTeamSwitch(team.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={team.avatar || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {team.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {team.slug}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {team.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {team._count?.members || 0} members
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {team._count?.projects || 0} projects
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.members?.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center space-x-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.user?.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {member.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {member.acceptedAt ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <Clock className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                    ))}
                    {team.members && team.members.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{team.members.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite
                    </Button>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};