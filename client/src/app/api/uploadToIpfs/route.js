import { NextResponse } from "next/server";
import { pinata } from "@/config/pinata"

export async function POST(request) {
  try {
    
    const jsonMetadata = await request.json();
    const result = await pinata.upload.public.json(jsonMetadata);
    
    
    const ipfsHash = result.cid || result.IpfsHash;
    
   
    return NextResponse.json({ ipfsHash }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}