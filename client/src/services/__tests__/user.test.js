import { describe, it, expect } from 'vitest';
import { userService } from '../user.js';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';

describe('userService', () => {
  describe('profile', () => {
    it('should return user profile data', async () => {
      const result = await userService.profile();
      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'entrepreneur',
        status: 'active',
        provider: 'local',
        linkedinId: null,
        googleId: null,
        cryptoWallet: null,
        credentialsWallet: null,
        adnHash: null,
        bio: null,
        avatar: null,
        gender: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });
  });

  describe('userData', () => {
    it('should return user data by id', async () => {
      const result = await userService.userData('123e4567-e89b-12d3-a456-426614174000');
      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'entrepreneur',
        status: 'active',
        provider: 'local',
        linkedinId: null,
        googleId: null,
        cryptoWallet: null,
        credentialsWallet: null,
        adnHash: null,
        bio: null,
        avatar: null,
        gender: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });
  });
});
