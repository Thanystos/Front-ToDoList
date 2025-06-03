import { useQuery } from "@tanstack/react-query";
import type { OptionsType } from "../typescript/OptionsType";
import type { CollectionType } from "../typescript/CollectionType";

// La version avec utilisation d'un cache useQuery
// Plus besoin de useeffect ou de state. Tout est géré en interne par useQuery

export const useApi = <Raw, Parsed>(
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