import { User as PrismaUser } from '@prisma/client';

type UserResponse = Omit<PrismaUser, 'password'>;

const UserResponseSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export { UserResponse, UserResponseSelect };
