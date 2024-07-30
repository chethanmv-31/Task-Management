import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks-status-enum';

export class updateTaskDto {
  title: string;
  description: string;
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
