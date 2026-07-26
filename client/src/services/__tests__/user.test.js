import { describe, it, expect } from 'vitest';
import { userService } from '../user.js';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';

describe('userService', () => {
  describe('profile', () => {
    it('should return user profile data', async () => {
      const result = await userService.profile();
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'CEO',
      });
    });
  });

  describe('userData', () => {
    it('should return user data by id', async () => {
      const result = await userService.userData(42);
      expect(result).toEqual({
        id: 42,
        email: 'user@example.com',
        fullName: 'User Test',
      });
    });
  });
});
