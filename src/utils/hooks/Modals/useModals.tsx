import { useCallback, useState } from "react";
import type { TaskType } from "../../typescript/TaskType";

/**
 * Hook personnalisé pour gérer l'affichage des modales "Ajouter une tâche" et "Supprimer une tâche".
 *
 * Ce hook centralise l'état de visibilité des modales ainsi que les données associées,
 * comme la priorité pour l'ajout ou la tâche à supprimer.
 *
 * @returns Un objet contenant :
 * ### Pour la modale d'ajout :
 * - `isAddModalDisplayed`: état de visibilité de la modale d'ajout.
 * - `modalPriority`: priorité associée à la tâche à ajouter.
 * - `openAddModal(priority: string)`: ouvre la modale avec la priorité donnée.
 * - `closeAddModal()`: ferme la modale d'ajout et réinitialise la priorité.
 *
 * ### Pour la modale de suppression :
 * - `isDeleteModalDisplayed`: état de visibilité de la modale de suppression.
 * - `taskToDelete`: tâche actuellement ciblée pour suppression.
 * - `openDeleteModal(task: TaskType)`: ouvre la modale de suppression pour la tâche spécifiée.
 * - `closeDeleteModal()`: ferme la modale de suppression et réinitialise la tâche ciblée.
 *
 * @example
 * const {
 *   isAddModalDisplayed,
 *   openAddModal,
 *   closeAddModal,
 *   isDeleteModalDisplayed,
 *   taskToDelete,
 *   openDeleteModal,
 *   closeDeleteModal,
 * } = useModals();
 */
export const useModals = () => {
  const [isAddModalDisplayed, setAddModalDisplayed] = useState(false);
  const [modalPriority, setModalPriority] = useState<string>("");

  const [isDeleteModalDisplayed, setDeleteModalDisplayed] = useState(false);

  const defaultTask: TaskType = {
    id: 0,
    title: '',
    description: '',
    dueDate: new Date(),
    priority: "",
  };

  const [taskToDelete, setTaskToDelete] = useState<TaskType>(defaultTask);

  return {
    // add modale
    isAddModalDisplayed,
    modalPriority,
    openAddModal: useCallback((priority: string) => {
      setModalPriority(priority);
      setAddModalDisplayed(true);
    }, []),
    closeAddModal: useCallback(() => {
      setModalPriority("");
      setAddModalDisplayed(false);
    }, []),

    // delete modale
    isDeleteModalDisplayed,
    taskToDelete,
    openDeleteModal: useCallback((task: TaskType) => {
      setTaskToDelete(task);
      setDeleteModalDisplayed(true);
    }, []),
    closeDeleteModal: useCallback(() => {
      setTaskToDelete(defaultTask);
      setDeleteModalDisplayed(false);
    }, []),
  };
}
