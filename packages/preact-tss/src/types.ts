import {
  StyleSheetFactoryOptions,
  Jss,
  SheetsRegistry,
  SheetsManager,
  CreateGenerateIdOptions,
  GenerateId,
  ToCssOptions,
  RuleList,
  Renderer
} from 'jss'

export interface Class<T> {
  new(name: string): T;
}


export type Classes = { [index: string]: string };

export type KeyframesMap = { [index: string]: string };

export interface ContainerRule extends BaseRule {
  at: string;
  rules: RuleList;
}


export type RuleOptions = {
  selector?: string,
  scoped?: boolean,
  sheet?: StyleSheet,
  index?: number,
  parent?: ContainerRule | StyleSheet,
  classes: Classes,
  keyframes: KeyframesMap,
  jss: Jss,
  generateId: GenerateId,
  Renderer?: Class<Renderer> | null
}

interface BaseRule {
  type: string
  key: string
  isProcessed: boolean
  // eslint-disable-next-line no-use-before-define
  options: RuleOptions
  toString(options?: ToCssOptions): string
}

//import type {Node} from 'react'
import { Theming } from 'theming'

export type Managers = { [key: number]: SheetsManager }

export type HookOptions<Theme> = StyleSheetFactoryOptions & {
  index?: number,
  name?: string,
  theming?: Theming<Theme>
}

export type HOCOptions<Theme> = StyleSheetFactoryOptions & {
  index?: number,
  theming?: Theming<Theme>,
  injectTheme?: boolean
}

export type Context = {
  jss?: Jss,
  registry?: SheetsRegistry,
  managers?: Managers,
  id?: CreateGenerateIdOptions,
  classNamePrefix?: string,
  disableStylesGeneration?: boolean,
  media?: string,
  generateId?: GenerateId
}

export type HOCProps<Theme, Props> = Props & {
  theme: Theme,
  jssContext: Context,
  innerRef: any
}


export type InnerProps = {
  children?: Node,
  classes: Classes
}

export type DynamicRules = {
  [key: string]: BaseRule
}

export type StaticStyle = {}
export type DynamicStyle<Theme> = ({ theme: Theme }) => StaticStyle

export type StaticStyles = { [key: string]: StaticStyle }

export type ThemedStyles<Theme> = (theme: Theme) => StaticStyle | DynamicStyle<Theme>

export type Styles<Theme> = StaticStyles | ThemedStyles<Theme>
