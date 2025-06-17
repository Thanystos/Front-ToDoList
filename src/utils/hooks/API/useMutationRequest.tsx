import { useMutation, useQueryClient } from "@tanstack/react-query"

/**
 * Hook personnalisé pour effectuer une requête de mutation (`POST`, `PUT`, ou `DELETE`)
 * via `fetch`, avec gestion automatique de l'invalidation du cache React Query.
 *
 * Ce hook générique permet d’envoyer une donnée (`Payload`) à un endpoint dont l’URL
 * dépend dynamiquement du contenu, et de récupérer une réponse typée (`Response`).
 *
 * @template Payload - Type des données envoyées dans la requête (ex. une tâche à créer).
 * @template Response - Type attendu de la réponse (ex. tâche créée ou `true` pour une suppression).
 *
 * @param getUrl - Fonction qui reçoit les données `Payload` et retourne l’URL à appeler.
 * @param method - Méthode HTTP de la requête (`POST`, `PUT` ou `DELETE`).
 * @param invalidateKey - Clé de cache React Query à invalider après succès (optionnelle).
 *
 * @returns Un objet mutation de React Query, incluant :
 * - `mutate`: fonction pour lancer la requête.
 * - `isPending`, `isSuccess`, `error`, etc.
 *
 * @example
 * const createTask = useMutationRequest<TaskPayload, Task>(
 *   () => '/api/tasks',
 *   'POST',
 *   ['tasks']
 * );
 *
 * createTask.mutate(newTask, {
 *   onSuccess: () => { ... },
 *   onError: (err) => { ... },
 * });
 */
export const useMutationRequest = <Payload, Response>(
  getUrl: (data: Payload) => string,
  method: 'POST' | 'DELETE' | 'PUT',
  invalidateKey?: string[],
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Payload,
    ): Promise<Response> => {
      const url = getUrl(data);
      const res = await fetch(url, {
        method,
        headers: { 'content-type': 'application/ld+json' },
        body: method !== 'DELETE' ? JSON.stringify(data) : undefined,
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP ${method} vers ${url}`);
      }

      return method === 'DELETE' ? (true as Response) : await res.json();
    },

    onSuccess: () => {
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }
    },
  });
};