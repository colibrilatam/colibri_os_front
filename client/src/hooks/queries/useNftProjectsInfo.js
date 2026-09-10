'use client';

import { useQuery } from '@tanstack/react-query';
import { nftService } from '@/services/nft';
import { userService } from '@/services/user';
import { projectsService } from '@/services/project';
import { getProjectIC } from '@/lib/hooks/createIcMap';
import { queryKeys } from '@/lib/query-keys';

async function buildNftProjectsInfo() {
  const allProjects = await nftService.getNftProjects();

  if (!allProjects || !Array.isArray(allProjects)) {
    return [];
  }

  const projectsToEnrich = [];

  const flujoClave = allProjects.find(
    (project) => project.project?.projectName === 'FlujoClave',
  );

  if (flujoClave) {
    projectsToEnrich.push(flujoClave);
  }

  for (let i = 0; i < Math.min(2, allProjects.length); i++) {
    if (!projectsToEnrich.includes(allProjects[i])) {
      projectsToEnrich.push(allProjects[i]);
    }
  }

  const enriched = await Promise.all(
    projectsToEnrich.map(async (nftProject) => {
      const [user, tramo] = await Promise.all([
        userService.userData(nftProject.project.ownerUserId),
        projectsService.currentTramo(nftProject.project.currentTramoId),
      ]);

      return {
        nftProject,
        user,
        tramo,
        ic: getProjectIC(nftProject.project.projectName),
      };
    }),
  );

  return enriched;
}

export function useNftProjectsInfo(options = {}) {
  return useQuery({
    queryKey: [...queryKeys.nft.projects, 'info'],
    queryFn: buildNftProjectsInfo,
    ...options,
  });
}
