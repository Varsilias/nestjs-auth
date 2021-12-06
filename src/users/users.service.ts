/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ResponseWrapper } from 'src/utils/ResponseWrapper';
import { HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService
  ) { }
  
  async register(createUserDto: CreateUserDto): Promise<ResponseWrapper> {

    const password = await bcrypt.hash(createUserDto.password, parseInt(this.configService.get('SALT')));
    const newUser = this.usersRepository.create({ ...createUserDto, password });
    const user = await this.usersRepository.save(newUser);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      error: false,
      data: this.destructureResponse(user)
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();
      return users;
    } catch (error) {
      throw new HttpException('No users in the database', HttpStatus.NOT_FOUND);
    } 
  }

  findOne(id: number) {
    try {
      const user = this.usersRepository.findOneOrFail(id)
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByUsername(username: any) {
    try {
      const users = await this.usersRepository.find();
      const user = users.find(user => user.username == username)
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, parseInt(this.configService.get('SALT')));
    await this.usersRepository.update(userId, {
      hashedRefreshToken: currentHashedRefreshToken
    });
  }

  async removeRefreshToken(userId: number): Promise<ResponseWrapper> {
    await this.usersRepository.update(userId, {
      hashedRefreshToken: null
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'User logged out successfully',
      error: false,
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    try {
        const user = await this.findOne(userId);
        const isRefreshTokenMatching = await bcrypt.compare(
          refreshToken,
          user.hashedRefreshToken
        );
        if (!isRefreshTokenMatching) {
          throw new HttpException("Refresh token mismatch", HttpStatus.BAD_REQUEST);
        }
        return user;
    } catch (error) {
      throw new HttpException("Refresh token mismatch", HttpStatus.BAD_REQUEST);
    } 
  }
  
  private destructureResponse(response: User): Object {
    const { id, firstname, lastname, username, email } = response;
    return { id, firstname, lastname, username, email }
  }

}
