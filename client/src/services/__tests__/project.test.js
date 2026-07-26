import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectsService } from '../project.js';

vi.mock('@/lib/api', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return {
    apiClient: mockClient,
    default: mockClient,
  };
});

describe('projectsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CRUD operations', () => {
    it('getAll should return all projects', async () => {
      const mockProjects = [{ id: 1, name: 'Project 1' }];
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockProjects });

      const result = await projectsService.getAll();

      expect(result).toEqual(mockProjects);
      expect(apiClient.get).toHaveBeenCalledWith('/projects');
    });

    it('getById should return project by id', async () => {
      const mockProject = { id: 1, name: 'Project 1' };
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockProject });

      const result = await projectsService.getById(1);

      expect(result).toEqual(mockProject);
      expect(apiClient.get).toHaveBeenCalledWith('/projects/1');
    });

    it('create should create new project', async () => {
      const mockData = { name: 'New Project' };
      const mockResponse = { id: 1, ...mockData };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.create(mockData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/projects', mockData);
    });

    it('update should update project', async () => {
      const mockData = { name: 'Updated Project' };
      const mockResponse = { id: 1, ...mockData };
      const { apiClient } = await import('@/lib/api');
      apiClient.put.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.update(1, mockData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.put).toHaveBeenCalledWith('/projects/1', mockData);
    });

    it('delete should delete project', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.delete.mockResolvedValueOnce({ data: { success: true } });

      const result = await projectsService.delete(1);

      expect(result).toEqual({ success: true });
      expect(apiClient.delete).toHaveBeenCalledWith('/projects/1');
    });
  });

  describe('Tramos', () => {
    it('currentTramo should return current tramo', async () => {
      const mockTramo = { id: 1, name: 'Tramo 1' };
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockTramo });

      const result = await projectsService.currentTramo(1);

      expect(result).toEqual(mockTramo);
      expect(apiClient.get).toHaveBeenCalledWith('/tramos/1');
    });

    it('getAllTramos should return all tramos', async () => {
      const mockTramos = [{ id: 1 }, { id: 2 }];
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockTramos });

      const result = await projectsService.getAllTramos();

      expect(result).toEqual(mockTramos);
      expect(apiClient.get).toHaveBeenCalledWith('/tramos');
    });

    it('changeActiveTranche should change active tramo', async () => {
      const mockResponse = { success: true };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.changeActiveTranche(1, 2, 'Reason');

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/tramos/project/1/change', {
        newTramoId: 2,
        changeReason: 'Reason',
      });
    });
  });

  describe('Evidence', () => {
    it('evidences should return project evidences', async () => {
      const mockEvidences = [{ id: 1, title: 'Evidence 1' }];
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockEvidences });

      const result = await projectsService.evidences(1);

      expect(result).toEqual(mockEvidences);
      expect(apiClient.get).toHaveBeenCalledWith('/evidence/project/1');
    });

    it('requestUploadSignature should request signature', async () => {
      const mockData = { fileName: 'test.pdf' };
      const mockResponse = { signature: 'abc123' };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.requestUploadSignature(mockData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/evidence/request-upload-signature', mockData);
    });

    it('confirmUpload should confirm upload', async () => {
      const mockData = { evidenceId: 1, url: 'https://...' };
      const mockResponse = { success: true };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.confirmUpload(mockData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/evidence/confirm-upload', mockData);
    });
  });

  describe('Micro-actions', () => {
    it('microActionInstance should return micro-action instance', async () => {
      const mockInstance = { id: 1, status: 'pending' };
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockInstance });

      const result = await projectsService.microActionInstance(1);

      expect(result).toEqual(mockInstance);
      expect(apiClient.get).toHaveBeenCalledWith('/micro-action-instances/project/1');
    });

    it('updateMicroAction should update micro-action', async () => {
      const mockData = { status: 'completed' };
      const mockResponse = { id: 1, ...mockData };
      const { apiClient } = await import('@/lib/api');
      apiClient.patch.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.updateMicroAction(1, mockData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.patch).toHaveBeenCalledWith('/micro-action-instances/1', mockData);
    });

    it('createMicroActionInstance should create new instance', async () => {
      const mockData = { projectId: 1, pacId: 1 };
      const mockResponse = { id: 1, ...mockData };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.createMicroActionInstance(mockData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/micro-action-instances', mockData);
    });
  });

  describe('PACs and Categories', () => {
    it('categories should return categories by tramo', async () => {
      const mockCategories = [{ id: 1, name: 'Category 1' }];
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockCategories });

      const result = await projectsService.categories(1);

      expect(result).toEqual(mockCategories);
      expect(apiClient.get).toHaveBeenCalledWith('/categories?tramoId=1');
    });

    it('getPacs should return PACs by category', async () => {
      const mockPacs = [{ id: 1, code: 'PAC1' }];
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockPacs });

      const result = await projectsService.getPacs(1);

      expect(result).toEqual(mockPacs);
      expect(apiClient.get).toHaveBeenCalledWith('/pacs?categoryId=1');
    });

    it('createProjectPac should create project PAC', async () => {
      const mockResponse = { success: true };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.createProjectPac(1, 2);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/projects/1/pac/2');
    });
  });

  describe('Other operations', () => {
    it('nft should return project NFT', async () => {
      const mockNft = { id: 1, tokenId: '123' };
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockNft });

      const result = await projectsService.nft(1);

      expect(result).toEqual(mockNft);
      expect(apiClient.get).toHaveBeenCalledWith('/nft-projects/by-project/1');
    });

    it('getProjectMembers should return project members', async () => {
      const mockMembers = [{ id: 1, name: 'Member 1' }];
      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce({ data: mockMembers });

      const result = await projectsService.getProjectMembers(1);

      expect(result).toEqual(mockMembers);
      expect(apiClient.get).toHaveBeenCalledWith('/projects/1/members');
    });

    it('projectReputation should calculate reputation', async () => {
      const mockData = { projectId: 1 };
      const mockResponse = { score: 85 };
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await projectsService.projectReputation(mockData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/reputation/calculate', mockData);
    });
  });
});
