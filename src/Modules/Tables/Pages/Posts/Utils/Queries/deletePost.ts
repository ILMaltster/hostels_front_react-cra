import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"

export const useDeletePost = () => {
    return useMutation({
        mutationKey: ['deletePost'],
        mutationFn: (id: number) => Api.Delete(`/posts/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getPosts']}),
        onError: (e) => console.log(e)
    })
}