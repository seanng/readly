import { Inject, Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcrypt';

@Injectable()
export class EncryptionService {
  hash(text: string): string {
    return hashSync(text, 8);
  }

  isValid(text: string, hashedText: string): boolean {
    return compareSync(text, hashedText);
  }
}
