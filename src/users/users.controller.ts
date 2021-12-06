/* eslint-disable */
import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
// import { User } from './entities/user.entity'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly user: User
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    // console.log(username)
    return this.usersService.findUserByUsername(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // console.log(id)
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

}
