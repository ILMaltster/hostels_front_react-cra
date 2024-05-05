import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IPost } from "Modules/Tables/Models/models"

export const useAddPost = () => {
    return useMutation({
        mutationKey: ['addPost'],
        mutationFn: (body: Omit<IPost, 'id'>) => Api.Post('/posts', {body: JSON.stringify(body)}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getPosts']}),
        onError: (e) => console.log(e)
    })
}