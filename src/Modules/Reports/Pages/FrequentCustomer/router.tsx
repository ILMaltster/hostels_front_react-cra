import { PATHS } from "routePaths";
import { RouteObject } from "react-router-dom";
import { FrequentCustomerTablePage } from ".";

export const frequentCustomerTableRoute: RouteObject = {
    path: PATHS.root.reports.frequentCustomer.$path,
    element: <FrequentCustomerTablePage />,
}