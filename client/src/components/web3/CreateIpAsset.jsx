"use client";
import { useWalletClient } from "wagmi";
import { useStoryClient } from "../../hooks/useStoryClient";
import { useEffect, useState } from "react";
import { getHashFromUrl } from "../../hooks/useSha256FromUrl";
import axios from "axios";
import { createHash } from "crypto";

export default function CreateIpAsset() {

  const { data: wallet, isLoading, isError, error } = useWalletClient();
  const [dataClient, setDataClient] = useState(null);

  useEffect(() => {
    if (isError) {
      console.log(error);
      return;
    };
    if (!wallet) {
      console.log('no wallet');
      return;
    };

    const client = useStoryClient(wallet);
    if (client) {
      if (client.error) {
        console.log(client.error);
        return;
      }
      else {
        setDataClient(client);
      };
    };
  }, [wallet]);

  async function handleCreateIpAsset(evidenceUrl) {
    if (!dataClient) {
      console.log("no client or client has error");
      return;
    }
    if (!evidenceUrl) {
      console.log("no evidenceUrl");
      return;
    }

    try{

    const evidenceSha256 = await getHashFromUrl(evidenceUrl);
    if(!evidenceSha256){
      console.log("error getting evidence sha256");
      return;
    }

    const ipMetadata = {
      title: "Ippy",
      description: "Official mascot of the DATA Foundation.",
      image:
        evidenceUrl,
      imageHash:
        evidenceSha256,
      mediaUrl:
        evidenceUrl,
      mediaHash:
        evidenceSha256,
      mediaType: "pdf",
      creators: [
        {
          name: "The DATA Foundation",
          address: "0x67ee74EE04A0E6d14Ca6C27428B27F3EFd5CD084",
          description: "The World's IP Blockchain",
          contributionPercent: 100,
          socialMedia: [
            {
              platform: "Twitter",
              url: "https://x.com/DataFDN",
            },
            {
              platform: "Website",
              url: "https://datafdn.org",
            },
          ],
        },
      ],
    };
    const nftMetadata = {
      name: "Ownership NFT",
      description: "This is an NFT representing owernship of our IP Asset.",
      image: "https://picsum.photos/200",
    };

    const ipResult = await axios.post("/api/uploadToIpfs", ipMetadata);
    const ipIpfsHash = ipResult.data.ipfsHash;
    const nftResult = await axios.post("/api/uploadToIpfs", nftMetadata);
    const nftIpfsHash = nftResult.data.ipfsHash;
    //console.log(ipResult, ipResult.data.ipfsHash, ipIpfsHash);
    //console.log(nftIpfsHash);


    const ipHash = createHash("sha256")
    .update(JSON.stringify(ipMetadata))
    .digest("hex");

    const nftHash = createHash("sha256")
    .update(JSON.stringify(nftMetadata))
    .digest("hex");

    console.log(ipHash.length); // debe ser 64
console.log(nftHash.length); // debe ser 64



    console.log(nftHash, ipHash);

    const response = await dataClient.ipAsset.registerIpAsset({
    nft: {
      type: "mint",
      spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc",
    },
    ipMetadata: {
      ipMetadataURI: `https://maroon-fantastic-goat-709.mypinata.cloud/ipfs/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataURI: `https://maroon-fantastic-goat-709.mypinata.cloud/ipfs/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}`,
    },
  });
  console.log("hola")
  console.log(response);


    
    }
    catch(e){
      console.log(e)
      //console.log(e.error)
    }

  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-(--text-primary)">Crear un registro IP en The Data Fundation</h2>
      <button className="primary-button" 
      onClick={() => handleCreateIpAsset("https://maroon-fantastic-goat-709.mypinata.cloud/ipfs/bafkreias5dkqys3fkirka63npgcynjmkw5cfmakpwmg5tvxferqogdqi7i")}
      >Crear registro IP</button>
    </div>
  )
}