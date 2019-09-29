
import { StyleSheet } from 'jss'
import { StaticStyles } from '../types'

export interface SheetMeta {
  styles: StaticStyles,
  dynamicStyles: StaticStyles,
  dynamicRuleCounter: number
}

const sheetsMeta = new WeakMap<StyleSheet, SheetMeta>();

const wmap = new WeakMap<Date, number>();
const rc = wmap.get(new Date);


export function getMeta(sheet: StyleSheet) {
  return  sheetsMeta.get(sheet);
}

export const addMeta = (sheet: StyleSheet, meta: SheetMeta) => {
  sheetsMeta.set(sheet, meta)
}

