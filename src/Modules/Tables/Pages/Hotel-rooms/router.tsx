import { PATHS } from "routePaths";
import { HotelRoomsTablePage } from ".";
import { RouteObject } from "react-router-dom";

export const hotelRoomsTableRoute: RouteObject = {
    path: PATHS.root.tables.hotelRooms.$path,
    element: <HotelRoomsTablePage />,
}