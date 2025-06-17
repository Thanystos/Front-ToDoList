import { useQuery } from "@tanstack/react-query";
import type { OptionsType } from "../../typescript/OptionsType";
import type { CollectionType } from "../../typescript/CollectionType";

// La version avec utilisation d'un cache useQuery
// Plus besoin de useeffect ou de state. Tout est géré en interne par useQuery

/**
 * Hook personnalisé basé sur React Query pour effectuer une requête `GET` générique.
 *
 * Ce hook permet de récupérer une collection de données via une URL, en utilisant `fetch`
 * et une fonction de transformation optionnelle. Il retourne les données transformées
 * et gère automatiquement la mise en cache.
 *
 * @template Raw - Le type brut des éléments retournés par l'API (forme d'origine).
 * @template Parsed - Le type final désiré après transformation (forme utilisée dans l'app).
 *
 * @param queryKeyPrefix - Préfixe du `queryKey` pour la mise en cache (React Query).
 * @param url - URL de la ressource à interroger.
 * @param options - Options de la requête `fetch` (headers, method, etc.).
 * @param convertFn - Fonction optionnelle pour transformer chaque élément brut (`Raw`) en type `Parsed`.
 *
 * @returns Résultat de `useQuery`, incluant :
 * - `data`: tableau de `Parsed` si succès,
 * - `error`: instance de `Error` si échec,
 * - `isLoading`, `isError`, etc.
 *
 * @example
 * const tasks = useFetchQuery<TaskAPIResponse, Task>(
 *   'tasks',
 *   '/api/tasks',
 *   { method: 'GET' },
 *   (raw) => ({
 *     id: raw.id,
 *     title: raw.title,
 *     ...
 *   })
 * );
 */
export const useFetchQuery = <Raw, Parsed>(
  queryKeyPrefix: string,
  url: string,
  options: OptionsType,
  convertFn?: (raw: Raw) => Parsed,
) => {
  const stableConvertFn = convertFn ?? ((raw) => raw as unknown as Parsed);

  const fetchData = async () => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const result: CollectionType<Raw> = await response.json();
    return result.member.map(stableConvertFn);
  };

  return useQuery<Parsed[], Error>({
    // Dépendances redéclenchant le useQuery et donc queryFn
    queryKey: [queryKeyPrefix, url, options],

    // La fonction à effectuer quand les dép changent
    queryFn: fetchData,

    // Les données du cache ne sont jamais considérées comme périmées (pas de refetch auto)
    staleTime: Infinity,


    // Aurait permis de ne conserver le cache que pendant 1h. Inutile dans notre cas
    // cacheTime: 60 * 60 * 1000,
  });
};