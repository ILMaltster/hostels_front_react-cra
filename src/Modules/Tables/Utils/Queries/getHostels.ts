import { useQuery } from "@tanstack/react-query"
import { IFilter, IOrder, IPaginationModel, ISearch } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IHostel } from "Modules/Tables/Models/hostels"

interface IGetHostel {
    limit: number;
    offset: number;
    order?: IOrder<keyof IHostel>;
    search?: ISearch<keyof IHostel>;
    filter?: IFilter<keyof IHostel>;
    forManualUpdateQuery: boolean;
}

const addQueryParams = (params: Record<string, (string | number | undefined)>, firstParam: boolean = false): string => {
    console.log(params, firstParam);
    if (Object.values(params).some(value => !value)) return "";
    return Object.entries(params).reduce((acc, curr, index) => acc += `${firstParam && index === 0 ? '?' : '&'}${[curr]}=${curr}`, "")
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
            `${!!filter?.value ? `&filterField=${filter.field}&filterOperator=${filter.operator}&filterValue=${filter.value}` : ""}`
        )
    })
}