import { PATHS } from "../../routePaths";
import { Navigate, RouteObject} from 'react-router-dom'
import { hostelsTableRoute } from "./Pages/Hostels/router";
import { FC } from "react";
import { Tables } from ".";

const IndexPage: FC = () => {console.log(1); return <Navigate to={PATHS.root.tables.hostels.$path}/>}


export const tablesRouter: RouteObject = {
    path: PATHS.root.tables.$path,
    element: <Tables />,
    children: [
        hostelsTableRoute,
    ]
}