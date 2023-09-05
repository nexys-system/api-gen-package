export const createEnum = (name: string, es: string[]): string => {
  const out = es
    .sort((a, b) => a.localeCompare(b))
    .map((e) => `  ${e} = "${e}",`);

  return [`enum ${name} {`, ...out, `}`].join("\n");
};

export const createEntities = (model: { name: string }[]): string => {
  const entities = model.map((e) => e.name);

  return "export " + createEnum("Entities", entities);
};
