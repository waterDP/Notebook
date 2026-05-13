import { Injectable } from '@nestjs/common';
import * as brcypt from 'bcrypt';

@Injectable()
export class UtilityService {
  async hashPassword(password: string): Promise<string> {
    // 生成盐
    const salt = await brcypt.genSalt();
    // 生成哈希值
    return brcypt.hash(password, salt);
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return brcypt.compare(password, hash);
  }
}
