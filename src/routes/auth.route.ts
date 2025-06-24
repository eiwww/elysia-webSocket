import { AuthCtrl } from "../controllers/auth.ctrl";
import { auth } from "../middlewares/auth.middleware";
import { t } from "elysia";

export function AuthRoute(app: any) {
    return app
        .post("/login", AuthCtrl.login, {
            body: t.Object({
                username: t.String(),
                password: t.String()
            }),
            detail: {
                tags: ['Auth']
            }
        })
        .get("/user", AuthCtrl.getUserLogin, {
            beforeHandle: auth.IsAuth,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ['Auth']
            }
        })
}