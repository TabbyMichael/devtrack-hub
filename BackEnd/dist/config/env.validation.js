"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
exports.validate = validate;
const Joi = require("joi");
exports.validationSchema = Joi.object({
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('15m'),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    PORT: Joi.number().default(3000),
    CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
    SENTRY_DSN: Joi.string().optional().empty('').allow(''),
    SENTRY_ENVIRONMENT: Joi.string().optional().allow(''),
    SENTRY_TRACES_SAMPLE_RATE: Joi.number().min(0).max(1).default(0.1),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().optional().allow(''),
    EMAIL_HOST: Joi.string().optional().allow(''),
    EMAIL_PORT: Joi.number().default(587),
    EMAIL_USER: Joi.string().optional().allow(''),
    EMAIL_PASSWORD: Joi.string().optional().allow(''),
    EMAIL_FROM: Joi.string().default('noreply@devtrack.com'),
    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug', 'verbose').default('info'),
    LOG_DIR: Joi.string().default('./logs'),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    METRICS_TOKEN: Joi.string().optional().allow(''),
    GITHUB_CLIENT_ID: Joi.string().optional().allow(''),
    GITHUB_CLIENT_SECRET: Joi.string().optional().allow(''),
    GITHUB_CALLBACK_URL: Joi.string().uri().optional().allow(''),
    GOOGLE_CLIENT_ID: Joi.string().optional().allow(''),
    GOOGLE_CLIENT_SECRET: Joi.string().optional().allow(''),
    GOOGLE_CALLBACK_URL: Joi.string().uri().optional().allow(''),
});
function validate(config) {
    const { error, value } = exports.validationSchema.validate(config, { allowUnknown: true });
    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }
    return value;
}
//# sourceMappingURL=env.validation.js.map