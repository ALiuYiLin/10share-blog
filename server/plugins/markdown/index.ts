import { MarkdwonPlugin } from '#/utils'
import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import { componentPlugin } from '@mdit-vue/plugin-component';


export * from './code-wrapper'
export * from './custom'
export * from './hight-light'
export * from './v-pre'


export const zsfcPlugin:MarkdwonPlugin = {
  name: '',
  description: '',
  plugin: (md)=>md.use(sfcPlugin)
}


export const zcomponentPlugin:MarkdwonPlugin = {
  name: '',
  description: '',
  plugin: (md)=>md.use(componentPlugin)
}