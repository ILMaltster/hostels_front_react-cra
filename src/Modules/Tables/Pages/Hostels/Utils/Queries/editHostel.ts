import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IHostel } from "Modules/Tables/Models/models"

interface IEditHostelProps {
    tin: string;
    body: Partial<IHostel>;
}

export const useEditHostel = (onEditError: () => void, onSuccess: () => void) => {
    return useMutation({
        mutationKey: ['editHostel'],
        mutationFn: ({tin, body}: IEditHostelProps) => Api.Put(`/hostels/${tin}`, {body: JSON.stringify(body)}).catch((error) => {throw error}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getHostels']});
            onSuccess();
        },
        onError: (err, variables)=> {
            onEditError();
            console.log(variables);

            throw err;
        }

    })
}