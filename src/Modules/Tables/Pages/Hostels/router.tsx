import { PATHS } from "routePaths";
import { HostelsTablePage } from ".";
import { RouteObject } from "react-router-dom";

export const hostelsTableRoute: RouteObject = {
    path: PATHS.root.tables.hostels.$path,
    element: <HostelsTablePage />,
}