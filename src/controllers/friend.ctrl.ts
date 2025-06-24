import db from "../database";
import { Prisma } from "@prisma/client";

export const FriendCtrl = {
    getAllPeople: async (ctx: any) => {
        const search = ctx.query.search || "";
        const loginUserId = ctx.loginUser.id;
        const people = await db.user.findMany({
            where: {
                name: {
                    contains: search
                },
                id: {
                    not: loginUserId
                },
                deletedAt: null
            },
            select: {
                name: true,
                telephone: true,
                id: true,
                username: true,
                profileImage: true,
                friendOf: {
                    where: {
                        userId: loginUserId,
                        deletedAt: null
                    },
                    select: {
                        id: true,
                        friendId: true,
                    }
                },
                sentRequests: {
                    where: {
                        receiverId: loginUserId,
                        deletedAt: null
                    },
                    select: {
                        id: true,
                        status: true,
                        senderId: true,
                        receiverId: true,
                        sender: {
                            select: {
                                name: true,
                                telephone: true,
                            }
                        }
                    },
                },
                receivedRequests: {
                    where: {
                        senderId: loginUserId,
                        deletedAt: null
                    },
                    select: {
                        id: true,
                        status: true,
                        senderId: true,
                        receiverId: true,
                        receiver: {
                            select: {
                                name: true,
                                telephone: true,
                            }
                        }
                    },
                },
            }
        })
        return {
            message: "Fetch all friends",
            data: people
        }
    },
    getAllFriend: async (ctx: any) => {
        console.log(ctx.loginUser);
        const loginUserId = ctx.loginUser.id;
        const friend = await db.friendList.findMany({
            include: {
                friend: {
                    select: {
                        name: true,
                        telephone: true,
                    }
                } 
            },
            where: {
                userId: loginUserId,
                deletedAt: null
            }
        })
        return {
            message: "Fetch all friends",
            data: friend
        }
    },
    getRequestFriend: async (ctx: any) => {
        const loginUserId = ctx.loginUser.id;
        const friendRequest = await db.friendRequest.findMany({
            include: {
                sender: {
                    select: {
                        name: true,
                        telephone: true
                    }
                }
            },
            where: {
                receiverId: loginUserId,
                status: "PENDING",
                deletedAt: null
            }
        })
        return {
            message: "Fetch all friend requests",
            data: friendRequest
        }
    },
    addFriend: async (ctx: any) => {
        const unknownUserId = ctx.params.unknownUserId;
        const loginUserId = ctx.loginUser.id;
        console.log(ctx);
        const checkRequest = await db.friendRequest.findMany({
            where: {
                OR: [
                    {
                        senderId: loginUserId,
                        receiverId: unknownUserId,
                        status: "PENDING",
                        deletedAt: null
                    },
                    {
                        senderId: unknownUserId,
                        receiverId: loginUserId,
                        status: "PENDING",
                        deletedAt: null
                    }
                ]
            }
        })
        if(checkRequest.length > 0) {
            ctx.set.status = 400;
            return {
                message: "Ths request already have",
                data: checkRequest
            }
        }
        const friend = await db.friendRequest.create({
            data: {
                senderId: loginUserId,
                receiverId: unknownUserId,
                status: "PENDING",
            }
        })
        return {
            message: "Friend request sent",
            data: friend
        }
    },
    cancelAddFriend: async (ctx: any) => {
        let unknownUserId = ctx.params.unknownUserId;
        const loginUserId = ctx.loginUser.id;
        const friendRequest = await db.friendRequest.findFirst({
            where: {
                senderId: loginUserId,
                receiverId: unknownUserId,
                status: "PENDING",
                deletedAt: null
            }
        })
        const friend = await db.friendRequest.update({
            data: {
                status: "DECLINED",
            },
            where: {
                id: friendRequest?.id
            }
        })
        return {
            message: "Friend request cancel",
            data: friend
        }
    },
    declineFriend: async (ctx: any) => {
        let unknownUserId = ctx.params.unknownUserId;
        const loginUserId = ctx.loginUser.id;
        const friendRequest = await db.friendRequest.findFirst({
            where: {
                senderId: unknownUserId,
                receiverId: loginUserId,
                status: "PENDING",
            }
        })
        const friend = await db.friendRequest.update({
            data: {
                status: "DECLINED",
            },
            where: {
                id: friendRequest?.id
            }
        })
        return {
            message: "Friend request decline",
            data: friend
        }
    },
    acceptFriend: async (ctx: any) => {
        let unknownUserId = ctx.params.unknownUserId;
        const loginUserId = ctx.loginUser.id;
        const friendRequest = await db.friendRequest.findFirst({
            where: {
                senderId: unknownUserId,
                receiverId: loginUserId,
                status: "PENDING",
            }
        })
        await db.friendRequest.update({
            data: {
                status: "ACCEPTED",
            },
            where: {
                id: friendRequest?.id
            }
        })
        const friend = await db.friendList.createMany({
            data: [
                {
                    userId: loginUserId,
                    friendId: unknownUserId,
                },
                {
                    userId: unknownUserId,
                    friendId: loginUserId
                }
            ]
        })
        return friend;
    }
}