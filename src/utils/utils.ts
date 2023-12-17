export function areObjectsEqual(object1: any, object2: any, ignoreProperties: string[] = []): boolean {
  if (Object.keys(object1).length !== Object.keys(object2).length) return false;
  Object.keys(object1).forEach(key => {
    const ignoredProperty = ignoreProperties.some(propToIgnore => key === propToIgnore);
    if (!ignoredProperty && object1[key] !== object2[key]) return false;
  });
  Object.keys(object2).forEach(key => {
    const ignoredProperty = ignoreProperties.some(propToIgnore => key === propToIgnore);
    if (!ignoredProperty && object1[key] !== object2[key]) return false;
  });
  return true;
}
