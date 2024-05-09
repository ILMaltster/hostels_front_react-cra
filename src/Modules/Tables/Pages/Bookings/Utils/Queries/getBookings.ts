import { useQuery } from "@tanstack/react-query"
import { IFilter, IOrder, IPaginationModel, ISearch } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IBooking, IHotelRoom } from "Modules/Tables/Models/models"

interface IGetBookings {
    limit: number;
    offset: number;
    order?: IOrder<keyof IBooking>;
    search?: ISearch<keyof IBooking>;
    filter?: IFilter<keyof IBooking>;
    forManualUpdateQuery: boolean;
}

export const useGetBookings = ({limit, offset, order, search, filter, forManualUpdateQuery}: IGetBookings) => {
    return useQuery<IPaginationModel<IBooking>>({
        queryKey: ['getBookings', limit, offset, order, search, filter, forManualUpdateQuery],
        queryFn: () => 
            Api.Get(
            `/bookings?` +
            `limit=${limit}&offset=${offset}` +
            `${!!order ? `&orderField=${order.field}&orderType=${order.type}` : ""}` +
            `${!!search?.value ? `&searchField=${search.field}&searchValue=${search.value}` : ""}` +
            `${!!filter?.field ? `&filterField=${filter.field}&filterOperator=${filter.operator}&filterValue=${filter.value}` : ""}`
        )
    })
}