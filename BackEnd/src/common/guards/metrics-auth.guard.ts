import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricsAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        // Allow in development without auth
        if (this.configService.get('NODE_ENV') === 'development') {
            return true;
        }

        // Require basic auth in production
        const metricsToken = this.configService.get('METRICS_TOKEN');

        if (!metricsToken) {
            // If no token configured, deny access in production
            throw new UnauthorizedException('Metrics endpoint requires authentication');
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid authorization header');
        }

        const token = authHeader.substring(7);
        if (token !== metricsToken) {
            throw new UnauthorizedException('Invalid metrics token');
        }

        return true;
    }
}
