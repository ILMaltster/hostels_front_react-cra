import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IHotelRoom } from "Modules/Tables/Models/models"

interface IEditHotelRoomIdentity {
    hotel_id: number | string;
    hotel_room_number: number | string;
}

interface IEditHotelRoomProps {
    identityObj: IEditHotelRoomIdentity;
    body: Partial<IHotelRoom>;
}

export const useEditHotelRoom = (onEditError: () => void, onSuccess: () => void) => {
    return useMutation({
        mutationKey: ['editStaff'],
        mutationFn: ({identityObj, body}: IEditHotelRoomProps) => 
            Api.Put(
                `/hotelRooms/${identityObj.hotel_id}/${identityObj.hotel_room_number}`, 
                {body: JSON.stringify(body)}).catch((error) => {throw error}
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getHotelRooms']});
            onSuccess();
        },
        onError: (err, variables)=> {
            onEditError();
            console.log(variables);

            throw err;
        }

    })
}