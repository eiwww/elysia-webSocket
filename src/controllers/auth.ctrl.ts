
import db from "../database";

export const AuthCtrl = {
    login: async (ctx: any) => {
        
        console.log(ctx);
        const user = await db.user.findFirst({
            where: {
                username: ctx.body.username
            }
        })
        if(!user) {
            ctx.set.status = 401;
            return {
                message: "Wrong email or password!!!"
            }
        }
        const verifyPassword = await Bun.password.verify(
            ctx.body.password,
            user.password,
            "bcrypt"
        )
        if(!verifyPassword) {
            ctx.set.status = 401;
            return {
                message: "Wrong email or password!!!"
            }
        }

        const accessToken = await ctx.jwtAuth.sign({
            id: user.id,
            name: user.name
        });

        return {
            message: "Login success",
            token: accessToken,
            id: user.id,
        }
    },
    getUserLogin: async (ctx: any) => {
        let profile = await db.user.findUnique({
            where: {
                id: ctx.loginUser.id
            }
        })
        return {
            avatar: profile?.profileImage,
            name: profile?.name,
            id: profile?.id,
            telephone: profile?.telephone,
        }
    }
}