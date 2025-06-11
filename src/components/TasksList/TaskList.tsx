import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApi } from "../../utils/hooks/index";
import type { TaskType } from "../../utils/typescript/TaskType";
import type { RawTaskType } from "../../utils/typescript/RawTaskType";
import { convertDates } from "../../utils/helpers/convert";
import type { OptionsType } from "../../utils/typescript/OptionsType";
import styled from "styled-components";
import TaskGroup from "../TaskGroup/TaskGroup";
import AddTaskModal from "../AddTaskModal/AddTaskModal";

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
  & ul {
    list-style: none;
    padding: 0px;
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

// On récupère les propriété css contenues dans overlayStyle et on les ajoute
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

function TasksList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
  const [counter, setCounter] = useState(0);

  // Contient toutes les tâches barrées
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  // Permet la gestion de l'affichage de la modale d'ajout
  const [isModalDisplayed, setIsModalDisplayed] = useState(false);

  // Indique à quel groupe la modale appartient
  const [modalPriority, setModalPriority] = useState<string | null>(null);

  // Ouvre la modale pour le groupe correspondant à la priority
  const openModal = useCallback((
    priority: string,
  ) => {
    setModalPriority(priority);
    setIsModalDisplayed(true);
  }, []);

  // Ferme la modale
  const closeModal = () => {
    setModalPriority(null);
    setIsModalDisplayed(false);
  };

  // Permet d'éviter le recalcul du cas secondaire ([]) de l'affichage des TaskGroup
  const emptyArray = useMemo(() => [], []);

  const toggleCompletion = useCallback((id: number) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, []);

  // Fonction qui calcule la taille et la position de l'Overlay pour qu'il couvre exactement l'image
  const updateOverlay = useCallback(() => {
    // Récupération des références au conteneur et à l'image
    const container = containerRef.current;
    const img = imgRef.current;

    // Si le conteneur ou l'image n'existent pas ou si l'image n'est pas encore chargée, on ne fait rien
    if (!container || !img) return;

    // Dimensions du conteneur en pixels (taille visible sur l'écran)
    const cW = container.clientWidth;
    const cH = container.clientHeight;

    // Dimensions naturelles (originales) de l'image en pixels
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    // Calcul du ratio (largeur / hauteur) de l'image et du conteneur
    const imgRatio = iW / iH;
    const containerRatio = cW / cH;

    let renderedWidth, renderedHeight;

    // On compare les ratios pour savoir si l'image est proportionnellement plus large ou plus haute que le conteneur
    if (imgRatio > containerRatio) {
      // L'image est plus large proportionnellement => on remplit la largeur du conteneur
      renderedWidth = cW;
      // Hauteur calculée pour garder les proportions : largeur divisée par le ratio
      renderedHeight = cW / imgRatio;
    } else {
      // L'image est plus haute proportionnellement (ou égale) => on remplit la hauteur du conteneur
      renderedHeight = cH;
      // Largeur calculée pour garder les proportions : hauteur multipliée par le ratio
      renderedWidth = cH * imgRatio;
    }

    // Calcul de la marge gauche pour centrer l'image horizontalement dans le conteneur
    const left = (cW - renderedWidth) / 2;
    // Calcul de la marge haute pour centrer l'image verticalement dans le conteneur
    const top = (cH - renderedHeight) / 2;

    // Mise à jour du style de l'Overlay : taille et position pour superposer exactement l'image
    setOverlayStyle({
      width: renderedWidth,
      height: renderedHeight,
      left,
      top,
    });
  }, []);

  useEffect(() => {
    // On met aussi à jour l'Overlay à chaque redimensionnement de la fenêtre pour garder l'alignement
    window.addEventListener('resize', updateOverlay);

    // Nettoyage des écouteurs d'événements quand le composant est démonté
    return () => {
      window.removeEventListener('resize', updateOverlay);
    };
  }, []);

  const url = 'http://localhost:8000/tasks';

  // Quand un objet apparaît en dépendance d'un useeffect, on lui applique useMemo
  const options: OptionsType = useMemo(() => ({
    method: "GET",
    headers: { "content-type": "application/json" },
  }), []);

  // Pareil pour les fonctions
  const convertRawTask = useCallback(
    (raw: RawTaskType): TaskType =>
      convertDates(raw, ['dueDate']),
    []
  );

  const { data, isLoading, error } = useApi<RawTaskType, TaskType>('tasks', url, options, convertRawTask);

  // Classe les données par priority
  const groupedTasks = useMemo(() => {
    return data?.reduce((acc, task) => {
      if (!acc[task.priority]) {
        acc[task.priority] = [];
      }
      acc[task.priority].push(task);
      return acc;
    }, {} as Record<string, TaskType[]>) ?? {};
  }, [data]);

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
          <TaskGroup
            priority="Urgente"
            tasks={groupedTasks["Urgente"] ?? emptyArray}
            bgColor="#f0dede"
            completedTasks={completedTasks}
            toggleCompletion={toggleCompletion}
            openModal={openModal}
          />
          <TaskGroup
            priority="Prioritaire"
            tasks={groupedTasks["Prioritaire"] ?? emptyArray}
            bgColor="#e5d4ca"
            completedTasks={completedTasks}
            toggleCompletion={toggleCompletion}
            openModal={openModal}
          />
          <TaskGroup
            priority="Standard"
            tasks={groupedTasks["Standard"] ?? emptyArray}
            bgColor="#ced5df"
            completedTasks={completedTasks}
            toggleCompletion={toggleCompletion}
            openModal={openModal}
          />
          <TaskGroup
            priority="Secondaire"
            tasks={groupedTasks["Secondaire"] ?? emptyArray}
            bgColor="#dacfd5"
            completedTasks={completedTasks}
            toggleCompletion={toggleCompletion}
            openModal={openModal}
          />
          {isModalDisplayed && <AddTaskModal onClose={closeModal} priority={modalPriority} />}
        </Overlay>
      </SheetContainer>
      <button onClick={() => setCounter((prev) => prev + 1)}>test render</button>
    </TasksPage>
  );
}

export default TasksList;