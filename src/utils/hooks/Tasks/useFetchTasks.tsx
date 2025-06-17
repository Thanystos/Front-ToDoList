import { apiUrl } from "../../config";
import type { OptionsType } from "../../typescript/OptionsType";
import type { RawTaskType } from "../../typescript/RawTaskType";
import type { TaskType } from "../../typescript/TaskType";
import { useFetchQuery } from "../API/useFetchQuery";

/**
 * Hook personnalisé pour récupérer la liste des tâches depuis l’API.
 *
 * Utilise `useFetchQuery` pour effectuer une requête GET vers l’endpoint `/tasks`.
 * Convertit automatiquement la chaîne de caractères de la date (`dueDate`) en objet `Date`
 * pour chaque tâche retournée.
 *
 * @returns Une instance de requête React Query contenant les données des tâches.
 *
 * @example
 * const { data: tasks, isLoading, error } = useFetchTasks();
 */
export const useFetchTasks = () => {
  const options: OptionsType = {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  }

  /**
   * Convertit les chaînes de caractères représentant des dates en objets `Date`.
   *
   * @param raw - L’objet brut à convertir.
   * @param dateKeys - Les clés de l’objet correspondant à des dates.
   * @returns L’objet avec les dates converties.
   */
  const convertDates = <T extends object, K extends keyof T>(
    raw: T,
    dateKeys: K[]
  ): T & { [P in K]: Date } => {
    return {
      ...raw,
      ...Object.fromEntries(
        dateKeys.map((key) => {
          const value = raw[key];
          return [key, typeof value === 'string' ? new Date(value) : value];
        })
      ),
    } as T & { [P in K]: Date };
  };

  /**
   * Transforme une tâche brute (issue de l’API) en tâche utilisable côté client.
   *
   * @param raw - L’objet `RawTaskType` contenant la tâche.
   * @returns La tâche avec la date correctement typée (`TaskType`).
   */
  const convertRawTask = (
    raw: RawTaskType
  ) => convertDates(raw, ['dueDate']);

  return useFetchQuery<RawTaskType, TaskType>('tasks', `${apiUrl}/tasks`, options, convertRawTask);
};