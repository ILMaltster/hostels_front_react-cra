import { useQuery } from "@tanstack/react-query"
import { IPaginationModel } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IHostel } from "Modules/Tables/Models/hostels"

export const useGetHostels = ({limit, offset}: {limit: number, offset: number}) => {
    return useQuery<IPaginationModel<IHostel>>({
        queryKey: ['getHostels', limit, offset],
        queryFn: () => 
        Api.Get(`/hostels?limit=${limit}&offset=${offset}`)
    })
}