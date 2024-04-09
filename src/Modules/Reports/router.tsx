import { Reports } from "./index";
import { PATHS } from "../../routePaths";
import { RouteObject} from 'react-router-dom'

export const reportsRouter: RouteObject = {
    path: PATHS.root.reports.$path,
    element: <Reports />,
}