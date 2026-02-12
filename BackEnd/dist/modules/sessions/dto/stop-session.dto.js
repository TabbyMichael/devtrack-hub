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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class StopSessionDto {
}
exports.StopSessionDto = StopSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Completed feature implementation and code review',
        description: 'Session notes (optional, max 2000 characters)',
        maxLength: 2000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Notes must be a string' }),
    (0, class_validator_1.MaxLength)(2000, { message: 'Notes must not exceed 2000 characters' }),
    __metadata("design:type", String)
], StopSessionDto.prototype, "notes", void 0);
//# sourceMappingURL=stop-session.dto.js.map