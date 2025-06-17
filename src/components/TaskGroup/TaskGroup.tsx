import styled from "styled-components";
import type { TaskType } from "../../utils/typescript/TaskType";
import { memo } from "react";
import { ModalButton } from "../shared/Modal/Modal";

// === Styled Components ===

const TaskGroupContainer = styled.div<{ $bgColor: string }>`
  margin: 10px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  padding-bottom: 50px;

  button {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const StyledTaskItem = styled.li`
  position: relative;
  padding: 0.25rem 0;
  margin: 1rem;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 50%;
    height: 2px;
    background: black;
    width: 0%;
    transition: width 0.4s ease;
    pointer-events: none;
  }

  &:hover::after {
    width: 100%;
  }

  .tooltip {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: -1.5rem;
    left: 0;
    background: #333;
    color: white;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 10;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

// === Type exporté pour documentation ===

/**
 * Props du composant TaskGroup.
 */
export type TaskGroupProps = {
  /** Priorité du groupe (ex : "Urgente", "Prioritaire", etc.) */
  priority: string;

  /** Liste des tâches à afficher dans ce groupe. */
  tasks: TaskType[];

  /** Couleur de fond du groupe. */
  bgColor: string;

  /** Fonction déclenchant la modale d’ajout d’une tâche. */
  openAddModal: (priority: string) => void;

  /** Fonction déclenchant la modale de suppression d’une tâche. */
  openDeleteModal: (task: TaskType) => void;
}

// === Composant principal ===

/**
 * Groupe de tâches affiché dans un encadré coloré selon la priorité.
 *
 * Affiche les tâches d'une priorité donnée avec leur titre, échéance,
 * et leur description en infobulle. Chaque tâche est cliquable pour
 * ouvrir une modale de suppression. Un bouton permet d’ajouter une tâche.
 *
 * @param props - Voir {@link TaskGroupProps}
 */
function TaskGroup({
  priority,
  tasks,
  bgColor,
  openAddModal,
  openDeleteModal,
}: TaskGroupProps) {

  const getDaysRemaining = (
    dueDate: Date,
  ) => {
    const now = new Date();
    const diffInMs = dueDate.getTime() - now.getTime();
    const diffinDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffinDays;
  };

  return (
    <TaskGroupContainer $bgColor={bgColor}>
      <h3>{priority}</h3>
      <ul>
        {tasks.map((task) => {
          const daysRemaining = getDaysRemaining(task.dueDate);
          return (
            <StyledTaskItem
              key={task.id}
              onClick={() => openDeleteModal(task)}
            >
              <span className="task-title">
                {task.title}
                {' - '}
                {' '}
                {daysRemaining < 0
                  ? `Retard ${Math.abs(daysRemaining)} jour(s)`
                  : `${daysRemaining} jour(s)`
                }
              </span>
              <span className="tooltip">
                {task.description}
              </span>

            </StyledTaskItem>
          )
        })}
      </ul>
      <ModalButton
        $color="#28a745"
        onClick={() => openAddModal(priority)}
      >
        +
      </ModalButton>
    </TaskGroupContainer>
  );
}

// === Export ===

// Export non mémoisé pour documentation et test
export { TaskGroup };

// Export mémoisé à utiliser dans l'app
export const MemoizedTaskGroup = memo(TaskGroup);