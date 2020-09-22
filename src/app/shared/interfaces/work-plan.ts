export class EmployeeTaskDto{
    taskId: number;
    taskDescription: string;
    isDone: boolean;
    date: Date;
}
export class WorkPlanDto {
    employeeId: number;
    employeeName: string ;
    taskId: number;
    taskDescription: string ;
    date: Date;
    // startTime: Date;
    // endTime: Date;
}

export class CreateWorkPlanCommand {
    employeeId: number;
    taskId: number;
    date: Date;
    // startTime: Date;
    // endTime: Date;
}

export class UpdateWorkPlanCommand{
    employeeId: number;
    taskId: number;
    date: Date;
    // startTime: Date;
    // endTime: Date;
}

export class DeleteWorkPlanCommand {
    employeeId: number;
    taskId: number;
    date: Date;
}
