import {ComponentType} from 'react'

export default <P>(Component: ComponentType<P>) =>
  Component.displayName || Component.name || 'Component'
