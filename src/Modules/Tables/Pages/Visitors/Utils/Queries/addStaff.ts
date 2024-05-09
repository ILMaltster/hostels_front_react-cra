import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IStaff, IVisitor } from "Modules/Tables/Models/models"

export const useAddVisitor = () => {
    return useMutation({
        mutationKey: ['addVisitor'],
        mutationFn: (body: Omit<IVisitor, 'id'>) => Api.Post('/visitors', {body: JSON.stringify(body)}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getVisitors']}),
        onError: (e) => console.log(e)
    })
}