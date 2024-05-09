import { useMutation } from "@tanstack/react-query"
import { queryClient } from "App"
import { Api } from "Common/Utils/Api"
import { IBooking } from "Modules/Tables/Models/models"


interface IEditHotelRoomProps {
    id: number;
    body: Partial<IBooking>;
}

export const useEditBooking = (onEditError: () => void, onSuccess: () => void) => {
    return useMutation({
        mutationKey: ['editBooking'],
        mutationFn: ({id, body}: IEditHotelRoomProps) => 
            Api.Put(
                `/bookings/${id}`, 
                {body: JSON.stringify(body)}).catch((error) => {throw error}
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getBookings']});
            onSuccess();
        },
        onError: (err, variables)=> {
            onEditError();
            console.log(variables);

            throw err;
        }

    })
}