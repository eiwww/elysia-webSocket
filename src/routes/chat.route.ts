import { Elysia, t } from "elysia";
import { ChatCtrl } from "../controllers/chat.ctrl";
import { auth } from "../middlewares/auth.middleware";

export function ChatRoute(app: Elysia) {
    return app
        .get("/:friendId", ChatCtrl.getChat, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                friendId: t.Integer()
            }),
            detail: {
                tags: ['Chat']
            }
        })
        .post("/:friendId", ChatCtrl.addMessage, {
            
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            params: t.Object({
                friendId: t.Integer()
            }),
            body: t.Object({
                content: t.String(),
                sessionId: t.Integer()
            }),
            detail: {
                tags: ['Chat']
            }
        })
}