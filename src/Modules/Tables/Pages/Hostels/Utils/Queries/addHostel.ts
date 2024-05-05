import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IHostel } from "Modules/Tables/Models/models"

export const useAddHostel = () => {
    return useMutation({
        mutationKey: ['addHostel'],
        mutationFn: (body: Omit<IHostel, 'id'>) => Api.Post('/hostels', {body: JSON.stringify(body)}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getHostels']}),
        onError: (e) => console.log(e)
    })
}