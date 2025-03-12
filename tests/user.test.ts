// tests/user.test.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('User Model', () => {
  it('should create a new user', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        password: 'testpassword',
      },
    });

    expect(user).toHaveProperty('id');
    expect(user.username).toBe('testuser');
    expect(user.password).toBe('testpassword');
  });

  it('should retrieve a user', async () => {
    const user = await prisma.user.findUnique({
      where: {
        username: 'testuser',
      },
    });

    expect(user).not.toBeNull();
    expect(user?.username).toBe('testuser');
  });

  it('should update a user', async () => {
    const updatedUser = await prisma.user.update({
      where: {
        username: 'testuser',
      },
      data: {
        name: 'Test User',
      },
    });

    expect(updatedUser.name).toBe('Test User');
  });

  it('should delete a user', async () => {
    const deletedUser = await prisma.user.delete({
      where: {
        username: 'testuser',
      },
    });

    expect(deletedUser).not.toBeNull();
  });
});