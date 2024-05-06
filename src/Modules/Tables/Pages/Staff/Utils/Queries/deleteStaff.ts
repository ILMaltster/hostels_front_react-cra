import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"

export const useDeleteStaff = () => {
    return useMutation({
        mutationKey: ['deleteStaff'],
        mutationFn: (tin: string) => Api.Delete(`/staff/${tin}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getStaff']}),
        onError: (e) => console.log(e)
    })
}