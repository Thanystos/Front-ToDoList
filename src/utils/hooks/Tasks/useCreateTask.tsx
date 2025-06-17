import { apiUrl } from "../../config";
import type { TaskType } from "../../typescript/TaskType";
import { useMutationRequest } from "../API/useMutationRequest";

/**
 * Hook personnalisé pour créer une tâche via une requête HTTP POST.
 *
 * Utilise `useMutationRequest` pour envoyer une tâche au backend,
 * puis invalide la requête "tasks" dans le cache de React Query à la réussite.
 *
 * @returns Une mutation React Query permettant de créer une nouvelle tâche.
 *
 * @example
 * const createTask = useCreateTask();
 * createTask.mutate(newTask, {
 *   onSuccess: () => { ... },
 *   onError: (error) => { ... },
 * });
 */
export const useCreateTask = () => {
  return useMutationRequest<TaskType, TaskType>(
    () => `${apiUrl}/tasks`, 'POST', ['tasks'],
  );
};