import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"

export const useDeleteVisitor = () => {
    return useMutation({
        mutationKey: ['deleteVisitor'],
        mutationFn: (id: string | number) => Api.Delete(`/visitors/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getVisitors']}),
        onError: (e) => console.log(e)
    })
}