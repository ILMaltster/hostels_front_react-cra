import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"


export const useDeleteBooking = () => {
    return useMutation({
        mutationKey: ['deleteBooking'],
        mutationFn: (id: string | number) => 
            Api.Delete(`/bookings/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getBookings']}),
        onError: (e) => console.log(e)
    })
}