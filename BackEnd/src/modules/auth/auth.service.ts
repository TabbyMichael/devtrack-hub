import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists to prevent enumeration
      return { message: 'If an account with this email exists, a password reset link has been sent.' };
    }

    // Generate password reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save the reset token in the database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      } as any
    });

    // Send email with reset link
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './password-reset', // Use a template for the email
      context: {
        name: user.name,
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
      },
    });

    return { message: 'If an account with this email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Find user with the reset token
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gte: new Date(), // Ensure token hasn't expired
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password and clear reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      } as any,
    });

    return { message: 'Password reset successfully' };
  }

  async refreshTokens(dto: any) {
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const refreshToken = await this.jwtService.verifyAsync(dto.refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    if (refreshToken.userId !== user.id) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      ...tokens,
    };
  }

  async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      } as any),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET,
        } as any,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    // In a real implementation, you might want to store blacklisted tokens
    return { message: 'Logged out successfully' };
  }
}