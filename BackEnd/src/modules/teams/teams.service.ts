import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto, UpdateTeamDto, InviteMemberDto } from './dto';
import { TeamRole } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTeamDto) {
    // Check if team slug is already taken
    const existingTeam = await this.prisma.team.findUnique({
      where: { slug: dto.slug },
    });

    if (existingTeam) {
      throw new BadRequestException('Team slug already exists');
    }

    // Create the team
    const team = await this.prisma.team.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        avatar: dto.avatar,
        members: {
          create: {
            userId,
            role: TeamRole.OWNER,
            acceptedAt: new Date(),
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // User team association is handled through TeamMember relation

    return team;
  }

  async findAll(userId: string) {
    const teams = await this.prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

    return teams;
  }

  async findOne(userId: string, id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        projects: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if user is member of the team
    const isMember = team.members.some(member => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    return team;
  }

  async update(userId: string, id: string, dto: UpdateTeamDto) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if user has permission to update (OWNER or ADMIN)
    const member = team.members.find(m => m.userId === userId);
    if (!member || (member.role !== TeamRole.OWNER && member.role !== TeamRole.ADMIN)) {
      throw new ForbiddenException('You do not have permission to update this team');
    }

    const updatedTeam = await this.prisma.team.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        avatar: dto.avatar,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return updatedTeam;
  }

  async remove(userId: string, id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only OWNER can delete the team
    const member = team.members.find(m => m.userId === userId);
    if (!member || member.role !== TeamRole.OWNER) {
      throw new ForbiddenException('Only team owners can delete the team');
    }

    // Check if team has active projects or members
    const projectCount = await this.prisma.project.count({
      where: { teamId: id },
    });

    if (projectCount > 0) {
      throw new BadRequestException('Cannot delete team with active projects');
    }

    const memberCount = await this.prisma.teamMember.count({
      where: { teamId: id },
    });

    if (memberCount > 1) {
      throw new BadRequestException('Cannot delete team with other members');
    }

    await this.prisma.team.delete({
      where: { id },
    });

    return { message: 'Team deleted successfully' };
  }

  async inviteMember(userId: string, teamId: string, dto: InviteMemberDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if user has permission to invite (OWNER or ADMIN)
    const member = team.members.find(m => m.userId === userId);
    if (!member || (member.role !== TeamRole.OWNER && member.role !== TeamRole.ADMIN)) {
      throw new ForbiddenException('You do not have permission to invite members');
    }

    // Check if user is already a member
    const existingMember = team.members.find(m => m.userId === dto.userId);
    if (existingMember) {
      throw new BadRequestException('User is already a member of this team');
    }

    // Create invitation
    const invitation = await this.prisma.teamMember.create({
      data: {
        userId: dto.userId,
        teamId,
        role: dto.role ? TeamRole[dto.role as keyof typeof TeamRole] : TeamRole.MEMBER,
        // Invited by relationship is handled through userId field
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return invitation;
  }

  async acceptInvitation(userId: string, teamId: string) {
    const invitation = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.acceptedAt) {
      throw new BadRequestException('Invitation already accepted');
    }

    const updatedInvitation = await this.prisma.teamMember.update({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
      data: {
        acceptedAt: new Date(),
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update user's current team
    // Team association is handled through TeamMember relation

    return updatedInvitation;
  }

  async removeMember(userId: string, teamId: string, memberId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if user has permission to remove members
    const currentUserMember = team.members.find(m => m.userId === userId);
    if (!currentUserMember || (currentUserMember.role !== TeamRole.OWNER && currentUserMember.role !== TeamRole.ADMIN)) {
      throw new ForbiddenException('You do not have permission to remove members');
    }

    // Cannot remove yourself if you're the owner
    if (userId === memberId && currentUserMember.role === TeamRole.OWNER) {
      throw new BadRequestException('Team owner cannot remove themselves');
    }

    // Check if member exists
    const memberToRemove = team.members.find(m => m.userId === memberId);
    if (!memberToRemove) {
      throw new NotFoundException('Member not found');
    }

    // OWNER cannot be removed by ADMIN
    if (memberToRemove.role === TeamRole.OWNER && currentUserMember.role === TeamRole.ADMIN) {
      throw new ForbiddenException('Only owners can remove other owners');
    }

    await this.prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId: memberId,
          teamId,
        },
      },
    });

    // If removed member's current team was this team, update their current team
    const removedUser = await this.prisma.user.findUnique({
      where: { id: memberId },
    });

    // Team association is handled through TeamMember relation removal

    return { message: 'Member removed successfully' };
  }

  async switchTeam(userId: string, teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.members.length === 0) {
      throw new ForbiddenException('You are not a member of this team');
    }

    // Team association is handled through TeamMember relation

    return { message: 'Team switched successfully', team };
  }
}
