export interface TaskDto {
    id: number;
    description: string ;
}

export interface CreateTaskCommand {
    taskDescription: string;
    departmentId:number;
}

export interface UpdateTaskCommand {
    taskId: number;
    taskDescription: string ;
}


