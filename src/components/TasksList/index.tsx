import { useCallback, useMemo } from "react";
import { useApi } from "../../utils/hooks/index";
import type { TaskType } from "../../utils/typescript/TaskType";
import type { RawTaskType } from "../../utils/typescript/RawTaskType";
import { convertDates } from "../../utils/helpers/convert";
import type { OptionsType } from "../../utils/typescript/OptionsType";

function TasksList() {
  const url = 'http://localhost:8000/tasks';
  // Quand un objet apparaît en dépendance d'un useeffect, on lui applique useMemo
  const options: OptionsType = useMemo(() => ({
    method: "GET",
    headers: { "content-type": "application/json" },
  }), []);
  // Pareil pour les fonctions
  const convertRawTask = useCallback(
    (raw: RawTaskType): TaskType =>
      convertDates(raw, ['dueDate', 'createdAt', 'updatedAt']),
    []
  );
  const { data, isLoading, error } = useApi<RawTaskType, TaskType>('tasks', url, options, convertRawTask);

  if (isLoading) {
    return (
      <p>Chargement...</p>
    );
  }

  if (error) {
    return (
      <p>Erreur : {error.message}</p>
    );
  }

  return (
    <ul>
      {data && data.map((post: TaskType) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default TasksList;