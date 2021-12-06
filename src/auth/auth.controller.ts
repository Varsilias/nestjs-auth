/* eslint-disable */
import { Controller, Request, Post, Get, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpCode } from '@nestjs/common';
import { TokenPayload } from './token-payload';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }
    @UsePipes(ValidationPipe)
    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto)
    }

    @HttpCode(200)
    @Post('refresh')
    async refresh(@Body() tokenPayload: TokenPayload) {
        return await this.authService.getNewRefreshToken(tokenPayload.refreshToken);
    }


    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('login')
    async login(@Request() request) {
        return await this.authService.login(request.user);

    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Get('profile')
    getProfile(@Request() request) {
        return request.user;
    }

    @UseGuards(JwtAuthGuard) 
    @HttpCode(200)
    @Post('logout')
    async logout(@Request() request)  {
        return await this.authService.logoutUser(request.user.id)
    }
}