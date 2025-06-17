import { useEffect, useState } from "react";
import type { OptionsType } from "../../typescript/OptionsType";

// La version sans utilisation du cache

// Attention un hook n'est pas un nouveau composant
// Tous les states ici (data par ex) font partie du composant appelant le hook
export const useApi = <Raw, Parsed>(
  url: string,
  options: OptionsType,
  convertFn?: (raw: Raw) => Parsed
) => {
  const stableConvertFn = convertFn ?? ((raw: Raw) => raw as unknown as Parsed);

  const [data, setData] = useState<Parsed[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const result: { member: Raw[] } = await response.json();

        if (isMounted) {
          const parsedData = result.member.map(stableConvertFn);
          setData(parsedData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Une erreur inconnue est survenue"));
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // Si la fonction passée en dep n'est pas mémo, à chaque rerender le useeffect sera réexécuté (boucle infinie)
  }, [url, options, stableConvertFn]);

  return { data, isLoading, error };
};
