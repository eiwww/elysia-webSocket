export const auth = {
    IsAuth: async (ctx: any) => {
        let authorizaton = ctx.headers.authorization;
        if(!authorizaton) {
            ctx.set.status = 401;
            return { message: "Unauthorized" };
        }
        if (!authorizaton || !authorizaton.startsWith('Bearer ')) {
            ctx.set.status = 401
            return { message: "Unauthorized" }
        }
        const token = authorizaton.split(' ')[1]
        const user = await ctx.jwtAuth.verify(token);
        console.log(user);
        if(!user) {
            ctx.set.status = 401;
            return { message: "Unauthorized" };
        }
        ctx.loginUser = user;
    }
}