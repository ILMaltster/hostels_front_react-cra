import { PATHS } from "routePaths";
import { VisitorsTablePage } from ".";
import { RouteObject } from "react-router-dom";

export const visitorsTableRoute: RouteObject = {
    path: PATHS.root.tables.visitors.$path,
    element: <VisitorsTablePage />,
}