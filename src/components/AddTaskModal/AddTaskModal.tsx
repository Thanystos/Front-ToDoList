import type React from "react";
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalWindow = styled.div`
  background: white;
  width: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f0f0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`;

export const ModalContent = styled.div`
  padding: 1.5rem;
`;

type AddTaskModalProps = {
  priority: string | null,
  onClose: () => void;
}

function AddTaskModal({
  priority,
  onClose,
}: AddTaskModalProps) {
  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    console.log('submit');
  };

  console.log('render modale');
  return (
    <ModalOverlay onClick={onClose}>
      <ModalWindow onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <span>Ajouter une tâche {priority}</span>
          <CloseButton onClick={onClose} aria-label="Fermer">x</CloseButton>
        </ModalHeader>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ul>
              <li>
                <label htmlFor="title">Nom de la tâche : </label>
                <input type="text" id="title" name="task_title" />
              </li>
              <li style={{ marginTop: '1rem' }}>Ajouter</li>
            </ul>
          </form>
        </ModalContent>
      </ModalWindow>
    </ModalOverlay>
  );
}

export default AddTaskModal;