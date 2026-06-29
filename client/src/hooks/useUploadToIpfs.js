import { pinata } from "@/config/pinata"

export const useUploadToIpfs = async (metadata) => {
const { IpfsHash } = await pinata.upload.public.json(metadata);
  return IpfsHash;
}