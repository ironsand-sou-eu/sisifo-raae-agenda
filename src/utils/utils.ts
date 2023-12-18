export function areObjectsEqual(object1: any, object2: any, ignoreProperties: string[] = []): boolean {
  const sortedObj1 = deepSortObjectByEntries(object1, ignoreProperties);
  const sortedObj2 = deepSortObjectByEntries(object2, ignoreProperties);
  return JSON.stringify(sortedObj1) === JSON.stringify(sortedObj2);
}

function deepSortObjectByEntries(object: object, ignoreProperties: string[] = []): object {
  const sortedArrayFromObject = Object.entries(object).toSorted();
  const ignoredAndSortedArray = sortedArrayFromObject.filter(([key, _]) => !ignoreProperties.includes(key));
  const deepSortedArrayFromObject = ignoredAndSortedArray.map(([key, value]) => {
    if (value instanceof Date) return [key, value.getTime()];
    if (typeof value === "object") return [key, deepSortObjectByEntries(value)];
    return [key, value];
  });
  return Object.fromEntries(deepSortedArrayFromObject);
}
