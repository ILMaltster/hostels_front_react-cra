import { useQuery } from "@tanstack/react-query"
import { IFilter, IOrder, IPaginationModel, ISearch } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IHotelRoom } from "Modules/Tables/Models/models"

interface IGetHotelRooms {
    limit: number;
    offset: number;
    order?: IOrder<keyof IHotelRoom>;
    search?: ISearch<keyof IHotelRoom>;
    filter?: IFilter<keyof IHotelRoom>;
    forManualUpdateQuery: boolean;
}

export const useGetHotelRooms = ({limit, offset, order, search, filter, forManualUpdateQuery}: IGetHotelRooms) => {
    return useQuery<IPaginationModel<IHotelRoom>>({
        queryKey: ['getHotelRooms', limit, offset, order, search, filter, forManualUpdateQuery],
        queryFn: () => 
            Api.Get(
            `/hotelRooms?` +
            `limit=${limit}&offset=${offset}` +
            `${!!order ? `&orderField=${order.field}&orderType=${order.type}` : ""}` +
            `${!!search?.value ? `&searchField=${search.field}&searchValue=${search.value}` : ""}` +
            `${!!filter?.field ? `&filterField=${filter.field}&filterOperator=${filter.operator}&filterValue=${filter.value}` : ""}`
        )
    })
}