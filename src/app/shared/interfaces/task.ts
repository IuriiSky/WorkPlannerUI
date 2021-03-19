export interface TaskDto {
    id: number;
    description: string ;
    canBeRemovedByEmployee:boolean;
}

export interface CreateTaskCommand {
    taskDescription: string;
    departmentId:number;
    canBeRemovedByEmployee:boolean;
}

export interface UpdateTaskCommand {
    taskId: number;
    taskDescription: string ;
    canBeRemovedByEmployee:boolean;
}


