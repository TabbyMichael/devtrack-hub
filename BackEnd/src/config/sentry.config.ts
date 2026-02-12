import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function initializeSentry() {
    const dsn = process.env.SENTRY_DSN;

    if (!dsn) {
        console.warn('⚠️  SENTRY_DSN not configured. Error tracking disabled.');
        return;
    }

    Sentry.init({
        dsn: dsn,
        environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
        tracesSampleRate: 0.1,
        // Profling integration is handled differently in v10+
        // profilesSampleRate: 0.1,
    });

    console.log('✅ Sentry initialized');
}

export { Sentry };
