import { useQuery } from "@tanstack/react-query"
import { IPaginationModel } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IBooking } from "Modules/Tables/Models/models"

export interface IGetProfitableRoomsFilter {
    from: Date,
    to: Date,
}

interface IGetProfitableRoomsProps {
    limit: number;
    offset: number;
    filter: IGetProfitableRoomsFilter;
}

export const useGetProfitableRooms = ({limit, offset, filter}: IGetProfitableRoomsProps) => {
    return useQuery<IPaginationModel<IBooking>>({
        queryKey: ['getProfitableRooms', limit, offset, filter],
        queryFn: () => 
            Api.Get(
            `/reports/profitableRooms?` +
            `limit=${limit}&offset=${offset}` +
            `&from=${filter.from.toJSON()}&to=${filter.to.toJSON()}`
        )
    })
}