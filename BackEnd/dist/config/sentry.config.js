"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sentry = void 0;
exports.initializeSentry = initializeSentry;
const Sentry = require("@sentry/node");
exports.Sentry = Sentry;
function initializeSentry() {
    const dsn = process.env.SENTRY_DSN;
    if (!dsn) {
        console.warn('⚠️  SENTRY_DSN not configured. Error tracking disabled.');
        return;
    }
    Sentry.init({
        dsn: dsn,
        environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
        tracesSampleRate: 0.1,
    });
    console.log('✅ Sentry initialized');
}
//# sourceMappingURL=sentry.config.js.map