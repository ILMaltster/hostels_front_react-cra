import { PATHS } from "routePaths";
import { BookingsTablePage } from ".";
import { RouteObject } from "react-router-dom";

export const bookingsTableRoute: RouteObject = {
    path: PATHS.root.tables.bookings.$path,
    element: <BookingsTablePage />,
}