import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashSync, compareSync } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { UserInput, AuthPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private isPasswordValid(text: string, hashedText: string): boolean {
    return compareSync(text, hashedText);
  }

  private hash(text: string): string {
    return hashSync(text, 8);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && this.isPasswordValid(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async isUniqueConstraintError(e) {
    return (
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'
    );
  }

  async login(input: UserInput): Promise<AuthPayload> {
    const user = await this.validateUser(input.email, input.password);
    if (!user) throw new UnauthorizedException();
    const token = this.jwtService.sign({ email: user.email, sub: user.id });
    return { token };
  }

  async signup(input: UserInput): Promise<AuthPayload> {
    try {
      const user = await this.usersService.create({
        ...input,
        password: this.hash(input.password),
      });
      const token = this.jwtService.sign({ email: user.email, sub: user.id });
      return { token };
    } catch (e) {
      if (this.isUniqueConstraintError(e)) {
        throw new ConflictException(`Email ${input.email} already used.`);
      } else {
        throw new Error(e);
      }
    }
  }
}
