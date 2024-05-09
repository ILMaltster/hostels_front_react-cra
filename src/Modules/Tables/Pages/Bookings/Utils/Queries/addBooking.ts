import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IBooking } from "Modules/Tables/Models/models"

export const useAddBooking = () => {
    return useMutation({
        mutationKey: ['addBooking'],
        mutationFn: (body: IBooking) => Api.Post('/bookings', {body: JSON.stringify(body)}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getBookings']}),
        onError: (e) => console.log(e)
    })
}