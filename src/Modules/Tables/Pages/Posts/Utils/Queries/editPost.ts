import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IPost } from "Modules/Tables/Models/models"

interface IEditPostProps {
    id: number;
    body: Partial<IPost>;
}

export const useEditPost = (onEditError: () => void, onSuccess: () => void) => {
    return useMutation({
        mutationKey: ['editPost'],
        mutationFn: ({id, body}: IEditPostProps) => Api.Put(`/posts/${id}`, {body: JSON.stringify(body)}).catch((error) => {throw error}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getPosts']});
            onSuccess();
        },
        onError: (err, variables)=> {
            onEditError();
            console.log(variables);

            throw err;
        }

    })
}