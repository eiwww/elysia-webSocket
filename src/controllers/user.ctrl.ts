import db from "../database";

export const UserCtrl = {
	createUser: async (ctx: any) => {
		const password = await Bun.password.hash(
			ctx.body.password,
			{
				algorithm: "bcrypt",
			}
		);
		let fileName = "";
		const profileImage = ctx.body.profileImage as File[];
		if(profileImage != null && profileImage.length > 0) {
			const ext = "." + profileImage[0].name.split(".")[1];
			const uuid = crypto.randomUUID();
			fileName = uuid + ext;
			await Bun.write('images/' + fileName, profileImage[0]);
		}
		let user = await db.user.create({
			data: {
				username: ctx.body.username,
				password: password,
				telephone: ctx.body.telephone,
				name: ctx.body.name,
				profileImage: fileName,
				// posts: {
				// 	create: {
				// 		title: "Hello World",
				// 		content: "This is my first post"
				// 	}
				// }
			}
		})
		return {
			message: "User created",
			data: user
		}
	},
	getUser: async (ctx: any) => {
		let user = await db.user.findUnique({
			where: {
				id: ctx.params.userId
			},
			include: {
				posts: true
			}
		});
		return {
			message: "User found",
			data: user
		}
	},
	getAllUser: async (ctx: any) => {
		const users = await db.user.findMany({
			select: {
				id: true,
				username: true,
				name: true,
				telephone: true,
				friends: {
				  select: {
					id: true,
					userId: true,
					friendId: true,
					friend: {
					  select: {
						name: true,
						telephone: true,
					  },
					},
				  },
				  where: {
					deletedAt: null,
				  },
				},
			  },
		});
		return {
			message: "Fetch all users",
			data: users
		}
	},
	updateUser: async (ctx: any) => {
		const userData = await db.user.findUnique({
			where: {
				id: ctx.params.userId
			}
		});
		if(!userData) {
			return {
				message: "User not found",
				data: null
			}
		}
		let fileName = userData.profileImage;;
		const profileImage = ctx.body.profileImage as File[];
		if(profileImage != null && profileImage.length > 0) {
			const ext = "." + profileImage[0].name.split(".")[1];
			const uuid = crypto.randomUUID();
			fileName = uuid + ext;
			await Bun.write('images/' + fileName, profileImage[0]);
		}
		let user = await db.user.update({
			where: {
				id: ctx.params.userId
			},
			data: {
				username: ctx.body.username,
				password: ctx.body.password,
				telephone: ctx.body.telephone,
				profileImage: fileName
			}
		})
		return {
			message: "User updated",
			data: user
		}
	},
	deleteUser: async (ctx: any) => {
		let user = await db.user.delete({
			where: {
				id: ctx.params.userId
			}
		})
		return {
			message: "User deleted",
			data: user
		}
	}
}