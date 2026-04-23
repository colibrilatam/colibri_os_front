import { fetcher } from '@/lib/fetcher';
import { handleRequest } from '@/lib/handleRequest';
import { userService } from './user';



export const nftService = {

    getStats: (userId) =>
        fetcher(`/mecenas-semilla/dashboard/${userId}`),

    create: (data, userId) => 
        fetcher(`/mecenas-semilla/buy-nfts/${userId}`, { method: 'POST', body: JSON.stringify(data) }),

    createNftProject: (data, projectId) =>
        fetcher(`/nft-projects/${projectId}`, { method: 'POST', body: JSON.stringify(data) }),

    getNftProjects: () =>
        fetcher('/nft-projects'),
       
}