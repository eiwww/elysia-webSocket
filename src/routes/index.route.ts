import { TestRoute } from "./test.route";
import { UserRoute } from "./user.route";
import { EmployeeRoute } from "./employee.route";
import { AuthRoute } from "./auth.route";
import { FriendRoute } from "./friend.route";
import { ChatRoute } from "./chat.route";

export function MainRoute(app: any) {
	return app
		.group("/test", TestRoute)
		.group("/user", UserRoute)
		.group("/employee", EmployeeRoute)
		.group("/auth", AuthRoute)
		.group("/friend", FriendRoute)
		.group("/chat", ChatRoute);
}