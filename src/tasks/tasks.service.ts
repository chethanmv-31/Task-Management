import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task-dto';
import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { TaskStatus } from './tasks-status-enum';
import { updateTaskDto } from './dto/update-task-dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTasks(filterTaskDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterTaskDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: { id, user },
    });
    if (!found) throw new NotFoundException(`Task with ID "${id}" not found!`);
    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await this.tasksRepository.save(task);
    return task;
  }

  async updateTask(
    id: string,
    updateTaskDto: updateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description, status } = updateTaskDto;
    const task = await this.getTaskById(id, user);

    (task.description = description),
      (task.title = title),
      (task.status = status);

    await this.tasksRepository.save(task);
    return task;
  }

  // private tasks: Task[] = [];

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getFilterTask(taskFilterDto: GetTaskFilterDto): Task[] {
  //   const { search, status } = taskFilterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((item) => item.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((item) => item.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Task with Id:${id} not found`);
  //   }
  //   return found;
  // }

  // deteteTask(id: string): void {
  //   const task = this.getTaskById(id)
  //   this.tasks.filter((item) => item.id !== task.id);
  // }

  // updateTaskStatus(id: string, status: TaskStatus) {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }

  // updateTask(id: string, updateTaskDto: updateTaskDto) {
  //   const { title, description, status } = updateTaskDto;
  //   const task = this.getTaskById(id);

  //   (task.description = description),
  //     (task.title = title),
  //     (task.status = status);

  //   return task;
  // }
}
