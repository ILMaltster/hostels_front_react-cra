import { Navigate, createBrowserRouter, useRouteLoaderData } from "react-router-dom";
import { PATHS } from "./routePaths";
import { tablesRouter } from "./Modules/Tables/router";
import { FC } from "react";
import { Layout } from "./Modules/Layout";
import { reportsRouter } from "./Modules/Reports/router";

const Home: FC = () => <Navigate to={PATHS.root.tables.$path}/>

export const rootRouter = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: PATHS.root.$path,
                element: <Home/>
            },
            tablesRouter,
            reportsRouter,
            {
                path: '*',
                element: <Home/>
            }
        ]
    }

])