import { Navigate, createBrowserRouter, useRouteLoaderData } from "react-router-dom";
import { PATHS } from "./routePaths";
import { tablesRouter } from "./Modules/Tables/router";
import { FC } from "react";
import { Layout } from "./Modules/Layout";
import { reportsRouter } from "./Modules/Reports/router";

const Home: FC = () => <Navigate to={PATHS.root.tables.$path}/>

export const rootRouter = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            tablesRouter,
            reportsRouter,
            {
                path: '*',
                element: <Home/>
            }
        ]
    }

])