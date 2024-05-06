import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IStaff } from "Modules/Tables/Models/models"

interface IEditStaffProps {
    tin: string;
    body: Partial<IStaff>;
}

export const useEditStaff = (onEditError: () => void, onSuccess: () => void) => {
    return useMutation({
        mutationKey: ['editStaff'],
        mutationFn: ({tin, body}: IEditStaffProps) => Api.Put(`/staff/${tin}`, {body: JSON.stringify(body)}).catch((error) => {throw error}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getStaff']});
            onSuccess();
        },
        onError: (err, variables)=> {
            onEditError();
            console.log(variables);

            throw err;
        }

    })
}