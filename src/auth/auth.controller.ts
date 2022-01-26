/* eslint-disable */
import { Controller, Request, Post, Get, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TokenDto } from './dto/token.dto';
import { HttpCode } from '@nestjs/common';

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

    @UsePipes(ValidationPipe)
    @HttpCode(200)
    @Post('refresh')
    async refresh(@Body() tokenDto: TokenDto) {
        return await this.authService.getNewRefreshToken(tokenDto.refreshToken);
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
        return this.authService.getUserDetails(request.user.id);
    }

    @UseGuards(JwtAuthGuard) 
    @HttpCode(200)
    @Post('logout')
    async logout(@Request() request)  {
        return await this.authService.logoutUser(request.user.id)
    }
}