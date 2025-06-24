import db from "../database";

export const EmployeeCtrl = {
    getAllEmployee: async (ctx: any) => {
        const employees = await db.employee.findMany();
        return {
            message: "Fetch all employees",
            data: employees
        }
    },
    getEmployee: async (ctx: any) => {
        let employee = await db.employee.findUnique({
            where: {
                id: ctx.params.employeeId
            }
        });
        return {
            message: "Employee found",
            data: employee
        }
    },
    createEmployee: async (ctx: any) => {
        let password = await Bun.password.hash(
            ctx.body.password,
            {
                algorithm: "bcrypt",
            }
        )
        let employee = await db.employee.create({
            data: {
                name: ctx.body.name,
                email: ctx.body.email,
                password: password,
                role: ctx.body.role,
                telephone: ctx.body.telephone,
            }
        });
        return {
            message: "Employee created",
            data: employee
        }
    },
    updateEmployee: async (ctx: any) => {
        let employee = await db.employee.update({
            where: {
                id: ctx.params.employeeId
            },
            data: {
                name: ctx.body.name,
                email: ctx.body.email,
                role: ctx.body.role,
                telephone: ctx.body.telephone
            }
        });
        return {
            message: "Employee updated",
            data: employee
        }
    },
    deleteEmployee: async (ctx: any) => {
        let employee = await db.employee.delete({
            where: {
                id: ctx.params.employeeId
            }
        });
        return {
            message: "Employee deleted",
            data: employee
        }
    }
}