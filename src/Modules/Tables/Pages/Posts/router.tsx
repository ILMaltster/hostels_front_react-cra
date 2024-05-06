import { PATHS } from "routePaths";
import { PostsTablePage } from ".";
import { RouteObject } from "react-router-dom";

export const postsTableRoute: RouteObject = {
    path: PATHS.root.tables.posts.$path,
    element: <PostsTablePage />,
}