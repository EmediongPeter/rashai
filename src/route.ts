import { RouterModule } from "@nestjs/core";
import profileRoute from "@/profile/route/route";
import authRoute from "@/auth/route/route";

const routes = RouterModule.register([authRoute, profileRoute])

export default routes;