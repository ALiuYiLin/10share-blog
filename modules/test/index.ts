import { createResolver, defineNuxtModule, addComponentsDir } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'hello'
  },
  setup () {
    const resolver = createResolver(import.meta.url)
    const path = resolver.resolve('runtime/components/SvgIcon.vue')
    addComponentsDir({
      path: resolver.resolve('runtime/components')
    })
    console.log('path: ', path);
  }
})