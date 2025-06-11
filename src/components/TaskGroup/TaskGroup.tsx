import styled from "styled-components";
import type { TaskType } from "../../utils/typescript/TaskType";
import { memo } from "react";

const TaskGroupContainer = styled.div<{ $bgColor: string }>`
  margin: 10px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledTaskItem = styled.li<{ $completed: boolean }>`
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
    width: ${({ $completed }) => ($completed ? '100%' : '0%')};
    transition: width 0.4s ease;
    pointer-events: none;
  }

  &:hover::after {
    width: 100%;
  }
`

type TaskGroupProps = {
  priority: string,
  tasks: TaskType[],
  bgColor: string,
  completedTasks: Set<number>,
  toggleCompletion: (id: number) => void;
  openModal: (priority: string) => void;
}

function TaskGroup({
  priority,
  tasks,
  bgColor,
  completedTasks,
  toggleCompletion,
  openModal,
}: TaskGroupProps) {

  const getDaysRemaining = (
    dueDate: Date,
  ) => {
    const now = new Date();
    const diffInMs = dueDate.getTime() - now.getTime();
    const diffinDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffinDays;
  }
  console.log('render groupe');

  return (
    <TaskGroupContainer $bgColor={bgColor}>
      <h3>{priority}</h3>
      <ul>
        {tasks.map((task) => {
          const daysRemaining = getDaysRemaining(task.dueDate);
          return (
            <StyledTaskItem
              key={task.id}
              $completed={completedTasks.has(task.id)}
              onClick={() => toggleCompletion(task.id)}
            >
              {task.title}
              {' - '}
              {' '}
              {daysRemaining < 0
                ? `Retard ${Math.abs(daysRemaining)} jour(s)`
                : `${daysRemaining} jour(s)`
              }
            </StyledTaskItem>
          )
        })}
      </ul>
      <button onClick={() => openModal(priority)}>
        + Ajouter une tâche {priority && `${priority}`}
      </button>

    </TaskGroupContainer>
  );
}

export default memo(TaskGroup);