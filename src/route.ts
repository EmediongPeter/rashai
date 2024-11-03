import { RouterModule } from "@nestjs/core";
import authRoute from "./modules/auth/route/route";

const routes = RouterModule.register([authRoute])

export default routes;