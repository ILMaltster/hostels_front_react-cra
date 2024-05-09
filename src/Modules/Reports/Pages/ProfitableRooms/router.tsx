import { PATHS } from "routePaths";
import { RouteObject } from "react-router-dom";
import { ProfitableRoomsTablePage } from ".";

export const profitableRoomsTableRoute: RouteObject = {
    path: PATHS.root.reports.profitableRooms.$path,
    element: <ProfitableRoomsTablePage />,
}