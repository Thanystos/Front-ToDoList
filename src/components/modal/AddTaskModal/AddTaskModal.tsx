import type React from "react";
import { useState } from "react";
import type { TaskType } from "../../../utils/typescript/TaskType";
import { ModalActions, ModalButton } from "../../shared/Modal/Modal";
import { useCreateTask } from "../../../utils/hooks/Tasks/useCreateTask";
import { GenericModal } from "../GenericModal";


/**
 * Props du composant TaskGroup.
 */
export type AddTaskModalProps = {
  /** Priorité de la tâche à ajouter (ex : "Urgente", "Standard", etc.). */
  priority: string,

  /** Fonction appelée lorsqu'on souhaite fermer la modale. */
  onClose: () => void;
};

/**
 * Modale d’ajout d’une nouvelle tâche.
 *
 * Affiche un formulaire avec les champs nécessaires à la création d’une tâche :
 * - nom (titre),
 * - description,
 * - date limite.
 *
 * Le formulaire valide automatiquement l’entrée avant soumission et utilise un hook
 * personnalisé (`useCreateTask`) pour envoyer les données.
 *
 * Ce composant est affiché à l’intérieur d’un `GenericModal`.
 *
 * @param props - Voir {@link AddTaskModalProps}
 * @returns Une modale contenant un formulaire de création de tâche.
 */

function AddTaskModal({
  priority,
  onClose,
}: AddTaskModalProps) {
  const [newTask, setNewTask] = useState<TaskType>({
    id: 0,
    title: '',
    description: '',
    dueDate: new Date(),
    priority: priority,
  });

  const createTask = useCreateTask();

  const formValid = !!newTask.title && !!newTask.description;

  const handleChange = (
    field: keyof TaskType,
    value: string | Date,
  ) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    createTask.mutate(newTask, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        alert(error.message || "Erreur lors de la création");
      }
    });
  };

  return (
    <GenericModal title={`Ajouter une tâche ${priority}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="title">Nom : </label>
            <input
              type="text"
              id="title"
              name="task_title"
              maxLength={50}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <small>{newTask.title.length} / 50</small>
          </li>
          <li>
            <label htmlFor="description">Description : </label>
            <textarea
              id="description"
              name="task_description"
              rows={3}
              maxLength={100}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <small>{newTask.description.length} / 100</small>
          </li>
          <li>
            <label htmlFor="dueDate">Date limite : </label>
            <input
              type="date"
              id="dueDate"
              name="task_dueDate"
              value={newTask.dueDate.toISOString().split('T')[0]}
              onChange={(e) => handleChange('dueDate', new Date(e.target.value))}
            />
          </li>
        </ul>
        <ModalActions>
          <ModalButton
            $color={formValid ? "#28a745" : "#5a6268"}
            type="submit"
            disabled={createTask.isPending || !formValid}
          >
            {createTask.isPending ? 'Ajout en cours' : 'Ajouter'}
          </ModalButton>
          <ModalButton
            $color="#5a6268"
            onClick={onClose}
          >
            Annuler
          </ModalButton>
        </ModalActions>

      </form>
    </GenericModal>

  );
}

export { AddTaskModal };