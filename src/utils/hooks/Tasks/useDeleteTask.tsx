import { apiUrl } from "../../config";
import { useMutationRequest } from "../API/useMutationRequest";

/**
 * Hook personnalisé pour supprimer une tâche via une requête HTTP DELETE.
 *
 * Utilise `useMutationRequest` pour envoyer l'ID d'une tâche à supprimer,
 * puis invalide la requête "tasks" dans le cache de React Query à la réussite.
 *
 * @returns Une mutation React Query permettant de supprimer une tâche par son ID.
 *
 * @example
 * const deleteTask = useDeleteTask();
 * deleteTask.mutate(taskId, {
 *   onSuccess: () => { ... },
 *   onError: (error) => { ... },
 * });
 */
export const useDeleteTask = () => {
  return useMutationRequest<number, boolean>(
    (id: number) => `${apiUrl}/tasks/${id}`, 'DELETE', ['tasks']
  );
};