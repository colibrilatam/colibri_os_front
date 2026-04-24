import { handleRequest } from "@/lib/handleRequest";
import ErrorScreen from "@/components/ErrorScreen";
import { authService } from "@/services/authService";
import { redirect } from "next/navigation";
import { projectsService } from "@/services/project";

export default async function ProjectLayout({ children }){

    const { data: user, error } = await handleRequest(() => authService.userData());
    const { data: projectData, error: projectError } = await handleRequest(() => projectsService.getAll());

    if(projectData){
        if(projectData.find((p) => p.ownerUserId === user.sub)){ 
            const userProject = projectData.find((p) => p.ownerUserId === user.sub);
            redirect(`/dashboard/${userProject.id}/senial`);
        return;  
        }
}
    

    return(
        <>
        {children}
        </>
    )
}