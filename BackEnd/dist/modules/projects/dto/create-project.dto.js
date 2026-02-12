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
exports.CreateProjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProjectDto {
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Mobile App Development',
        description: 'Project name',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.MinLength)(1, { message: 'Name must have at least 1 character' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#3B82F6',
        description: 'Project color (hex format: #RRGGBB or HSLA format)',
        pattern: '^(#[0-9A-Fa-f]{6}|hsla?\\(\\d+,\\s*\\d+%,\\s*\\d+%(,\\s*[0-9.]+)?\\))$',
    }),
    (0, class_validator_1.IsString)({ message: 'Color must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Color is required' }),
    (0, class_validator_1.Matches)(/^(#[0-9A-Fa-f]{6}|hsla?\(\d+,\s*\d+%,\s*\d+%(,\s*[0-9.]+)?\))$/, {
        message: 'Color must be a valid hex (#RRGGBB) or HSLA format',
    }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Building a cross-platform mobile application',
        description: 'Project description (optional)',
        maxLength: 500,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Description must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
//# sourceMappingURL=create-project.dto.js.map