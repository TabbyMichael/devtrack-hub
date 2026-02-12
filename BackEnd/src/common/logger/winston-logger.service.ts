import { Injectable, Logger, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private logger: winston.Logger;
    private context?: string;

    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json(),
            ),
            defaultMeta: { service: 'devtrack-api' },
            transports: [
                // Console transport
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, context, trace }) => {
                            const ctx = context ? `[${context}]` : '';
                            return `${timestamp} ${level} ${ctx} ${message}${trace ? `\n${trace}` : ''}`;
                        }),
                    ),
                }),
                // File transport for errors
                new winston.transports.DailyRotateFile({
                    filename: path.join(process.env.LOG_DIR || 'logs', 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
                // File transport for all logs
                new winston.transports.DailyRotateFile({
                    filename: path.join(process.env.LOG_DIR || 'logs', 'combined-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            ],
        });
    }

    setContext(context: string) {
        this.context = context;
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context: context || this.context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, {
            context: context || this.context,
            trace,
        });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context: context || this.context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context: context || this.context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context: context || this.context });
    }
}
