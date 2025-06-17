import { useDeleteTask } from "../../../utils/hooks/Tasks/useDeleteTask";
import type { TaskType } from "../../../utils/typescript/TaskType";
import { ModalActions, ModalButton } from "../../shared/Modal/Modal";
import { GenericModal } from "../GenericModal";

/**
 * Props du composant DeleteTaskModal.
 */
export type DeleteTaskModalProps = {
  /** Tâche à supprimer. */
  task: TaskType,

  /** Fonction appelée lorsqu'on souhaite fermer la modale. */
  onClose: () => void,
};

/**
 * Modale de confirmation de suppression d’une tâche.
 *
 * Affiche les informations de la tâche sélectionnée (titre, description, date limite)
 * et demande à l’utilisateur de confirmer ou annuler la suppression.
 *
 * Utilise un hook personnalisé `useDeleteTask` pour effectuer la suppression.
 * Ce composant est affiché dans un `GenericModal`.
 *
 * @param props - Voir {@link DeleteTaskModalProps}
 * @returns Une modale de confirmation de suppression.
 */

function DeleteTaskModal({
  task,
  onClose,
}: DeleteTaskModalProps) {
  const deleteTask = useDeleteTask();

  const handleDeleteTask = (
  ) => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        alert(error.message || "Erreur lors de la suppression");
      }
    });
  };

  return (
    <GenericModal task={task} title="Confirmer la suppression" onClose={onClose}>
      <div>
        <p>Êtes-vous sûr de vouloir supprimer la tâche suivante ?</p>
        <ul>
          <li>
            <strong>Nom : </strong>
            {task.title}
          </li>
          <li className="deletedTaskInfo">
            <strong>Description : </strong>
            {task.description}
          </li>
          <li className="deletedTaskInfo">
            <strong>Date Limite : </strong>
            {task.dueDate.toLocaleDateString()}
          </li>
        </ul>
      </div>
      <ModalActions>
        <ModalButton
          $color="#dc3545"
          onClick={handleDeleteTask}
        >
          Supprimer
        </ModalButton>
        <ModalButton
          $color="#5a6268"
          onClick={onClose}
        >
          Annuler
        </ModalButton>
      </ModalActions>

    </GenericModal>
  );
}

export { DeleteTaskModal };