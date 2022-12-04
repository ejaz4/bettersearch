import { apiRoutes } from "./api";
import { staticRoutes } from "./static";

export const setRoutes = () => {
    apiRoutes();
    staticRoutes();
}