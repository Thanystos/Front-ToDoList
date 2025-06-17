import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TaskType } from "../../utils/typescript/TaskType";
import styled from "styled-components";
import { MemoizedTaskGroup } from "../TaskGroup/TaskGroup";
import { AddTaskModal } from "../modal/AddTaskModal/AddTaskModal";
import { useFetchTasks } from "../../utils/hooks/Tasks/useFetchTasks";
import { DeleteTaskModal } from "../modal/DeleteTaskModal/DeleteTaskModal";
import { useModals } from "../../utils/hooks/Modals/useModals";

// === Styled Components ===

const TasksPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/todolist_page.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  
  ul {
    list-style: none;
    padding: 0px;
  }
  .deletedTaskInfo {
    margin-top: 16px;
  }
`;

const SheetContainer = styled.div`
  width: 60vw;
  height: 90vh;
  position: relative;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
`;

const Overlay = styled.div<{ style: React.CSSProperties }>`
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  text-align: center;
  color: #978180;
`;

/**
 * Page principale contenant l'affichage des tâches sur une feuille illustrée.
 * 
 * Récupère les tâches depuis une API, les classe par priorité et les affiche
 * dans un `Overlay` positionné dynamiquement par-dessus une image.
 * Gère également l'ouverture/fermeture des modales.
 * @returns L’interface principale de gestion des tâches.
 */

function TasksList() {
  // === Refs ===
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // === State ===

  /**
   * Syle dynamique pour positionner l'overlay par-dessus l'image.
   */
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});

  // === Hooks (modales) ===
  const {
    isAddModalDisplayed,
    modalPriority,
    openAddModal,
    closeAddModal,
    isDeleteModalDisplayed,
    taskToDelete,
    openDeleteModal,
    closeDeleteModal,
  } = useModals();

  /**
   * Tableau vide mémorisé pour éviter de créer une nouvelle instance à chaque rendu
   * et prévenir le rerender inutile des composants enfants.
   */
  const emptyArray = useMemo(() => [], []);

  /**
   * Calcule les dimensions de l'image rendue (avec object-fit: contain)
   * et ajuste dynamiquement la taille et la position de l'overlay.
   */
  const updateOverlay = useCallback(() => {
    // Récupération des références au conteneur et à l'image
    const container = containerRef.current;
    const img = imgRef.current;

    if (!container || !img) return;

    const cW = container.clientWidth;
    const cH = container.clientHeight;

    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    const imgRatio = iW / iH;
    const containerRatio = cW / cH;

    let renderedWidth, renderedHeight;

    if (imgRatio > containerRatio) {
      renderedWidth = cW;
      renderedHeight = cW / imgRatio;
    } else {
      renderedHeight = cH;
      renderedWidth = cH * imgRatio;
    }

    const left = (cW - renderedWidth) / 2;
    const top = (cH - renderedHeight) / 2;

    setOverlayStyle({
      width: renderedWidth,
      height: renderedHeight,
      left,
      top,
    });
  }, []);

  /**
   * Écoute le redimensionnement de la fenêtre pour mettre à jour l'overlay en temps réel.
   */
  useEffect(() => {
    window.addEventListener('resize', updateOverlay);
    return () => {
      window.removeEventListener('resize', updateOverlay);
    };
  }, [updateOverlay]);

  // === Données (API) ===

  /**
   * Récupère les tâches via un hook personnalisé utilisant React Query.
   */
  const { data: tasks, isLoading, error } = useFetchTasks();

  /**
   * Regroupe les tâches par priorité dans un objet associatif.
   */
  const groupedTasks = useMemo(() => {
    return tasks?.reduce((acc, task) => {
      if (!acc[task.priority]) {
        acc[task.priority] = [];
      }
      acc[task.priority].push(task);
      return acc;
    }, {} as Record<string, TaskType[]>) ?? {};
  }, [tasks]);

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
    <TasksPage>
      <SheetContainer ref={containerRef}>
        <StyledImage ref={imgRef} src="/todolist_sheet.jpg" alt="Task Sheet" onLoad={updateOverlay} />
        <Overlay style={overlayStyle}>
          <MemoizedTaskGroup
            priority="Urgente"
            tasks={groupedTasks["Urgente"] ?? emptyArray}
            bgColor="#f0dede"
            openAddModal={openAddModal}
            openDeleteModal={openDeleteModal}
          />
          <MemoizedTaskGroup
            priority="Prioritaire"
            tasks={groupedTasks["Prioritaire"] ?? emptyArray}
            bgColor="#e5d4ca"
            openAddModal={openAddModal}
            openDeleteModal={openDeleteModal}
          />
          <MemoizedTaskGroup
            priority="Standard"
            tasks={groupedTasks["Standard"] ?? emptyArray}
            bgColor="#ced5df"
            openAddModal={openAddModal}
            openDeleteModal={openDeleteModal}
          />
          <MemoizedTaskGroup
            priority="Secondaire"
            tasks={groupedTasks["Secondaire"] ?? emptyArray}
            bgColor="#dacfd5"
            openAddModal={openAddModal}
            openDeleteModal={openDeleteModal}
          />
          {isAddModalDisplayed && <AddTaskModal priority={modalPriority} onClose={closeAddModal} />}
          {isDeleteModalDisplayed && <DeleteTaskModal task={taskToDelete} onClose={closeDeleteModal} />}
        </Overlay>
      </SheetContainer>
    </TasksPage>
  );
}

// === Export ===
export { TasksList };