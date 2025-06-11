import type { TaskType } from "./TaskType"

export type RawTaskType = TaskType & {
  dueDate: string,
}