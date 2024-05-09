import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IVisitor } from "Modules/Tables/Models/models"

interface IEditVisitorProps {
    id: number;
    body: Partial<IVisitor>;
}

export const useEditVisitor = (onEditError: () => void, onSuccess: () => void) => {
    return useMutation({
        mutationKey: ['editStaff'],
        mutationFn: ({id, body}: IEditVisitorProps) => Api.Put(`/visitors/${id}`, {body: JSON.stringify(body)}).catch((error) => {throw error}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getVisitors']});
            onSuccess();
        },
        onError: (err, variables)=> {
            onEditError();
            console.log(variables);

            throw err;
        }

    })
}