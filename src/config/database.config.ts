/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    async createTypeOrmOptions() {
        return await this.configService.get('database');
    }
}