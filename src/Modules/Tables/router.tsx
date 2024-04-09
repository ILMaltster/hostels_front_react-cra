import { Tables } from "./index";
import { PATHS } from "../../routePaths";
import { RouteObject} from 'react-router-dom'

export const tablesRouter: RouteObject = {
    path: PATHS.root.tables.$path,
    element: <Tables />,
}