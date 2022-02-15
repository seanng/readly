import { Test, TestingModule } from '@nestjs/testing';
import { AuthPayload, UserInput } from './auth.interface';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  interface MockAuthService {
    login: jest.Mock<Promise<AuthPayload>>;
  }

  let mockAuthService: MockAuthService;
  let mockAuthPayload: AuthPayload;
  let controller: AuthController;

  beforeEach(async () => {
    mockAuthPayload = {
      id: '123',
      email: 'fake@email.com',
      token: 'token-abc123',
    };
    mockAuthService = {
      login: jest.fn().mockResolvedValue(mockAuthPayload),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('login', () => {
    it('calls service.login and returns correct response', async () => {
      const { email } = mockAuthPayload;
      const body = { email, password: 'abc123' };
      await controller.login(body);
      expect(await controller.login(body)).toBe(mockAuthPayload);
      expect(mockAuthService.login).toBeCalledWith(body);
    });
  });
});
