import { useUploadToIpfs } from "@/hooks/useUploadToIpfs";
import { useUserStore } from "@/lib/store";

export default async function CreateIpAsset(title, description, imageUrl, imageHash, mediaUrl, mediaHash, mediaType, creators) {
    const { client, storyClientError: error, storyClientLoading: isLoading } = {
      client: useUserStore.getState().storyClient,
      storyClientError: useUserStore.getState().storyClientError,
      storyClientLoading: useUserStore.getState().storyClientLoading,
    };
    if(!client) {
        console.log('no wallet');
        return null;
    };
    const ipMetadata = {
    title,
    description,
    imageUrl,
    imageHash,
    mediaUrl,
    mediaHash,
    mediaType,
    creators
  };

  const nftMetadata = {
    name: "Ownership NFT",
    description: "This is an NFT representing owernship of our IP Asset.",
    image: "https://picsum.photos/200",
  };

  const ipIpfsHash = await useUploadToIpfs(ipMetadata);
  const ipHash = createHash("sha256")
    .update(JSON.stringify(ipMetadata))
    .digest("hex");
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
  const nftHash = createHash("sha256")
    .update(JSON.stringify(nftMetadata))
    .digest("hex");

    console.log('IPFS RESPONSE', ipIpfsHash, ipHash, nftIpfsHash, nftHash);

}
