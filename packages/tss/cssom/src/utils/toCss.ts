'use strict';

import toCssValue from './toCssValue';
import { ToCssOptions, JssStyle } from '../types';

function indentify(str: string, indent: number): string {
  return ''.padStart(indent, ' ') + str;
}

export default function toCss(
  selector: string | undefined,
  style: JssStyle,
  options: ToCssOptions = {}
): string {
  let result = ''

  if (!style) return result

  let { indent = 0 } = options
  const { fallbacks } = style

  if (selector) indent++

  // Apply fallbacks first.
  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (let index = 0; index < fallbacks.length; index++) {
        const fallback = fallbacks[index]
        for (const prop in fallback) {
          const value = fallback[prop]
          if (value != null) {
            if (result) result += '\n';
            result += `${indentify(`${prop}: ${toCssValue(value)};`, indent)}`;
          }
        }
      }//for
    } else {
      // Object syntax {fallbacks: {prop: value}}
      for (const prop in fallbacks) {
        const value = fallbacks[prop]
        if (value != null) {
          if (result) result += '\n';
          result += `${indentify(`${prop}: ${toCssValue(value)};`, indent)}`;
        }
      }
    }
  }

  // fallbacks done
  for (const prop in style) {
    const value = style[prop]
    if (value != null && prop !== 'fallbacks') { //FIXME: this fallback makes no sense
      if (result) result += '\n'
      result += `${indentify(`${prop}: ${toCssValue(value)};`, indent)}`
    }
  }

  // Allow empty style in this case, because properties will be added dynamically.
  if (!result && !options.allowEmpty) return result

  // When rule is being stringified before selector was defined.
  if (!selector) return result

  indent--

  if (result) result = `\n${result}\n`

  // FIXME: you can create scss aswell?? 
  return indentify(`${selector} {${result}`, indent) + indentify('}', indent)
}