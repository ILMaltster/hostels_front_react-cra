import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IHotelRoom } from "Modules/Tables/Models/models"

export const useAddHotelRoom = () => {
    return useMutation({
        mutationKey: ['addHotelRoom'],
        mutationFn: (body: IHotelRoom) => Api.Post('/hotelRooms', {body: JSON.stringify(body)}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getHotelRooms']}),
        onError: (e) => console.log(e)
    })
}