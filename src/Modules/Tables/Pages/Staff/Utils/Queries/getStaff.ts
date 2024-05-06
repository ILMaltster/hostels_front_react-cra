import { useQuery } from "@tanstack/react-query"
import { IFilter, IOrder, IPaginationModel, ISearch } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IStaff } from "Modules/Tables/Models/models"

interface IGetPosts {
    limit: number;
    offset: number;
    order?: IOrder<keyof IStaff>;
    search?: ISearch<keyof IStaff>;
    filter?: IFilter<keyof IStaff>;
    forManualUpdateQuery: boolean;
}

export const useGetStaff = ({limit, offset, order, search, filter, forManualUpdateQuery}: IGetPosts) => {
    return useQuery<IPaginationModel<IStaff>>({
        queryKey: ['getStaff', limit, offset,order, search, filter, forManualUpdateQuery],
        queryFn: () => 
            Api.Get(
            `/staff?` +
            `limit=${limit}&offset=${offset}` +
            `${!!order ? `&orderField=${order.field}&orderType=${order.type}` : ""}` +
            `${!!search?.value ? `&searchField=${search.field}&searchValue=${search.value}` : ""}` +
            `${!!filter?.field ? `&filterField=${filter.field}&filterOperator=${filter.operator}&filterValue=${filter.value}` : ""}`
        )
    })
}