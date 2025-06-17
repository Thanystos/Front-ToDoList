import type React from "react";
import styled from "styled-components";
import type { TaskType } from "../../utils/typescript/TaskType";

// === Styled Components ===

const ModalOverlay = styled.div`
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

const ModalWindow = styled.div`
  background: white;
  width: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f0f0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #978180;
`;

const ModalContent = styled.div`
  position: relative;
  padding: 1.5rem;
  text-align: left;

  label {
    margin: 1rem 0 0.75rem 0 ;
  }

  input {
    height: 1.5rem;
  }

  input, textarea {
    border-radius: 5px;
  }

  label, input, textarea {
    width: 100%;
    display: block;
  }
`;

/**
 * Props du composant TaskGroup.
 */
export type GenericModalProps = {
  /**
   * Tâche associée à la modale, si nécessaire.
   * Peut être utilisée pour personnaliser dynamiquement le contenu (ex : titre).
   */
  task?: TaskType | null;

  /** Titre affiché dans l’en-tête de la modale. */
  title: string;

  /** Fonction appelée lorsqu'on souhaite fermer la modale. */
  onClose: () => void;

  /** Contenu à afficher dans la modale (formulaire, texte, etc.). */
  children: React.ReactNode,
};

/**
 * Composant générique de modale réutilisable.
 *
 * Affiche une fenêtre modale avec un en-tête, un bouton de fermeture et du contenu
 * personnalisable. Utilisable pour afficher des formulaires ou des confirmations
 * (par exemple pour supprimer une tâche).
 *
 * Le clic sur le fond flouté ferme la modale. Le clic à l’intérieur de la fenêtre la maintient ouverte.
 *
 * @param props - Voir {@link GenericModalProps}
 * @returns Une fenêtre modale stylisée.
 */

export const GenericModal = ({
  task,
  title,
  onClose,
  children,
}: GenericModalProps) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalWindow onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <span>{title ?? `Supprimer la tâche ${task?.title}`}</span>
          <CloseButton onClick={onClose} aria-label="Fermer">
            x
          </CloseButton>
        </ModalHeader>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalWindow>
    </ModalOverlay>
  );
};



