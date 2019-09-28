const plainObjectConstrurctor = {}.constructor

export default function deepCLone<T>(style: T): T {
  if (style == null || typeof style !== 'object') return style
  if (Array.isArray(style)) {
    return style.map(deepCLone) as any;
  }
  if (style.constructor !== plainObjectConstrurctor) return style

  const newStyle: T = {} as any;
  for (const [name, value] of Object.entries(style)) {
    newStyle[name] = deepCLone(value);
  }
  return newStyle
}