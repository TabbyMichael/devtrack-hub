import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, InviteMemberDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Teams')
@Controller({ path: 'teams', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or slug already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@GetUser('id') userId: string, @Body() dto: CreateTeamDto) {
    return this.teamsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams for the current user' })
  @ApiResponse({ status: 200, description: 'Teams retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@GetUser('id') userId: string) {
    return this.teamsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiResponse({ status: 200, description: 'Team retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not a team member' })
  findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.teamsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a team' })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiResponse({ status: 200, description: 'Team deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete team with active projects or members' })
  @ApiResponse({ status: 403, description: 'Forbidden - only team owners can delete' })
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.teamsService.remove(userId, id);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite a member to the team' })
  @ApiResponse({ status: 201, description: 'Member invited successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 400, description: 'User already a member' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  inviteMember(
    @GetUser('id') userId: string,
    @Param('id') teamId: string,
    @Body() dto: InviteMemberDto,
  ) {
    return this.teamsService.inviteMember(userId, teamId, dto);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept team invitation' })
  @ApiResponse({ status: 200, description: 'Invitation accepted successfully' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({ status: 400, description: 'Invitation already accepted' })
  acceptInvitation(
    @GetUser('id') userId: string,
    @Param('id') teamId: string,
  ) {
    return this.teamsService.acceptInvitation(userId, teamId);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from the team' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 404, description: 'Team or member not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 400, description: 'Cannot remove team owner' })
  removeMember(
    @GetUser('id') userId: string,
    @Param('id') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamsService.removeMember(userId, teamId, memberId);
  }

  @Post(':id/switch')
  @ApiOperation({ summary: 'Switch to a different team' })
  @ApiResponse({ status: 200, description: 'Team switched successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not a team member' })
  switchTeam(
    @GetUser('id') userId: string,
    @Param('id') teamId: string,
  ) {
    return this.teamsService.switchTeam(userId, teamId);
  }
}