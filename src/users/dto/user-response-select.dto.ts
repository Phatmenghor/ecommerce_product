import { User as PrismaUser } from '@prisma/client';

type UserResponse = Omit<PrismaUser, 'password'>;

type userResponse = {
  id: boolean;
  email: boolean;
  role: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  gender: boolean;
  birthdate: boolean;
  address: boolean;
  phoneNumber: boolean;
  isActive: boolean;
  avatar: boolean;
  username: boolean;
  userID: boolean;
  latitude: boolean;
  longitude: boolean;
};

const UserResponseSelect: userResponse = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  gender: true,
  birthdate: true,
  address: true,
  phoneNumber: true,
  isActive: true,
  avatar: true,
  username: true,
  userID: true,
  latitude: true,
  longitude: true,
};

export { UserResponse, UserResponseSelect };
