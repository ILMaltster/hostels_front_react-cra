import { PATHS } from "routePaths";
import { StaffTablePage } from ".";
import { RouteObject } from "react-router-dom";

export const staffTableRoute: RouteObject = {
    path: PATHS.root.tables.staff.$path,
    element: <StaffTablePage />,
}