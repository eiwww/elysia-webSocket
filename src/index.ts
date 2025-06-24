import { Elysia, t } from "elysia";
import { MainRoute } from "./routes/index.route"
import { swagger } from "@elysiajs/swagger"
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { ElysiaWS } from "elysia/dist/ws";
import db from "./database";
import { webSocket } from "./services/webSocket";

// const userSockets = new Map<string, ElysiaWS>();

const app = new Elysia()
	.get("/demo", () => {
		return "Hello Elysia!";
	})
    // .ws('/ws', {
    //     async open(ws) {
    //         const { userId } = ws.data.query;
    //         let user = await db.user.findFirst({
    //             where: { id: parseInt(userId) }
    //         });
    //         console.log(userId + " Connected--------");
    //         userSockets.set(userId, ws);
    //         ws.subscribe('public');
    //         ws.publish('public', JSON.stringify({
    //             type: 'online',
    //             message: `${user?.name} is online`,
    //             time: Date.now()
    //         }))
    //     },
    //     async message(ws, message: any) {
    //         const { userId } = ws.data.query;
    //         console.log("list");
    //         console.log(message);

    //         if (message.type === 'private' && message.receiverId) {
    //             console.log(message.receiverId.toString());
    //             const target = userSockets.get(message.receiverId.toString());
    //             console.log(userSockets);
    //             if (target) {
    //                 let senderUser = await db.user.findFirst({
    //                     where: { id: parseInt(message.receiverId) }
    //                 });
    //                 target.send(JSON.stringify({
    //                     content: message.content,
    //                     senderId: userId,
    //                     receiverId: message.receiverId,
    //                     type: 'private',
    //                     time: Date.now(),
    //                     senderName: senderUser?.name
    //                 }));
    //             }
    //         } else if (message.type === 'notify' && message.receiverId) {
    //             const target = userSockets.get(message.receiverId);
    //             if (target) {
    //                 target.send(JSON.stringify({
    //                     message: message.content,
    //                     senderId: userId,
    //                     receiverId: message.receiverId,
    //                     type: 'notification',
    //                     time: Date.now(),
    //                 }));
    //             }
    //         } 
    //         // else {
    //         //     // default to group broadcast
    //         //     ws.publish(room, {
    //         //         message: message.content,
    //         //         name,
    //         //         time: Date.now()
    //         //     });
    //         // }
    //     },
    //     close(ws) {
    //         const { userId } = ws.data.query;
    //         userSockets.delete(userId);
    //         console.log("close...........");
    //     },
    // })
    .use(webSocket)
	.use(swagger(
		{
			// provider: "swagger-ui",
			path: "/api-docs"
		}
	))
    .use(cors())
	.use(jwt(
		{
			name: "jwtAuth",
			secret: Bun.env.JWT_SECRET!,
			exp: "7d"
		}
	))
    .use(staticPlugin({
        assets: 'images',
        prefix: '/image',
    }))
	.group("/api/v1", MainRoute)
	// .listen(Bun.env.PORT || 5000);
    .listen({
        port: Bun.env.PORT || 5000,
        hostname: '0.0.0.0'
    });

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} !`
);
