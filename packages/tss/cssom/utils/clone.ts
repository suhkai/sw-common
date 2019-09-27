import { CSSObject } from '../types';

const plainObjectConstrurctor = {}.constructor

export default function cloneStyle(style: CSSObject): CSSObject {
  if (style == null || typeof style !== 'object') return style
  if (Array.isArray(style)) return style.map(cloneStyle)
  if (style.constructor !== plainObjectConstrurctor) return style

  const newStyle = {}
  for (const name in style) {
    newStyle[name] = cloneStyle(style[name])
  }
  return newStyle
}