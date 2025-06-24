import db from '../database';
import { Elysia } from "elysia"; 
import { ElysiaWS } from "elysia/dist/ws"

const userSockets = new Map<string, ElysiaWS>();

export const webSocket = new Elysia().ws('/ws', {
    async open(ws) {
        const { userId } = ws.data.query;
        let user = await db.user.findFirst({
            where: { id: parseInt(userId) }
        });
        console.log(userId + " Connected--------");
        userSockets.set(userId, ws);
        ws.subscribe('public');
        ws.publish('public', JSON.stringify({
            type: 'online',
            message: `${user?.name} is online`,
            time: Date.now()
        }))
    },
    async message(ws, message: any) {
        const { userId } = ws.data.query;
        console.log("list");
        console.log(message);

        if (message.type === 'private' && message.receiverId) {
            console.log(message.receiverId.toString());
            const target = userSockets.get(message.receiverId.toString());
            console.log(userSockets);
            if (target) {
                let senderUser = await db.user.findFirst({
                    where: { id: parseInt(message.receiverId) }
                });
                target.send(JSON.stringify({
                    content: message.content,
                    senderId: userId,
                    receiverId: message.receiverId,
                    type: 'private',
                    time: Date.now(),
                    senderName: senderUser?.name
                }));
            }
        } else if (message.type === 'notify' && message.receiverId) {
            const target = userSockets.get(message.receiverId);
            if (target) {
                target.send(JSON.stringify({
                    message: message.content,
                    senderId: userId,
                    receiverId: message.receiverId,
                    type: 'notification',
                    time: Date.now(),
                }));
            }
        } 
        // else {
        //     // default to group broadcast
        //     ws.publish(room, {
        //         message: message.content,
        //         name,
        //         time: Date.now()
        //     });
        // }
    },
    close(ws) {
        const { userId } = ws.data.query;
        userSockets.delete(userId);
        console.log("close...........");
    },
});