import { NextResponse } from "next/server";
import { pinata } from "@/config/pinata";

export async function POST(request) {
  try {
    // Obtener el archivo del form-data
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No se encontró ningún archivo" },
        { status: 400 }
      );
    }

    // Subir el archivo a Pinata
    const upload = await pinata.upload.public.file(file);

    // Extraer el CID
    const ipfsHash = upload.cid || upload.IpfsHash;

    return NextResponse.json(
      {
        ipfsHash,
        name: upload.name,
        size: upload.size,
        mimeType: upload.mime_type,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json(
      { error: "Error al subir el archivo", details: error.message },
      { status: 500 }
    );
  }
}

// Next.js necesita saber que esto no es estático
export const dynamic = "force-dynamic";