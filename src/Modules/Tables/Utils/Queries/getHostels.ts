import { useQuery } from "@tanstack/react-query"
import { IOrder, IPaginationModel } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IHostel } from "Modules/Tables/Models/hostels"

interface IGetHostel {
    limit: number;
    offset: number;
    order?: IOrder<keyof IHostel>;
    forManualUpdateQuery: boolean;
}

export const useGetHostels = ({limit, offset, order, forManualUpdateQuery}: IGetHostel) => {
    return useQuery<IPaginationModel<IHostel>>({
        queryKey: ['getHostels', limit, offset, forManualUpdateQuery, order],
        queryFn: () => 
        Api.Get(`/hostels?limit=${limit}&offset=${offset}${order && `&orderField=${order.field}&orderType=${order.type}`}`)
    })
}