import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nftService } from '../nft.js';

vi.mock('@/lib/api', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
  };
  return {
    apiClient: mockClient,
    default: mockClient,
  };
});

describe('nftService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return user NFT stats', async () => {
      const mockStats = { totalNfts: 5, totalValue: 1000 };
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockStats });

      const result = await nftService.getStats(1);

      expect(result).toEqual(mockStats);
      expect(apiClient.get).toHaveBeenCalledWith('/mecenas-semilla/dashboard/1');
    });
  });

  describe('create', () => {
    it('should create NFT purchase', async () => {
      const mockData = { nftId: 1, price: 100 };
      const mockResponse = { id: 1, ...mockData };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await nftService.create(mockData, 1);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/mecenas-semilla/buy-nfts/1', mockData);
    });
  });

  describe('createNftProject', () => {
    it('should create NFT project', async () => {
      const mockData = { name: 'Test NFT', metadata: 'ipfs://...' };
      const mockResponse = { id: 1, ...mockData };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await nftService.createNftProject(mockData, 1);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/nft-projects/1', mockData);
    });
  });

  describe('getNftProjects', () => {
    it('should return all NFT projects', async () => {
      const mockProjects = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }];
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockProjects });

      const result = await nftService.getNftProjects();

      expect(result).toEqual(mockProjects);
      expect(apiClient.get).toHaveBeenCalledWith('/nft-projects');
    });
  });
});
