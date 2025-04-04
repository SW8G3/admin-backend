// tests/user.test.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { beforeAll, afterAll, describe, it, expect } = require('@jest/globals');

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('User Model', () => {
  it('should create a new user', async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        password: hashedPassword,
      },
    });

    expect(user).toHaveProperty('id');
    expect(user.username).toBe('testuser');
    const isPasswordValid = await bcrypt.compare('testpassword', user.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should not allow creating a user with an existing username', async () => {
    const hashedPassword = await bcrypt.hash('anotherpassword', 10);
    await expect(
      prisma.user.create({
        data: {
          username: 'testuser', // Username already exists
          password: hashedPassword,
        },
      })
    ).rejects.toThrow(); // Expect an error to be thrown
  });

  it('should retrieve a user', async () => {
    const user = await prisma.user.findUnique({
      where: {
        username: 'testuser',
      },
    });

    expect(user).not.toBeNull();
    expect(user.username).toBe('testuser');
  });


  it('should update a user', async () => {
    const hashedPassword = await bcrypt.hash('newpassword', 10);
    const updatedUser = await prisma.user.update({
      where: {
        username: 'testuser',
      },
      data: {
        password: hashedPassword,
      },
    });

    expect(updatedUser).not.toBeNull();
    const isPasswordValid = await bcrypt.compare('newpassword', updatedUser.password);
    expect(isPasswordValid).toBe(true);
  });

  
  it('should delete a user', async () => {
    const deletedUser = await prisma.user.delete({
      where: {
        username: 'testuser',
      },
    });

    expect(deletedUser).not.toBeNull();
    expect(deletedUser.username).toBe('testuser');
  });

});