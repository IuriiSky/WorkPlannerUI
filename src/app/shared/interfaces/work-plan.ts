export class EmployeeTaskDto{
    taskId: number;
    description: string;
    isDone: boolean;
    date: Date;
}
export class WorkPlanDto {
    employeeId: number;
    employeeName: string ;
    taskId: number;
    taskDescription: string ;
    date: Date;
}

export class CreateWorkPlanCommand {
    employeeId: number;
    taskId: number;
    date: Date;
}

export class UpdateWorkPlanCommand{
    employeeId: number;
    taskId: number;
    date: Date;
}

export class DeleteWorkPlanCommand {
    employeeId: number;
    taskId: number;
    date: Date;
}