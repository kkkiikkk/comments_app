// Core
import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';

export class UserEntity implements User {
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  username: string;

  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
