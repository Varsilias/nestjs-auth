/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) { }

    async register(createUserDto: CreateUserDto) {
        return await this.usersService.register(createUserDto);
    }

    async validateUser(username: string, password: string): Promise<any> {
        try {
            const user = await this.usersService.findUserByUsername(username);
            const isPasswordMatch = await this.verifyPassword(password, user.password);

            if (user && isPasswordMatch) {
                const { password, hashedRefreshToken,...result } = user;
                return result;
            }
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        const refreshToken = await this.getRefreshTokenCookie(user.id);
        await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
        return { 
            accessToken: this.jwtService.sign(payload),
            expiresIn: `${parseInt(this.configService.get('JWT_ACCESS_TOKEN_EXPIRY'))}s`,
            refreshToken,
            user
        };
    }

    async getRefreshTokenCookie(id: number): Promise<string> {
        const payload = { id };
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: parseInt(this.configService.get('JWT_REFRESH_TOKEN_EXPIRY'))
        }) 

        return refreshToken;
    }

    async getNewRefreshToken(refreshToken: string) {
        try {
            const verifiedToken = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            })
            const { id } = verifiedToken
            const user = await this.usersService.getUserIfRefreshTokenMatches(refreshToken, id)
            return this.login(await this.removeEncryptedData(user))

        } catch (error) {
            throw new HttpException('Invalid Token provided', HttpStatus.BAD_REQUEST);
        }
    }

    async getUserDetails(id: number) {
        const user = await this.usersService.findOne(id);
        return await this.removeEncryptedData(user);
    }
    async logoutUser(userId: number) {
        return await this.usersService.removeRefreshToken(userId);
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
        return isPasswordMatching;
    }

    private async removeEncryptedData(user: User) {
        const { password, hashedRefreshToken, ...rest } = user;
        return rest;
    }
}
