/* eslint-disable */

import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";

describe('AuthController Test Suites', ()  => {
  let controller: AuthController;
  let mockAuthService = {
    register: jest.fn().mockImplementation((createUserDto: CreateUserDto) => ({
      user: {id: 1, ...createUserDto}
    }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },

        // {
        //   provide: APP_GUARD,
        //   useExisting: [JwtAuthGuard, LocalAuthGuard]
        // },
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be Defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return a user', async () => {
      const user: CreateUserDto = {
        firstname: 'Daniel',
        lastname: 'Okoronkwo',
        username: 'Varsiias',
        email: 'daniel@gmail.com',
        password: 'password',
        refreshToken: null

      }

      expect(await controller.registerUser(user)).toBe({
        user: {id: 1, ...user }
      })
      // expect(mockAuthService.register).toHaveBeenCalledWith(user)

  })

})