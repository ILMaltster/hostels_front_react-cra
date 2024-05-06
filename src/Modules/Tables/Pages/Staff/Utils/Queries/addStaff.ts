import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IStaff } from "Modules/Tables/Models/models"

export const useAddStaff = () => {
    return useMutation({
        mutationKey: ['addStaff'],
        mutationFn: (body: Omit<IStaff, 'hostel_id'>) => Api.Post('/staff', {body: JSON.stringify(body)}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getStaff']}),
        onError: (e) => console.log(e)
    })
}