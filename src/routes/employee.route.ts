import { t } from "elysia";
import { EmployeeCtrl } from "../controllers/employee.ctrl";

export function EmployeeRoute(app: any) {
    return app.
        get("/", EmployeeCtrl.getAllEmployee, {
            detail: {
                tags: ['Employee']
            }
        }).
        get("/:employeeId", EmployeeCtrl.getEmployee, {
            params: t.Object({
                employeeId: t.Integer()
            }),
            detail: {
                tags: ['Employee']
            }
        }).
        post("/", EmployeeCtrl.createEmployee, {
            body: t.Object({
                name: t.String(),
                email: t.String(),
                password: t.String(),
                role: t.String(),
                telephone: t.String()
            }),
            detail: {
                tags: ['Employee']
            }
        }).
        put("/:employeeId", EmployeeCtrl.updateEmployee, {
            params: t.Object({
                employeeId: t.Integer()
            }),
            body: t.Object({
                name: t.String(),
                email: t.String(),
                role: t.String(),
                telephone: t.String()
            }),
            detail: {
                tags: ['Employee']
            }
        }).
        delete("/:employeeId", EmployeeCtrl.deleteEmployee, {
            params: t.Object({
                employeeId: t.Integer()
            }),
            detail: {
                tags: ['Employee']
            }
        });
}