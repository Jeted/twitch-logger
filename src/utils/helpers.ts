const mapToObject = (map: Map<string, string | string[]>) => {
  return map.size && Object.fromEntries(map);
};

export const objProp = (param: string, value: any) => {
  if (value instanceof Map) {
    value = mapToObject(value);
  }
  return value && { [param]: value };
};
