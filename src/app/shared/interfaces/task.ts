export class TaskDto {
    id: number;
    description: string ;
}

export class CreateTaskCommand {
    taskDescription: string;
}

export class UpdateTaskCommand {
    taskId: number;
    taskDescription: string ;
}
