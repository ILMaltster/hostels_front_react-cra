import { ReportsList } from ".";
import { PATHS } from "../../routePaths";
import { RouteObject} from 'react-router-dom'
import { frequentCustomerTableRoute } from "./Pages/FrequentCustomer/router";
import { profitableRoomsTableRoute } from "./Pages/ProfitableRooms/router";

export const reportsRouter: RouteObject = {
    path: PATHS.root.reports.$path,
    children: [
        {
            index: true,
            element: <ReportsList />,
        },
        frequentCustomerTableRoute,
        profitableRoomsTableRoute,
    ]
}