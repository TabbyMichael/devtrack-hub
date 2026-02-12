"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsModule = void 0;
const common_1 = require("@nestjs/common");
const sessions_controller_1 = require("./sessions.controller");
const sessions_service_1 = require("./sessions.service");
const session_gateway_1 = require("./session.gateway");
const prisma_module_1 = require("../../prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let SessionsModule = class SessionsModule {
};
exports.SessionsModule = SessionsModule;
exports.SessionsModule = SessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                }),
            }),
        ],
        controllers: [sessions_controller_1.SessionsController],
        providers: [sessions_service_1.SessionsService, session_gateway_1.SessionGateway],
        exports: [sessions_service_1.SessionsService, session_gateway_1.SessionGateway],
    })
], SessionsModule);
//# sourceMappingURL=sessions.module.js.map