import { PATHS } from "../../routePaths";
import { Navigate, RouteObject} from 'react-router-dom'
import { hostelsTableRoute } from "./Pages/Hostels/router";
import { FC } from "react";
import { Tables } from ".";
import { postsTableRoute } from "./Pages/Posts/router";
import { staffTableRoute } from "./Pages/Staff/router";
import { visitorsTableRoute } from "./Pages/Visitors/router";
import { hotelRoomsTableRoute } from "./Pages/Hotel-rooms/router";
import { bookingsTableRoute } from "./Pages/Bookings/router";

const IndexPage: FC = () => {console.log(1); return <Navigate to={PATHS.root.tables.hostels.$path}/>}


export const tablesRouter: RouteObject = {
    path: PATHS.root.tables.$path,

    children: [
        {
            index: true,
            element: <Tables />,
        },
        hostelsTableRoute,
        postsTableRoute,
        staffTableRoute,
        visitorsTableRoute,
        hotelRoomsTableRoute,
        bookingsTableRoute,
    ]
}