import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"

interface IDeleteHotelRoomProps {
    hotel_id: number | string;
    hotel_room_number: number | string;
}

export const useDeleteHotelRoom = () => {
    return useMutation({
        mutationKey: ['deleteHotelRoom'],
        mutationFn: (identityObj: IDeleteHotelRoomProps) => 
            Api.Delete(`/hotelRooms/${identityObj.hotel_id}/${identityObj.hotel_room_number}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getHotelRooms']}),
        onError: (e) => console.log(e)
    })
}