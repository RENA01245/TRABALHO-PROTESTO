export function getParamId(params: Record<string, string | string[]>): string {
  const id = params.id;
  return Array.isArray(id) ? id[0] : id;
}
