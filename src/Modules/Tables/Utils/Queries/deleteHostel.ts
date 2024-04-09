import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"

export const useDeleteHostel = () => {
    return useMutation({
        mutationKey: ['deleteHostel'],
        mutationFn: (tin: string) => Api.Delete(`/hostels/${tin}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getHostels']}),
        onError: (e) => console.log(e)
    })
}