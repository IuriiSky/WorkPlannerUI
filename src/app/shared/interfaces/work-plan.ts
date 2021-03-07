export class EmployeeTaskDto{
    taskId: number;
    description: string;
    isDone: boolean;
    date: Date;
}
export class WorkPlanDto {
    employeeId: number;
    employeeName: string;
    colorCode: string;
    taskId: number;
    taskDescription: string ;
    date: Date;
    isDone: boolean;
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
export interface WorkPlanRepeatingCommand{
    taskId: number;
    employeeId:number;
    monday:boolean;
    tuesday:boolean;
    wednesday:boolean;
    thursday:boolean;
    friday:boolean;
    saturday:boolean;
    sunday:boolean;

    startDate: string;
    endDate: string;
}