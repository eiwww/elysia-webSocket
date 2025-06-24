import { Elysia, t } from "elysia";
import { UserCtrl } from "../controllers/user.ctrl";

export function UserRoute(app: Elysia) {
	return app
		.post("/", UserCtrl.createUser, {
			body: t.Object({
				username: t.String(),
				password: t.String(),
				telephone: t.String(),
				profileImage: t.Optional(t.Files()),
				name: t.String(),
			}),
			detail: {
				tags: ['User']
			}
		})
		.get("/:userId", UserCtrl.getUser, {
			params: t.Object({
				userId: t.Integer()
			}),
			detail: {
				tags: ['User']
			}
		})
		.get("/", UserCtrl.getAllUser, {
			detail: {
				tags: ['User']
			}
		})
		.put("/:userId", UserCtrl.updateUser, {
			params: t.Object({
				userId: t.Integer()
			}),
			body: t.Object({
				username: t.String(),
				password: t.String(),
				telephone: t.String(),
				profileImage: t.Optional(t.Files()),
				name: t.String(),
			}),
			detail: {
				tags: ['User']
			}
		})
		.delete("/:userId", UserCtrl.deleteUser, {
			params: t.Object({
				userId: t.Integer()
			}),
			detail: {
				tags: ['User']
			}
		})
}