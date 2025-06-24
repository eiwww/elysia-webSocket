import { FriendCtrl } from "../controllers/friend.ctrl";
import { t } from "elysia";
import { auth } from "../middlewares/auth.middleware";

export function FriendRoute(app: any) {
    return app
        .get("/", FriendCtrl.getAllFriend, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Friend']
            }
        })
        .get("/people", FriendCtrl.getAllPeople, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            query: t.Object({
                search: t.Optional(t.String())
            }),
            detail: {
                tags: ['Friend']
            }
        })
        .get("/request", FriendCtrl.getRequestFriend, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Friend']
            }
        })
        .post("/add/:unknownUserId", FriendCtrl.addFriend, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                unknownUserId: t.Integer()
            }),
            detail: {
                tags: ['Friend']
            }
        })
        .post("/cancel/:unknownUserId", FriendCtrl.cancelAddFriend, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                unknownUserId: t.Integer()
            }),
            detail: {
                tags: ['Friend']
            }
        })
        .post("/decline/:unknownUserId", FriendCtrl.declineFriend, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
				unknownUserId: t.Integer()
			}),
            detail: {
                tags: ['Friend']
            }
        })
        .post("/accept/:unknownUserId", FriendCtrl.acceptFriend, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
				unknownUserId: t.Integer()
			}),
            detail: {
                tags: ['Friend']
            }
        })
}