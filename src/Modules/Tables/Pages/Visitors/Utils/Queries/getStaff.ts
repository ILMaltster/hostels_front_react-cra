import { useQuery } from "@tanstack/react-query"
import { IFilter, IOrder, IPaginationModel, ISearch } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IVisitor } from "Modules/Tables/Models/models"

interface IGetVisitors {
    limit: number;
    offset: number;
    order?: IOrder<keyof IVisitor>;
    search?: ISearch<keyof IVisitor>;
    filter?: IFilter<keyof IVisitor>;
    forManualUpdateQuery: boolean;
}

export const useGetVisitors = ({limit, offset, order, search, filter, forManualUpdateQuery}: IGetVisitors) => {
    return useQuery<IPaginationModel<IVisitor>>({
        queryKey: ['getVisitors', limit, offset, order, search, filter, forManualUpdateQuery],
        queryFn: () => 
            Api.Get(
            `/visitors?` +
            `limit=${limit}&offset=${offset}` +
            `${!!order ? `&orderField=${order.field}&orderType=${order.type}` : ""}` +
            `${!!search?.value ? `&searchField=${search.field}&searchValue=${search.value}` : ""}` +
            `${!!filter?.field ? `&filterField=${filter.field}&filterOperator=${filter.operator}&filterValue=${filter.value}` : ""}`
        )
    })
}