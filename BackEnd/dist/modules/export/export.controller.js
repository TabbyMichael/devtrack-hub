"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportController = void 0;
const common_1 = require("@nestjs/common");
const export_service_1 = require("./export.service");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const swagger_1 = require("@nestjs/swagger");
let ExportController = class ExportController {
    constructor(exportService) {
        this.exportService = exportService;
    }
    async exportCSV(userId, fromDate, toDate, projectId, res) {
        try {
            const csv = await this.exportService.exportSessionsCSV(userId, fromDate, toDate, projectId);
            const filename = `sessions-${Date.now()}.csv`;
            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', `attachment; filename="${filename}"`);
            res.status(common_1.HttpStatus.OK).send(csv);
        }
        catch (error) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: error.message,
            });
        }
    }
    async exportJSON(userId, fromDate, toDate, projectId, res) {
        try {
            const data = await this.exportService.exportSessionsJSON(userId, fromDate, toDate, projectId);
            const filename = `sessions-${Date.now()}.json`;
            res.header('Content-Type', 'application/json');
            res.header('Content-Disposition', `attachment; filename="${filename}"`);
            res.status(common_1.HttpStatus.OK).json(data);
        }
        catch (error) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: error.message,
            });
        }
    }
};
exports.ExportController = ExportController;
__decorate([
    (0, common_1.Get)('sessions/csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Export sessions as CSV' }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String, example: '2024-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String, example: '2024-12-31' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV file generated successfully' }),
    __param(0, (0, decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('projectId')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportCSV", null);
__decorate([
    (0, common_1.Get)('sessions/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Export sessions as JSON' }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String, example: '2024-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String, example: '2024-12-31' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'JSON file generated successfully' }),
    __param(0, (0, decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('projectId')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportJSON", null);
exports.ExportController = ExportController = __decorate([
    (0, swagger_1.ApiTags)('Export'),
    (0, common_1.Controller)({ path: 'export', version: '1' }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [export_service_1.ExportService])
], ExportController);
//# sourceMappingURL=export.controller.js.map