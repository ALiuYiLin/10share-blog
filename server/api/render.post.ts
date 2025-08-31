import markdown from 'markdown-it'
const md = new markdown()
export interface RenderBody {
  content: string
}
export default defineEventHandler(async (event) => {
  const body = await readBody<RenderBody>(event)
  return md.render(body.content)
})
