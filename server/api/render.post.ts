import { createMarkdownInstance } from "~~/utils";

export default defineEventHandler(async (event) => {
  const {content} = await readBody<{content:string}>(event)
  const md = await createMarkdownInstance();
  return await md.renderAsync(content);
});
