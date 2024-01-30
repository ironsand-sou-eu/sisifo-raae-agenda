export type Operator =
  | "sensitiveStrictEquality"
  | "insensitiveStrictEquality"
  | "insentiviveIncludes"
  | "includes"
  | "numericEquality";

export function compareWithOperator(a: string, operator: Operator, b: string) {
  if (a === undefined || b === undefined) return false;
  switch (operator) {
    case "sensitiveStrictEquality":
      return a === b;
    case "insensitiveStrictEquality":
      return a.toString().toLowerCase() === b.toString().toLowerCase();
    case "insentiviveIncludes":
      return a.toLowerCase().includes(b.toLowerCase());
    case "includes":
      return a.includes(b);
    case "numericEquality":
      return Number(a) === Number(b);
  }
}

export function areObjectsEqual(object1: any, object2: any, ignoreProperties: string[] = []): boolean {
  const sortedObj1 = deepSortObjectByEntries(object1, ignoreProperties);
  const sortedObj2 = deepSortObjectByEntries(object2, ignoreProperties);
  return JSON.stringify(sortedObj1) === JSON.stringify(sortedObj2);
}

export function deepSortObjectByEntries(object: object, ignoreProperties: string[] = []): object {
  const sortedArrayFromObject = Object.entries(object).sort();
  const ignoredAndSortedArray = sortedArrayFromObject.filter(([key, _]) => !ignoreProperties.includes(key));
  const deepSortedArrayFromObject = ignoredAndSortedArray.map(([key, value]) => {
    if (value instanceof Date) return [key, value.getTime()];
    if (Array.isArray(value)) {
      const valuesMap = value.map(arrayItem => {
        if (arrayItem instanceof Date) return arrayItem.getTime();
        if (typeof arrayItem === "object") return deepSortObjectByEntries(arrayItem);
        return arrayItem;
      });
      return [key, valuesMap];
    }
    if (typeof value === "object") {
      return [key, deepSortObjectByEntries(value)];
    }
    return [key, value];
  });
  return Object.fromEntries(deepSortedArrayFromObject);
}

export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function debounce(cb: (...args: any[]) => void, delay = 300) {
  let timeOut: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
