import { useQuery } from "@tanstack/react-query"
import { IFilter, IOrder, IPaginationModel, ISearch } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IPost } from "Modules/Tables/Models/models"

interface IGetPosts {
    limit: number;
    offset: number;
    order?: IOrder<keyof IPost>;
    search?: ISearch<keyof IPost>;
    filter?: IFilter<keyof IPost>;
    forManualUpdateQuery: boolean;
}

export const useGetPosts = ({limit, offset, order, search, filter, forManualUpdateQuery}: IGetPosts) => {
    return useQuery<IPaginationModel<IPost>>({
        queryKey: ['getPosts', limit, offset,order, search, filter, forManualUpdateQuery],
        queryFn: () => 
            Api.Get(
            `/posts?` +
            `limit=${limit}&offset=${offset}` +
            `${!!order ? `&orderField=${order.field}&orderType=${order.type}` : ""}` +
            `${!!search?.value ? `&searchField=${search.field}&searchValue=${search.value}` : ""}` +
            `${!!filter?.field ? `&filterField=${filter.field}&filterOperator=${filter.operator}&filterValue=${filter.value}` : ""}`
        )
    })
}