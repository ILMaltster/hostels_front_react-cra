import { useQuery } from "@tanstack/react-query"
import { IFilter, IPaginationModel } from "Common/Models"
import { Api } from "Common/Utils/Api"
import { IBooking } from "Modules/Tables/Models/models"

interface IGetFrequentCustomerProps {
    limit: number;
    offset: number;
    hostelId: number | string;
}

export const useGetFrequentCustomer = ({limit, offset, hostelId}: IGetFrequentCustomerProps) => {
    return useQuery<IPaginationModel<IBooking>>({
        queryKey: ['getFrequentCustomer', limit, offset, hostelId],
        queryFn: () => 
            Api.Get(
            `/reports/frequentCustomer?` +
            `limit=${limit}&offset=${offset}` +
            `&hostelId=${hostelId}`
        )
    })
}