export const convertDates = <T extends object, K extends keyof T>(
  raw: T,
  dateKeys: K[]
): T & { [P in K]: Date } => {
  return {
    ...raw,
    ...Object.fromEntries(
      dateKeys.map((key) => {
        const value = raw[key];
        return [key, typeof value === 'string' ? new Date(value) : value];
      })
    ),
  } as T & { [P in K]: Date };
};