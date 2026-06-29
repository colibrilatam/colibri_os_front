"use client";
import { useWalletClient } from "wagmi"; 
import WalletConnection from "@/app/WalletConnection";
import axios from "axios";
import CreateIpAsset from "../web3/CreateIpAsset";

export default function AdquireNft(){

    const { data: wallet, isLoading, isError, error } = useWalletClient();

    async function handleUpdate () {
        try {
            // 1. Hacemos un fetch a la ruta pública del archivo
            const response = await fetch("/evidencia.pdf");
            
            // 2. Convertimos la respuesta en un Blob (datos binarios)
            const blob = await response.blob();
            
            // 3. (Opcional) Lo convertimos en un objeto File
            const file = new File([blob], "evidencia.pdf", { type: "application/pdf" });

            // 4. Creamos un FormData para enviar el archivo correctamente
            const formData = new FormData();
            formData.append("file", file); // "file" es el nombre del campo que recibirá tu API

            // 5. Enviamos la petición POST
            const upload = await axios.post("/api/uploadFileToIpfs", formData, {
                headers: {
                    // Es importante indicar que enviamos un formulario con archivos
                    "Content-Type": "multipart/form-data", 
                },
            });
            
            console.log("Subida exitosa:", upload.data);
        } catch (err) {
            console.error("Error subiendo el archivo:", err);
        }
    }

    /*useEffect(() => {
        if(isError){
            console.log(error);
        }
        if (!wallet) {
            console.log('no wallet');
            return;
        }
    }, [wallet]);*/

    if(isError){
        console.log(error);
    }

    return(
        <div className="glass-effect border-glass p-4 rounded-2xl my-8 gap-4 flex flex-col">
            <h1 className="text-(--text-primary)">Adquirir NFT</h1>
            <button className="primary-button" onClick={() => handleUpdate()}>subir archivo de prueba</button>
            <p className="text-(--text-secondary)">Adquiere un NFT para vincularlo a un proyecto y guardar su progreso en Data Fundation.</p>
            { isLoading ? (<p>Cargando wallet...</p>)
            :
            isError ? (<p>Error al cargar wallet</p>) 
            :
            wallet ? (
                ""
            )
            :
            (
                
                    <p className="text-(--text-primary)">Para adquirir un NFT, primero debes conectarte a una wallet.</p>
                
            )}
            <WalletConnection />
            <CreateIpAsset />
            
        </div>
    )
}