export interface TaskDto {
    id: number;
    description: string ;
}

export interface CreateTaskCommand {
    taskDescription: string;
}

export interface UpdateTaskCommand {
    taskId: number;
    taskDescription: string ;
}


