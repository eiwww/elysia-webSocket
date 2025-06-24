import db from "../database";

export const ChatCtrl = {
    getChat: async (ctx: any) => {
        const friendId = ctx.params.friendId;
        const loginUserId = ctx.loginUser.id;

        const session = await db.session.findMany({
            where: {
                OR: [
                    {
                        firstUser: friendId,
                        secondUser: loginUserId,
                    },
                    {
                        firstUser: loginUserId,
                        secondUser: friendId,
                    }
                ],
                deletedAt: null
            }
        });
        let sessionId = session[0]?.id || 0;
        let sessionRoom = session[0]?.sessionId || 0;
        if (session.length === 0) {
            sessionRoom = crypto.randomUUID();
            const createSession = await db.session.create({
                data: {
                    firstUser: loginUserId,
                    secondUser: friendId,
                    sessionId: sessionRoom
                }
            });
            sessionId = createSession.id;
        }
        const chat = await db.message.findMany({
            where: {
                sessionId: sessionId,
            },
            orderBy: {
                timestamp: "asc"
            }
        });
        return {
            message: "Chat Connect",
            data: {
                id: sessionId,
                room: sessionRoom,
                message: chat
            }
        }
    },

    addMessage: async (ctx: any) => {
        const receiverId = ctx.params.friendId;
        const senderId = ctx.loginUser.id;

        const message = await db.message.create({
            data: {
                senderId: senderId,
                receiverId: receiverId,
                content: ctx.body.content,
                sessionId: ctx.body.sessionId
            }
        })

        console.log(message);
    }
}