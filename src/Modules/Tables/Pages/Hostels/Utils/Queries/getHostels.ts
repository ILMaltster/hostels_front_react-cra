import { useQuery } from "@tanstack/react-query"
import { IFilter, IOrder, IPaginationModel, ISearch } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IHostel } from "Modules/Tables/Models/models"

interface IGetHostel {
    limit: number;
    offset: number;
    order?: IOrder<keyof IHostel>;
    search?: ISearch<keyof IHostel>;
    filter?: IFilter<keyof IHostel>;
    forManualUpdateQuery: boolean;
}

export const useGetHostels = ({limit, offset, order, search, filter, forManualUpdateQuery}: IGetHostel) => {
    return useQuery<IPaginationModel<IHostel>>({
        queryKey: ['getHostels', limit, offset,order, search, filter, forManualUpdateQuery],
        queryFn: () => 
            Api.Get(
            `/hostels?` +
            `limit=${limit}&offset=${offset}` +
            `${!!order ? `&orderField=${order.field}&orderType=${order.type}` : ""}` +
            `${!!search?.value ? `&searchField=${search.field}&searchValue=${search.value}` : ""}` +
            `${!!filter?.field ? `&filterField=${filter.field}&filterOperator=${filter.operator}&filterValue=${filter.value}` : ""}`
        )
    })
}